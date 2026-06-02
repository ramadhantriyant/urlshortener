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

{#if !data.session}
	<!-- Landing hero -->
	<div
		class="dot-grid hero-glow relative -mx-4 -mt-10 flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 pt-16 pb-20 text-center"
	>
		<div
			class="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1"
		>
			<span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
			<span class="font-mono-url text-xs font-medium text-primary"
				>Free · No credit card needed</span
			>
		</div>

		<h1
			class="font-display mx-auto mb-4 max-w-xl text-5xl leading-[1.08] font-extrabold tracking-tight text-base-content sm:text-6xl"
		>
			Turn long links<br />
			<span class="text-primary">into short ones.</span>
		</h1>

		<p class="mb-12 max-w-sm text-base text-base-content/50">
			Shorten any URL, share it anywhere, and track every click with built-in analytics.
		</p>

		<div class="w-full max-w-sm">
			<AuthForm {form} />
		</div>
	</div>
{:else}
	<div class="space-y-6">
		<URLShortenerForm {form} {origin} />
		<URLDashboard urls={data.urls} {form} {origin} />
	</div>
{/if}
