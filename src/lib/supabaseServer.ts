import { createServerClient } from "@supabase/ssr";
import { type RequestEvent } from "@sveltejs/kit";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from "$env/static/public";

export function createSupabaseClient(event: RequestEvent) {
	return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			get: (name) => event.cookies.get(name),
			set: (name, value, options) => {
				event.cookies.set(name, value, { ...options, path: "/" });
			},
			remove: (name, options) => {
				event.cookies.delete(name, { ...options, path: "/" });
			}
		}
	});
}
