<script lang="ts">
	import { page } from "$app/stores";
	import { browser } from "$app/environment";

	let origin = $state("");

	$effect(() => {
		if (browser) {
			origin = window.location.origin;
		}
	});

	let status = $derived($page.status);

	function getErrorTitle(status: number) {
		switch (status) {
			case 404:
				return "Short URL Not Found";
			case 500:
				return "Server Error";
			case 403:
				return "Access Denied";
			default:
				return "Oops! Something went wrong";
		}
	}

	function getErrorDescription(status: number) {
		switch (status) {
			case 404:
				return "The short URL you're looking for doesn't exist or has been deleted.";
			case 500:
				return "Our servers are having some trouble. Please try again later.";
			case 403:
				return "You don't have permission to access this resource.";
			default:
				return "An unexpected error occurred. We're working to fix it.";
		}
	}
</script>

<svelte:head>
	<title>{getErrorTitle(status)} | URLShort</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
	<div class="w-full max-w-lg text-center">
		<!-- Error Icon -->
		<div class="mb-8">
			{#if status === 404}
				<!-- 404 Link Icon -->
				<svg
					class="mx-auto h-24 w-24 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
					/>
				</svg>
			{:else}
				<!-- Generic Error Icon -->
				<svg
					class="mx-auto h-24 w-24 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
					/>
				</svg>
			{/if}
		</div>

		<!-- Error Status -->
		<div class="mb-4">
			<h1 class="mb-2 text-6xl font-bold text-gray-900">{status}</h1>
			<h2 class="text-2xl font-semibold text-gray-700">{getErrorTitle(status)}</h2>
		</div>

		<!-- Error Description -->
		<p class="mb-8 text-lg leading-relaxed text-gray-600">
			{getErrorDescription(status)}
		</p>

		{#if status === 404}
			<!-- URL Info for 404 -->
			<div class="mb-8 rounded-lg bg-gray-100 p-4">
				<p class="text-sm text-gray-600">
					Looking for: <span class="font-mono text-gray-800">{origin}{$page.url.pathname}</span>
				</p>
			</div>
		{/if}

		<!-- Actions -->
		<div class="space-y-4">
			<!-- Primary Action - Go Home -->
			<div>
				<button
					onclick={() => {
						window.location.href = "/";
					}}
					class="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
				>
					<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
						></path>
					</svg>
					Go to Homepage
				</button>
			</div>

			{#if status === 404}
				<!-- Secondary Action for 404 - Create Short URL -->
				<div>
					<p class="mb-3 text-sm text-gray-600">Or create your own short URL:</p>
					<button
						onclick={() => {
							window.location.href = "/";
						}}
						class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
					>
						<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							></path>
						</svg>
						Create Short URL
					</button>
				</div>
			{/if}
		</div>

		<!-- Footer Info -->
		<div class="mt-12 border-t border-gray-200 pt-8">
			<p class="text-sm text-gray-500">Need help? Contact support or try refreshing the page.</p>
		</div>
	</div>
</div>
