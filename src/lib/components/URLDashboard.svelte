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

<div class="mx-auto max-w-4xl">
	<div class="rounded-lg bg-white p-8 shadow-md">
		<h2 class="mb-6 text-2xl font-bold text-gray-900">Your URLs</h2>

		{#if form?.success && form?.message}
			<Alert message={form.message} type="success" />
		{/if}

		{#if urls.length === 0}
			<p class="text-gray-500">No URLs created yet.</p>
		{:else}
			<div class="space-y-4">
				{#each urls as url (url.id)}
					<URLCard {url} {origin} />
				{/each}
			</div>
		{/if}
	</div>
</div>
