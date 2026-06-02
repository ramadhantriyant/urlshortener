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
	let showCustomCode = $state(false);
	let copied = $state(false);

	function copyShortUrl() {
		if (form?.shortCode) {
			navigator.clipboard.writeText(`${origin}/${form.shortCode}`);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}
</script>

<div>
	<!-- Section label -->
	<div class="mb-3 flex items-center gap-2">
		<span class="font-display text-xs font-semibold tracking-widest text-base-content/30 uppercase"
			>Shorten a URL</span
		>
	</div>

	<!-- Error alert (not success — success is shown inline) -->
	{#if form?.message && !form?.success && form?.message !== "URL deleted successfully"}
		<div class="mb-3">
			<Alert message={form.message} type="error" />
		</div>
	{/if}

	<!-- Success result bar -->
	{#if form?.success && form?.shortCode}
		<div
			class="mb-3 flex items-center gap-3 rounded-xl border border-success/20 bg-success/10 px-4 py-3"
		>
			<svg
				class="h-4 w-4 flex-shrink-0 text-success"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			<span class="font-mono-url flex-1 truncate text-sm text-success"
				>{origin}/{form.shortCode}</span
			>
			<button
				onclick={copyShortUrl}
				class="flex items-center gap-1.5 rounded-md border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition-all hover:bg-success/20"
			>
				{#if copied}
					<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
					Copied!
				{:else}
					<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
						/>
					</svg>
					Copy
				{/if}
			</button>
		</div>
	{/if}

	<!-- Main input bar -->
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
		<div
			class="flex items-center gap-2 rounded-xl border border-base-300 bg-base-200 p-2 transition-all focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10"
		>
			<div class="flex-shrink-0 pl-2">
				<svg
					class="h-4 w-4 text-base-content/30"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
					/>
				</svg>
			</div>
			<input
				type="url"
				id="url"
				name="url"
				required
				disabled={isSubmitting}
				placeholder="Paste a long URL to shorten…"
				class="flex-1 bg-transparent py-1.5 text-sm text-base-content placeholder:text-base-content/30 focus:outline-none disabled:opacity-50"
			/>
			<button
				type="submit"
				disabled={isSubmitting}
				class="flex flex-shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-content transition-opacity hover:opacity-90 disabled:opacity-50"
			>
				{#if isSubmitting}
					<span class="loading loading-xs loading-spinner"></span>
				{:else}
					Shorten
					<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				{/if}
			</button>
		</div>

		<!-- Custom code toggle -->
		<div class="mt-2">
			<button
				type="button"
				onclick={() => (showCustomCode = !showCustomCode)}
				class="flex items-center gap-1.5 text-xs text-base-content/40 transition-colors hover:text-base-content/70"
			>
				<svg
					class="h-3.5 w-3.5 transition-transform {showCustomCode ? 'rotate-45' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				{showCustomCode ? "Remove custom code" : "Add custom code"}
			</button>

			{#if showCustomCode}
				<div class="mt-2 flex items-center gap-2">
					<span class="font-mono-url flex-shrink-0 text-xs text-base-content/30"
						>{origin.replace(/^https?:\/\//, "")}/</span
					>
					<input
						type="text"
						id="custom_code"
						name="custom_code"
						placeholder="mycustomcode"
						pattern="[a-zA-Z0-9]+"
						maxlength="16"
						disabled={isSubmitting}
						class="font-mono-url flex-1 rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
					/>
				</div>
				<p class="mt-1.5 text-xs text-base-content/30">
					Letters and numbers only, up to 16 characters
				</p>
			{/if}
		</div>
	</form>
</div>
