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
	},

	updateProfile: async ({ request, locals: { supabase, session } }) => {
		if (!session) {
			return fail(401, { message: "You must be logged in" });
		}

		const formData = await request.formData();
		const fullName = formData.get("fullName") as string;
		const avatarFile = formData.get("avatar") as File;

		let avatarUrl = null;

		// Handle file upload if provided
		if (avatarFile && avatarFile.size > 0) {
			// Check file size (5MB limit)
			if (avatarFile.size > 5 * 1024 * 1024) {
				return fail(400, { message: "File size must be less than 5MB" });
			}

			// Check file type
			if (!avatarFile.type.startsWith("image/")) {
				return fail(400, { message: "File must be an image" });
			}

			const fileExt = avatarFile.name.split('.').pop();
			const fileName = `${session.user.id}.${fileExt}`;

			// Delete any existing files for this user (to handle extension changes)
			const { data: existingFiles, error: listError } = await supabase.storage
				.from("urlshort-userprofile")
				.list('', {
					search: session.user.id
				});

			if (listError) {
				console.error("Error listing files:", listError);
			}

			if (existingFiles && existingFiles.length > 0) {
				const filesToDelete = existingFiles
					.filter(file => file.name.startsWith(`${session.user.id}.`))
					.map(file => file.name);

				if (filesToDelete.length > 0) {
					console.log("Deleting files:", filesToDelete);
					const { error: deleteError } = await supabase.storage
						.from("urlshort-userprofile")
						.remove(filesToDelete);

					if (deleteError) {
						console.error("Error deleting files:", deleteError);
						// Continue with upload even if delete fails
					} else {
						console.log("Successfully deleted files:", filesToDelete);
					}
				}
			}

			// Upload to Supabase storage
			const { error: uploadError } = await supabase.storage
				.from("urlshort-userprofile")
				.upload(fileName, avatarFile, {
					upsert: true
				});

			if (uploadError) {
				console.error("Upload error:", uploadError);
				return fail(500, { message: "Failed to upload profile photo" });
			}

			// Get public URL
			const { data: urlData } = supabase.storage
				.from("urlshort-userprofile")
				.getPublicUrl(fileName);

			avatarUrl = urlData.publicUrl;
		}

		// Upsert user profile
		const updateData: any = { id: session.user.id };
		if (fullName) updateData.full_name = fullName;
		if (avatarUrl) updateData.avatar_url = avatarUrl;

		const { error } = await supabase
			.from("user_profiles")
			.upsert(updateData);

		if (error) {
			console.error("Profile update error:", error);
			return fail(500, { message: "Failed to update profile" });
		}

		return { success: true, message: "Profile updated successfully" };
	},

	changePassword: async ({ request, locals: { supabase, session } }) => {
		if (!session) {
			return fail(401, { message: "You must be logged in" });
		}

		const formData = await request.formData();
		const currentPassword = formData.get("currentPassword") as string;
		const newPassword = formData.get("newPassword") as string;
		const confirmPassword = formData.get("confirmPassword") as string;

		if (!currentPassword || !newPassword || !confirmPassword) {
			return fail(400, { message: "All fields are required" });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { message: "New passwords do not match" });
		}

		if (newPassword.length < 6) {
			return fail(400, { message: "Password must be at least 6 characters" });
		}

		// Verify current password by attempting to sign in
		const { error: verifyError } = await supabase.auth.signInWithPassword({
			email: session.user.email!,
			password: currentPassword
		});

		if (verifyError) {
			return fail(400, { message: "Current password is incorrect" });
		}

		// Update password
		const { error: updateError } = await supabase.auth.updateUser({
			password: newPassword
		});

		if (updateError) {
			return fail(500, { message: "Failed to update password" });
		}

		return { success: true, message: "Password changed successfully" };
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
