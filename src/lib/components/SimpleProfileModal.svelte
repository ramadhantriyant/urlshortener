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

	$effect(() => {
		if (isOpen) {
			clearPreview();
		}
	});

	let avatarSrc = $derived(previewUrl || userProfile?.avatar_url || "");
	let initial = $derived((userProfile?.full_name || session?.user?.email || "U")[0].toUpperCase());
</script>

<div class="modal {isOpen ? 'modal-open' : ''}">
	<div
		class="modal-box w-11/12 max-w-md overflow-hidden rounded-2xl border border-base-300 bg-base-200 p-0 shadow-2xl"
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-base-300 px-6 py-4">
			<h3 class="font-display text-base font-semibold text-base-content">Profile Settings</h3>
			<button
				onclick={onClose}
				aria-label="Close"
				class="flex h-8 w-8 items-center justify-center rounded-lg text-base-content/40 transition-colors hover:bg-base-300 hover:text-base-content"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>

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
			class="p-6"
		>
			<!-- Avatar section -->
			<div class="mb-5 flex items-center gap-4">
				<div
					class="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-neutral"
				>
					{#if avatarSrc}
						<img src={avatarSrc} alt="Profile" class="h-16 w-16 rounded-full object-cover" />
					{:else}
						<span class="font-display text-xl font-bold text-primary">{initial}</span>
					{/if}
				</div>
				<div class="flex-1">
					<label class="mb-1 block text-sm font-medium text-base-content/70" for="avatar">
						Profile photo
					</label>
					<input
						type="file"
						id="avatar"
						name="avatar"
						accept="image/*"
						disabled={isSubmitting}
						onchange={handleFileChange}
						class="w-full rounded-lg border border-base-300 bg-base-100 text-sm text-base-content/70 file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary hover:file:bg-primary/20 disabled:opacity-50"
					/>
					<p class="mt-1 text-xs text-base-content/30">PNG or JPG, max 5MB</p>
				</div>
			</div>

			<!-- Name field -->
			<div class="mb-4">
				<label class="mb-1.5 block text-sm font-medium text-base-content/70" for="fullName">
					Full name
				</label>
				<input
					type="text"
					id="fullName"
					name="fullName"
					value={userProfile?.full_name || ""}
					disabled={isSubmitting}
					placeholder="Your name"
					class="w-full rounded-lg border border-base-300 bg-base-100 px-3.5 py-2.5 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
				/>
			</div>

			<!-- Email (readonly) -->
			<div class="mb-6">
				<label class="mb-1.5 block text-sm font-medium text-base-content/70" for="profileEmail">
					Email
				</label>
				<input
					type="email"
					id="profileEmail"
					value={session?.user?.email || ""}
					readonly
					class="w-full rounded-lg border border-base-300 bg-base-300/50 px-3.5 py-2.5 text-sm text-base-content/50 focus:outline-none"
				/>
			</div>

			<!-- Actions -->
			<div class="flex items-center justify-end gap-2">
				<button
					type="button"
					onclick={onClose}
					disabled={isSubmitting}
					class="rounded-lg px-4 py-2 text-sm font-medium text-base-content/60 transition-colors hover:bg-base-300 hover:text-base-content disabled:opacity-50"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-content transition-opacity hover:opacity-90 disabled:opacity-50"
				>
					{#if isSubmitting}
						<span class="loading loading-xs loading-spinner"></span>
						Saving…
					{:else}
						Save Changes
					{/if}
				</button>
			</div>
		</form>
	</div>
	<button type="button" class="modal-backdrop" aria-label="Close profile modal" onclick={onClose}
	></button>
</div>
