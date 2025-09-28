<script lang="ts">
	import URLCard from "./URLCard.svelte";
	import Alert from "./Alert.svelte";
	import type { ActionData } from "../../routes/$types";

	interface URL {
		id: string;
		short_code: string;
		original_url: string;
		clicks: number;
	}

	interface Props {
		urls: URL[];
		form: ActionData;
		origin: string;
	}

	let { urls, form, origin }: Props = $props();
</script>

<div class="card mx-auto w-full max-w-4xl bg-base-100 shadow-xl">
	<div class="card-body">
		<div class="flex items-center justify-between">
			<h2 class="card-title text-2xl font-bold">
				<svg class="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
					></path>
				</svg>
				Your URLs
			</h2>
			{#if urls.length > 0}
				<div class="badge badge-lg badge-primary">
					{urls.length} URL{urls.length === 1 ? "" : "s"}
				</div>
			{/if}
		</div>

		{#if form?.success && form?.message && form?.message === "URL deleted successfully"}
			<Alert message={form.message} type="success" />
		{/if}

		{#if urls.length === 0}
			<div class="hero min-h-[200px]">
				<div class="hero-content text-center">
					<div class="max-w-md">
						<svg
							class="mx-auto mb-4 h-24 w-24 text-base-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
							></path>
						</svg>
						<h3 class="text-xl font-bold">No URLs created yet</h3>
						<p class="py-2 text-base-content/70">Start by shortening your first URL above!</p>
					</div>
				</div>
			</div>
		{:else}
			<div class="space-y-4">
				{#each urls as url (url.id)}
					<URLCard {url} {origin} />
				{/each}
			</div>
		{/if}
	</div>
</div>
