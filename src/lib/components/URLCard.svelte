<script lang="ts">
	import { enhance } from "$app/forms";
	import { resolve } from "$app/paths";
	import type { SubmitFunction } from "@sveltejs/kit";
	import ClickAnalyticsModal from "./ClickAnalyticsModal.svelte";

	interface ClickData {
		id: string;
		user_agent: string | null;
		referer: string | null;
		ip_address: string | null;
		country: string | null;
		city: string | null;
		clicked_at: string;
	}

	interface URL {
		id: string;
		short_code: string;
		original_url: string;
		clicks: number;
		click_data: ClickData[];
	}

	interface Props {
		url: URL;
		origin: string;
		isLast?: boolean;
	}

	let { url, origin, isLast = false }: Props = $props();
	let showAnalytics = $state(false);
	let copied = $state(false);

	function copyToClipboard() {
		navigator.clipboard.writeText(`${origin}/${url.short_code}`);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	const confirmDelete: SubmitFunction = ({ cancel }) => {
		if (!confirm("Are you sure you want to delete this URL? This action cannot be undone.")) {
			cancel();
		}
	};

	let shortDisplay = $derived(`${origin.replace(/^https?:\/\//, "")}/${url.short_code}`);
</script>

<div
	class="group flex items-center gap-3 bg-base-200 px-4 py-3.5 transition-colors hover:bg-base-300/50
		{!isLast ? 'border-b border-base-300' : ''}"
>
	<!-- Link icon -->
	<div
		class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15"
	>
		<svg class="h-3.5 w-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
			/>
		</svg>
	</div>

	<!-- URLs -->
	<div class="min-w-0 flex-1">
		<a
			href={resolve(`/${url.short_code}`)}
			target="_blank"
			rel="external noopener noreferrer"
			data-sveltekit-reload
			class="font-mono-url block truncate text-sm font-medium text-primary hover:underline"
		>
			{shortDisplay}
		</a>
		<p class="mt-0.5 truncate text-xs text-base-content/40" title={url.original_url}>
			{url.original_url}
		</p>
	</div>

	<!-- Click count -->
	<div class="flex-shrink-0 text-right">
		<span class="font-display text-sm font-semibold text-base-content tabular-nums"
			>{url.clicks.toLocaleString()}</span
		>
		<p class="text-xs text-base-content/30">clicks</p>
	</div>

	<!-- Actions -->
	<div class="flex flex-shrink-0 items-center gap-0.5">
		<!-- Copy -->
		<button
			onclick={copyToClipboard}
			title={copied ? "Copied!" : "Copy short URL"}
			aria-label="Copy short URL"
			class="flex h-8 w-8 items-center justify-center rounded-lg text-base-content/40 transition-colors hover:bg-base-300 hover:text-base-content {copied
				? 'text-success'
				: ''}"
		>
			{#if copied}
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			{:else}
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
			{/if}
		</button>

		<!-- Analytics -->
		<button
			onclick={() => (showAnalytics = true)}
			title="View click analytics"
			aria-label="View click analytics"
			class="flex h-8 w-8 items-center justify-center rounded-lg text-base-content/40 transition-colors hover:bg-base-300 hover:text-base-content"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
				/>
			</svg>
		</button>

		<!-- Delete -->
		<form method="post" action="?/deleteUrl" class="inline" use:enhance={confirmDelete}>
			<input type="hidden" name="url_id" value={url.id} />
			<button
				type="submit"
				title="Delete URL"
				aria-label="Delete URL"
				class="flex h-8 w-8 items-center justify-center rounded-lg text-base-content/40 transition-colors hover:bg-error/10 hover:text-error"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
					/>
				</svg>
			</button>
		</form>
	</div>
</div>

<ClickAnalyticsModal
	isOpen={showAnalytics}
	onClose={() => (showAnalytics = false)}
	shortCode={url.short_code}
	clicks={url.click_data}
/>
