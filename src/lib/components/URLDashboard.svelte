<script lang="ts">
	import URLCard from "./URLCard.svelte";
	import Alert from "./Alert.svelte";
	import type { ActionData } from "../../routes/$types";

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
		urls: URL[];
		form: ActionData;
		origin: string;
	}

	let { urls, form, origin }: Props = $props();
</script>

<div>
	<!-- Section header -->
	<div class="mb-3 flex items-center justify-between">
		<div class="flex items-center gap-2">
			<span
				class="font-display text-xs font-semibold tracking-widest text-base-content/30 uppercase"
				>Your URLs</span
			>
			{#if urls.length > 0}
				<span
					class="font-mono-url rounded-full bg-base-300 px-2 py-0.5 text-xs text-base-content/50"
					>{urls.length}</span
				>
			{/if}
		</div>
	</div>

	{#if form?.success && form?.message === "URL deleted successfully"}
		<div class="mb-3">
			<Alert message={form.message} type="success" />
		</div>
	{/if}

	{#if urls.length === 0}
		<div
			class="flex flex-col items-center justify-center rounded-xl border border-dashed border-base-300 py-16 text-center"
		>
			<div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-base-200">
				<svg
					class="h-5 w-5 text-base-content/30"
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
			<p class="text-sm font-medium text-base-content/40">No short links yet</p>
			<p class="mt-1 text-xs text-base-content/25">Paste a URL above to get started</p>
		</div>
	{:else}
		<div class="overflow-hidden rounded-xl border border-base-300">
			{#each urls as url, i (url.id)}
				<URLCard {url} {origin} isLast={i === urls.length - 1} />
			{/each}
		</div>
	{/if}
</div>
