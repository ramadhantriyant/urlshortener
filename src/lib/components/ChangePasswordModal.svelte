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
	<div class="modal-box w-11/12 max-w-md">
		<form method="dialog">
			<button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm" onclick={handleClose}
				>✕</button
			>
		</form>

		<h3 class="mb-4 flex items-center gap-2 text-lg font-bold">
			<svg class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
				></path>
			</svg>
			Change Password
		</h3>

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
		>
			<div class="form-control mb-4 w-full">
				<label class="label" for="currentPassword">
					<span class="label-text">Current Password</span>
				</label>
				<input
					type="password"
					id="currentPassword"
					name="currentPassword"
					required
					disabled={isSubmitting}
					placeholder="Enter current password"
					class="input-bordered input w-full"
				/>
			</div>

			<div class="form-control mb-4 w-full">
				<label class="label" for="newPassword">
					<span class="label-text">New Password</span>
				</label>
				<input
					type="password"
					id="newPassword"
					name="newPassword"
					required
					disabled={isSubmitting}
					placeholder="Enter new password (min 6 characters)"
					class="input-bordered input w-full"
				/>
				<div class="label" aria-hidden="true">
					<span class="label-text-alt">Minimum 6 characters</span>
				</div>
			</div>

			<div class="form-control mb-4 w-full">
				<label class="label" for="confirmPassword">
					<span class="label-text">Confirm New Password</span>
				</label>
				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					required
					disabled={isSubmitting}
					placeholder="Confirm new password"
					class="input-bordered input w-full"
				/>
			</div>

			{#if passwordError}
				<div class="mb-4 alert alert-error">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 shrink-0 stroke-current"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>{passwordError}</span>
				</div>
			{/if}

			<div class="modal-action">
				<button type="button" onclick={handleClose} disabled={isSubmitting} class="btn btn-ghost">
					Cancel
				</button>
				<button type="submit" disabled={isSubmitting} class="btn btn-primary">
					{#if isSubmitting}
						<span class="loading loading-sm loading-spinner"></span>
						Changing...
					{:else}
						<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							></path>
						</svg>
						Change Password
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
