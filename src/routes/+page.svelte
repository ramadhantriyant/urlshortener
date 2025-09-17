<script lang="ts">
	import { browser } from "$app/environment";
	import AuthForm from "$lib/components/AuthForm.svelte";
	import URLShortenerForm from "$lib/components/URLShortenerForm.svelte";
	import URLDashboard from "$lib/components/URLDashboard.svelte";
	import type { ActionData, PageData } from "./$types";

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let origin = $state("");

	$effect(() => {
		if (browser) {
			origin = window.location.origin;
		}
	});
</script>

<div class="mx-auto max-w-4xl px-4 py-8">
	<div class="mb-12 text-center">
		<h1 class="mb-4 text-4xl font-bold text-gray-900">URL Shortener</h1>
		<p class="text-xl text-gray-600">Shorten your long URLs with ease</p>
	</div>

	{#if !data.session}
		<AuthForm {form} />
	{:else}
		<URLShortenerForm {form} {origin} />
		<URLDashboard urls={data.urls} {form} {origin} />
	{/if}
</div>
