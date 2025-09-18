import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session } = await safeGetSession();

	let userProfile = null;

	if (session?.user?.id) {
		const { data } = await supabase
			.from("user_profiles")
			.select("full_name")
			.eq("id", session.user.id)
			.single();

		userProfile = data;
	}

	return {
		session,
		userProfile
	};
};
