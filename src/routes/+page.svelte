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

<div class="mx-auto max-w-6xl">
	{#if !data.session}
		<div class="hero min-h-[500px]">
			<div class="hero-content text-center">
				<div class="max-w-2xl">
					<div class="mb-8">
						<div class="mb-4 text-6xl">🔗</div>
						<h1
							class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-5xl font-bold text-transparent"
						>
							URL Shortener
						</h1>
						<p class="py-6 text-xl text-base-content/70">
							Transform your long URLs into short, shareable links with advanced analytics and
							custom codes.
						</p>
					</div>

					<AuthForm {form} />
				</div>
			</div>
		</div>
	{:else}
		<div class="space-y-8">
			<URLShortenerForm {form} {origin} />
			<URLDashboard urls={data.urls} {form} {origin} />
		</div>
	{/if}
</div>
