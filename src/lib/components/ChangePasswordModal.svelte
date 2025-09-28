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

{#if isOpen}
	<div
		class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
		onclick={(event) => {
			if (event.target === event.currentTarget) {
				handleClose();
			}
		}}
		onkeydown={(event) => {
			if (event.key === "Escape") {
				event.preventDefault();
				handleClose();
			}
		}}
	>
		<div class="z-10 mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl" role="document">
			<div class="mb-4 flex items-center justify-between">
				<h2 id="modal-title" class="text-xl font-bold">Change Password</h2>
				<button
					onclick={handleClose}
					class="text-gray-500 hover:text-gray-700"
					aria-label="Close modal"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						></path>
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
			>
				<div class="mb-4">
					<label for="currentPassword" class="mb-2 block text-sm font-medium text-gray-700"
						>Current Password</label
					>
					<input
						type="password"
						id="currentPassword"
						name="currentPassword"
						required
						disabled={isSubmitting}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						placeholder="Enter current password"
					/>
				</div>

				<div class="mb-4">
					<label for="newPassword" class="mb-2 block text-sm font-medium text-gray-700"
						>New Password</label
					>
					<input
						type="password"
						id="newPassword"
						name="newPassword"
						required
						disabled={isSubmitting}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						placeholder="Enter new password"
					/>
				</div>

				<div class="mb-4">
					<label for="confirmPassword" class="mb-2 block text-sm font-medium text-gray-700"
						>Confirm Password</label
					>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						required
						disabled={isSubmitting}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						placeholder="Confirm new password"
					/>
				</div>

				{#if passwordError}
					<div class="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
						<p class="text-sm text-red-600">{passwordError}</p>
					</div>
				{/if}

				<div class="flex justify-end space-x-3">
					<button
						type="button"
						onclick={handleClose}
						disabled={isSubmitting}
						class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
					>
						{#if isSubmitting}
							<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
								<circle
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
									fill="none"
									class="opacity-25"
								></circle>
								<path
									fill="currentColor"
									class="opacity-75"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Changing...
						{:else}
							Change Password
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
