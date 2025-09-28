<script lang="ts">
	import { enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import type { Session } from "@supabase/supabase-js";

	type UserProfile = {
		full_name: string | null;
		avatar_url: string | null;
	};

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		userProfile: UserProfile | null;
		session: Session | null;
	}

	let { isOpen, onClose, userProfile, session }: Props = $props();
	let isSubmitting = $state(false);
	let previewUrl = $state("");

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				previewUrl = reader.result as string;
			};
			reader.readAsDataURL(file);
		} else {
			previewUrl = "";
		}
	}

	function clearPreview() {
		previewUrl = "";
		const fileInput = document.getElementById("avatar") as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
	}

	// Clear preview when modal opens
	$effect(() => {
		if (isOpen) {
			clearPreview();
		}
	});
</script>

<div class="modal {isOpen ? 'modal-open' : ''}">
	<div class="modal-box w-11/12 max-w-md">
		<form method="dialog">
			<button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm" onclick={onClose}
				>✕</button
			>
		</form>

		<h3 class="mb-4 flex items-center gap-2 text-lg font-bold">
			<svg class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
				></path>
			</svg>
			Profile Settings
		</h3>

		<form
			method="post"
			action="?/updateProfile"
			enctype="multipart/form-data"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result, update }) => {
					isSubmitting = false;
					await update();
					if (result.type === "success") {
						previewUrl = "";
						await invalidateAll();
						onClose();
					}
				};
			}}
		>
			<!-- Profile Photo Upload -->
			<div class="form-control mb-4 w-full">
				<label class="label" for="avatar">
					<span class="label-text">Profile Photo</span>
				</label>
				<div class="flex items-center gap-4">
					<!-- Photo Preview -->
					<div class="avatar">
						<div class="w-20 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
							{#if previewUrl}
								<img src={previewUrl} alt="Profile preview" />
							{:else if userProfile?.avatar_url}
								<img src={userProfile.avatar_url} alt="Current profile" />
							{:else}
								<div
									class="flex h-20 w-20 items-center justify-center rounded-full bg-neutral text-neutral-content"
								>
									<svg class="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
							{/if}
						</div>
					</div>

					<!-- File Input -->
					<div class="flex-1">
						<input
							type="file"
							id="avatar"
							name="avatar"
							accept="image/*"
							disabled={isSubmitting}
							onchange={handleFileChange}
							class="file-input-bordered file-input w-full file-input-primary"
						/>
						<div class="label">
							<span class="label-text-alt">PNG, JPG up to 5MB</span>
						</div>
					</div>
				</div>
			</div>

			<div class="form-control mb-4 w-full">
				<label class="label" for="fullName">
					<span class="label-text">Full Name</span>
				</label>
				<input
					type="text"
					id="fullName"
					name="fullName"
					value={userProfile?.full_name || ""}
					disabled={isSubmitting}
					placeholder="Enter your full name"
					class="input-bordered input w-full"
				/>
			</div>

			<div class="form-control mb-6 w-full">
				<label class="label" for="profileEmail">
					<span class="label-text">Email</span>
				</label>
				<input
					type="email"
					id="profileEmail"
					value={session?.user?.email || ""}
					readonly
					class="input-bordered input w-full bg-base-200"
				/>
			</div>

			<div class="modal-action">
				<button type="button" onclick={onClose} disabled={isSubmitting} class="btn btn-ghost">
					Cancel
				</button>
				<button type="submit" disabled={isSubmitting} class="btn btn-primary">
					{#if isSubmitting}
						<span class="loading loading-sm loading-spinner"></span>
						Saving...
					{:else}
						<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							></path>
						</svg>
						Save Changes
					{/if}
				</button>
			</div>
		</form>
	</div>
	<button type="button" class="modal-backdrop" aria-label="Close profile modal" onclick={onClose}
	></button>
</div>
