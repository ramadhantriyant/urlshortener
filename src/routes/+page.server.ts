import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session } = await safeGetSession();

	let urls: Array<{
		id: string;
		original_url: string;
		short_code: string;
		clicks: number;
		created_at: string;
	}> = [];
	if (session) {
		const { data } = await supabase
			.from("urls")
			.select("id, original_url, short_code, clicks, created_at")
			.eq("user_id", session.user.id)
			.eq("is_active", true)
			.order("created_at", { ascending: false });

		urls = data || [];
	}

	return { session, urls };
};

export const actions: Actions = {
	logout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		throw redirect(303, "/");
	},

	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		if (!email || !password) {
			return fail(400, { message: "Email and password are required" });
		}

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(400, { message: error.message });
		}

		throw redirect(303, "/");
	},

	register: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		if (!email || !password) {
			return fail(400, { message: "Email and password are required" });
		}

		const { error: authError } = await supabase.auth.signUp({
			email,
			password
		});

		if (authError) {
			return fail(400, { message: authError.message });
		}

		return { success: true, message: "Check your email for confirmation link" };
	},

	shorten: async ({ request, locals: { supabase, session } }) => {
		if (!session) {
			return fail(401, { message: "You must be logged in to shorten URLs" });
		}

		const formData = await request.formData();
		const originalUrl = formData.get("url") as string;
		const customCode = formData.get("custom_code") as string;

		if (!originalUrl) {
			return fail(400, { message: "URL is required" });
		}

		// Validate URL format
		try {
			new URL(originalUrl);
		} catch {
			return fail(400, { message: "Invalid URL format" });
		}

		// Validate custom code length
		if (customCode && customCode.length > 16) {
			return fail(400, { message: "Custom code must be 16 characters or less" });
		}

		// Validate custom code format
		if (customCode && !/^[a-zA-Z0-9]+$/.test(customCode)) {
			return fail(400, { message: "Custom code can only contain letters and numbers" });
		}

		// Generate short code
		const shortCode = customCode || generateShortCode();

		// Check if short code already exists
		const { data: existing, error: existingError } = await supabase
			.from("urls")
			.select("id")
			.eq("short_code", shortCode)
			.single();

		if (existingError && existingError.code !== 'PGRST116') {
			return fail(500, { message: "Failed to check short code availability" });
		}

		if (existing) {
			return fail(400, { message: "Short code already exists. Try a different one." });
		}

		// Insert new URL
		const insertData = {
			user_id: session.user.id,
			original_url: originalUrl,
			short_code: shortCode
		};

		const { error } = await supabase.from("urls").insert([insertData]).select().single();

		if (error) {
			console.error("Database error:", error);
			console.error("Error details:", {
				code: error.code,
				message: error.message,
				details: error.details,
				hint: error.hint
			});
			return fail(500, { message: `Failed to create short URL: ${error.message}` });
		}

		return { success: true, shortCode, originalUrl };
	},

	deleteUrl: async ({ request, locals: { supabase, session } }) => {
		if (!session) {
			return fail(401, { message: "You must be logged in to delete URLs" });
		}

		const formData = await request.formData();
		const urlId = formData.get("url_id") as string;

		if (!urlId) {
			return fail(400, { message: "URL ID is required" });
		}

		// Delete the URL (this will also cascade delete related clicks due to FK constraint)
		const { error } = await supabase
			.from("urls")
			.delete()
			.eq("id", urlId)
			.eq("user_id", session.user.id); // Ensure user can only delete their own URLs

		if (error) {
			console.error("Delete error:", error);
			return fail(500, { message: "Failed to delete URL" });
		}

		return { success: true, message: "URL deleted successfully" };
	}
};

function generateShortCode(): string {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < 6; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}
