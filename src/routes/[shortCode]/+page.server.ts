import { redirect, error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals: { supabase }, request }) => {
	const { shortCode } = params;

	// Get the URL from database
	const { data: urlData, error: fetchError } = await supabase
		.from("urls")
		.select("id, original_url, is_active")
		.eq("short_code", shortCode)
		.eq("is_active", true)
		.single();

	type UrlData = {
		id: string;
		original_url: string;
		is_active: boolean;
	};

	if (fetchError || !urlData) {
		throw error(404, "Short URL not found");
	}

	const typedUrlData = urlData as UrlData;

	// Track the click
	const userAgent = request.headers.get("user-agent") || null;
	const referer = request.headers.get("referer") || null;

	// Get client IP (this will work better in production)
	const clientIP =
		request.headers.get("x-forwarded-for")?.split(",")[0] ||
		request.headers.get("x-real-ip") ||
		null;

	// Get Cloudflare geolocation data
	type CloudflareRequest = Request & {
		cf?: {
			country?: string;
			city?: string;
		};
	};

	const cfRequest = request as CloudflareRequest;
	const country = cfRequest.cf?.country ?? null;
	const city = cfRequest.cf?.city ?? null;

	// Insert click record
	await supabase.from("clicks").insert([
		{
			url_id: typedUrlData.id,
			user_agent: userAgent,
			referer: referer,
			ip_address: clientIP,
			country: country,
			city: city
		}
	]);

	// Increment click counter atomically using SQL function
	await supabase.rpc("increment_clicks", { url_id: typedUrlData.id });

	// Redirect to original URL
	throw redirect(302, typedUrlData.original_url);
};
