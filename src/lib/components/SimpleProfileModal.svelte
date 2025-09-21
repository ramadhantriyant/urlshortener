<script lang="ts">
	import { enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		userProfile: any;
		session: any;
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
		const fileInput = document.getElementById('avatar') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	}

	// Clear preview when modal opens
	$effect(() => {
		if (isOpen) {
			clearPreview();
		}
	});
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="modal-title">
		<button
			class="fixed inset-0 bg-black bg-opacity-50"
			onclick={onClose}
			aria-label="Close modal"
		></button>
		<div class="bg-white p-6 rounded-lg shadow-xl z-10 max-w-md w-full mx-4">
			<div class="flex justify-between items-center mb-4">
				<h2 id="modal-title" class="text-xl font-bold">Profile Settings</h2>
				<button
					onclick={onClose}
					class="text-gray-500 hover:text-gray-700"
					aria-label="Close modal"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
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
						if (result.type === 'success') {
							previewUrl = "";
							await invalidateAll(); // Refresh all layout data including userProfile
							onClose();
						}
					};
				}}
			>
				<!-- Profile Photo Upload -->
				<div class="mb-6">
					<label for="avatar" class="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
					<div class="flex items-center space-x-4">
						<!-- Photo Preview -->
						<div class="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden" aria-hidden="true">
							{#if previewUrl}
								<img src={previewUrl} alt="Profile preview" class="h-full w-full object-cover" />
							{:else if userProfile?.avatar_url}
								<img src={userProfile.avatar_url} alt="Current profile" class="h-full w-full object-cover" />
							{:else}
								<svg class="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
									<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
								</svg>
							{/if}
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
								aria-describedby="avatar-help"
								class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
							/>
							<p id="avatar-help" class="mt-1 text-xs text-gray-500">PNG, JPG up to 5MB</p>
						</div>
					</div>
				</div>

				<div class="mb-4">
					<label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
					<input
						type="text"
						id="fullName"
						name="fullName"
						value={userProfile?.full_name || ""}
						disabled={isSubmitting}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
					/>
				</div>

				<div class="mb-4">
					<label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
					<input
						type="email"
						value={session?.user?.email || ""}
						readonly
						class="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-500"
					/>
				</div>

				<div class="flex justify-end space-x-3">
					<button
						type="button"
						onclick={onClose}
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
							Saving...
						{:else}
							Save
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}