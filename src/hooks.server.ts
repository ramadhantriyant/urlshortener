import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from "$env/static/public";
import { createServerClient } from "@supabase/ssr";
import { type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const supabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll().map(({ name, value }) => ({ name, value }));
			},
			setAll(cookies) {
				cookies.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: "/" });
				});
			}
		}
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error || !user) {
			return { session: null, user: null };
		}

		// Create a minimal session-like object that contains the authenticated user
		const session = {
			user,
			access_token: "", // We don't need the token for this app
			refresh_token: "",
			expires_in: 0,
			expires_at: 0,
			token_type: "bearer"
		};

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === "content-range" || name === "x-supabase-api-version";
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
