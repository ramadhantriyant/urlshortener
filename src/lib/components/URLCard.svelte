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
	}

	let { url, origin }: Props = $props();
	let showAnalytics = $state(false);

	function copyToClipboard() {
		navigator.clipboard.writeText(`${origin}/${url.short_code}`);
	}

	const confirmDelete: SubmitFunction = ({ cancel }) => {
		if (!confirm("Are you sure you want to delete this URL? This action cannot be undone.")) {
			cancel();
		}
	};
</script>

<div class="card border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-md">
	<div class="card-body p-4">
		<div class="flex items-start justify-between gap-4">
			<div class="min-w-0 flex-1">
				<div class="mb-2 flex items-center gap-2">
					<svg
						class="h-4 w-4 flex-shrink-0 text-primary"
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
					<a
						href={resolve(`/${url.short_code}`)}
						target="_blank"
						rel="external noopener noreferrer"
						data-sveltekit-reload
						class="link font-semibold break-all link-primary"
					>
						{origin}/{url.short_code}
					</a>
				</div>
				<div class="flex items-start gap-2">
					<svg
						class="mt-0.5 h-4 w-4 flex-shrink-0 text-base-content/60"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
						></path>
					</svg>
					<p class="text-sm break-all text-base-content/70" title={url.original_url}>
						{url.original_url}
					</p>
				</div>
			</div>
			<div class="flex flex-col items-end gap-2">
				<div class="stats">
					<div class="stat p-2">
						<div class="stat-value text-lg">{url.clicks}</div>
						<div class="stat-desc">clicks</div>
					</div>
				</div>
				<div class="flex items-center gap-1">
					<button
						onclick={copyToClipboard}
						class="btn btn-ghost btn-sm"
						title="Copy short URL"
						aria-label="Copy short URL"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
							></path>
						</svg>
					</button>
					<button
						onclick={() => (showAnalytics = true)}
						class="btn btn-ghost btn-sm"
						title="View analytics"
						aria-label="View analytics"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							></path>
						</svg>
					</button>
					<form method="post" action="?/deleteUrl" class="inline" use:enhance={confirmDelete}>
						<input type="hidden" name="url_id" value={url.id} />
						<button
							type="submit"
							class="btn text-error btn-ghost btn-sm hover:bg-error hover:text-error-content"
							title="Delete URL"
							aria-label="Delete URL"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								></path>
							</svg>
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>

<ClickAnalyticsModal
	isOpen={showAnalytics}
	onClose={() => (showAnalytics = false)}
	shortCode={url.short_code}
	clicks={url.click_data}
/>
