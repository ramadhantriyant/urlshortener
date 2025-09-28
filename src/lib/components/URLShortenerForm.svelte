<script lang="ts">
	import { enhance } from "$app/forms";
	import Alert from "./Alert.svelte";
	import type { ActionData } from "../../routes/$types";

	interface Props {
		form: ActionData;
		origin: string;
	}

	let { form, origin }: Props = $props();
	let isSubmitting = $state(false);

	function copyShortUrl() {
		if (form?.shortCode) {
			navigator.clipboard.writeText(`${origin}/${form.shortCode}`);
		}
	}
</script>

<div class="card mx-auto mb-8 w-full max-w-2xl bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title text-2xl font-bold">
			<svg class="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
				></path>
			</svg>
			Shorten a URL
		</h2>

		{#if form?.message && form?.message !== "URL deleted successfully"}
			<Alert message={form.message} type={form.success ? "success" : "error"} />
		{/if}

		{#if form?.success && form?.shortCode}
			<div class="mb-6 alert alert-success">
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
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<div class="flex-1">
					<div class="font-medium">URL shortened successfully!</div>
					<div class="mt-2 flex items-center gap-2">
						<input
							type="text"
							value="{origin}/{form.shortCode}"
							readonly
							class="input-bordered input input-sm flex-1"
						/>
						<button onclick={copyShortUrl} class="btn btn-sm btn-success">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
								></path>
							</svg>
							Copy
						</button>
					</div>
				</div>
			</div>
		{/if}

		<form
			method="post"
			action="?/shorten"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
		>
			<div class="form-control w-full">
				<label class="label" for="url">
					<span class="label-text">Enter your long URL</span>
					<span class="label-text-alt">Required</span>
				</label>
				<input
					type="url"
					id="url"
					name="url"
					required
					disabled={isSubmitting}
					placeholder="https://example.com/very-long-url"
					class="input-bordered input w-full"
				/>
			</div>

			<div class="form-control w-full">
				<label class="label" for="custom_code">
					<span class="label-text">Custom short code</span>
					<span class="label-text-alt">Optional</span>
				</label>
				<input
					type="text"
					id="custom_code"
					name="custom_code"
					placeholder="mycustomcode"
					pattern="[a-zA-Z0-9]+"
					disabled={isSubmitting}
					class="input-bordered input w-full"
				/>
				<div class="label" aria-hidden="true">
					<span class="label-text-alt">Alphanumeric characters only</span>
				</div>
			</div>

			<div class="form-control mt-6">
				<button type="submit" disabled={isSubmitting} class="btn btn-lg btn-primary">
					{#if isSubmitting}
						<span class="loading loading-md loading-spinner"></span>
						Shortening...
					{:else}
						<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
							></path>
						</svg>
						Shorten URL
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
