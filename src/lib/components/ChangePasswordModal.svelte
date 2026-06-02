<script lang="ts">
	import { enhance } from "$app/forms";
	import type { Session } from "@supabase/supabase-js";

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		session: Session | null;
	}

	let { isOpen, onClose, session }: Props = $props();
	let isSubmitting = $state(false);
	let passwordError = $state("");

	function clearForm() {
		passwordError = "";
		const form = document.getElementById("changePasswordForm") as HTMLFormElement;
		if (form) {
			form.reset();
		}
	}

	function handleClose() {
		clearForm();
		onClose();
	}

	$effect(() => {
		if (!session && isOpen) {
			handleClose();
		}
	});
</script>

<div class="modal {isOpen ? 'modal-open' : ''}">
	<div
		class="modal-box w-11/12 max-w-md overflow-hidden rounded-2xl border border-base-300 bg-base-200 p-0 shadow-2xl"
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-base-300 px-6 py-4">
			<h3 class="font-display text-base font-semibold text-base-content">Change Password</h3>
			<button
				onclick={handleClose}
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
			id="changePasswordForm"
			method="post"
			action="?/changePassword"
			use:enhance={() => {
				isSubmitting = true;
				passwordError = "";
				return async ({ result, update }) => {
					isSubmitting = false;
					await update();
					if (result.type === "success") {
						clearForm();
						handleClose();
					} else if (result.type === "failure") {
						const data = result.data as { message?: string } | undefined;
						passwordError = data?.message ?? "An error occurred";
					}
				};
			}}
			class="p-6"
		>
			<div class="space-y-4">
				<div>
					<label
						class="mb-1.5 block text-sm font-medium text-base-content/70"
						for="currentPassword"
					>
						Current password
					</label>
					<input
						type="password"
						id="currentPassword"
						name="currentPassword"
						required
						disabled={isSubmitting}
						placeholder="Enter current password"
						class="w-full rounded-lg border border-base-300 bg-base-100 px-3.5 py-2.5 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
					/>
				</div>

				<div>
					<label class="mb-1.5 block text-sm font-medium text-base-content/70" for="newPassword">
						New password
					</label>
					<input
						type="password"
						id="newPassword"
						name="newPassword"
						required
						disabled={isSubmitting}
						placeholder="Min. 6 characters"
						class="w-full rounded-lg border border-base-300 bg-base-100 px-3.5 py-2.5 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
					/>
				</div>

				<div>
					<label
						class="mb-1.5 block text-sm font-medium text-base-content/70"
						for="confirmPassword"
					>
						Confirm new password
					</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						required
						disabled={isSubmitting}
						placeholder="Repeat new password"
						class="w-full rounded-lg border border-base-300 bg-base-100 px-3.5 py-2.5 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
					/>
				</div>

				{#if passwordError}
					<div
						class="flex items-start gap-2 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error"
					>
						<svg
							class="mt-0.5 h-4 w-4 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						{passwordError}
					</div>
				{/if}
			</div>

			<!-- Actions -->
			<div class="mt-6 flex items-center justify-end gap-2">
				<button
					type="button"
					onclick={handleClose}
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
						Updating…
					{:else}
						Update Password
					{/if}
				</button>
			</div>
		</form>
	</div>
	<button
		type="button"
		class="modal-backdrop"
		aria-label="Close change password modal"
		onclick={handleClose}
	></button>
</div>
