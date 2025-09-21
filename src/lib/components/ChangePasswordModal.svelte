<script lang="ts">
	import { enhance } from "$app/forms";

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		session: any;
	}

	let { isOpen, onClose, session }: Props = $props();
	let isSubmitting = $state(false);
	let passwordError = $state("");

	function clearForm() {
		passwordError = "";
		const form = document.getElementById('changePasswordForm') as HTMLFormElement;
		if (form) {
			form.reset();
		}
	}

	function handleClose() {
		clearForm();
		onClose();
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" role="dialog" aria-modal="true" aria-labelledby="modal-title" onclick={handleClose}>
		<div class="bg-white p-6 rounded-lg shadow-xl z-10 max-w-md w-full mx-4" onclick={(e) => e.stopPropagation()}>
			<div class="flex justify-between items-center mb-4">
				<h2 id="modal-title" class="text-xl font-bold">Change Password</h2>
				<button
					onclick={handleClose}
					class="text-gray-500 hover:text-gray-700"
					aria-label="Close modal"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
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
						if (result.type === 'success') {
							clearForm();
							handleClose();
						} else if (result.type === 'failure') {
							passwordError = result.data?.message || "An error occurred";
						}
					};
				}}
			>
				<div class="mb-4">
					<label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
					<input
						type="password"
						id="currentPassword"
						name="currentPassword"
						required
						disabled={isSubmitting}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
						placeholder="Enter current password"
					/>
				</div>

				<div class="mb-4">
					<label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
					<input
						type="password"
						id="newPassword"
						name="newPassword"
						required
						disabled={isSubmitting}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
						placeholder="Enter new password"
					/>
				</div>

				<div class="mb-4">
					<label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						required
						disabled={isSubmitting}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
						placeholder="Confirm new password"
					/>
				</div>

				{#if passwordError}
					<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
						<p class="text-sm text-red-600">{passwordError}</p>
					</div>
				{/if}

				<div class="flex justify-end space-x-3">
					<button
						type="button"
						onclick={handleClose}
						disabled={isSubmitting}
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
					>
						{#if isSubmitting}
							<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
								<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" class="opacity-25"></circle>
								<path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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