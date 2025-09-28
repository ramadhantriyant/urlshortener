<script lang="ts">
	import { enhance } from "$app/forms";
	import { resolve } from "$app/paths";
	import type { SubmitFunction } from "@sveltejs/kit";

	interface URL {
		id: string;
		short_code: string;
		original_url: string;
		clicks: number;
	}

	interface Props {
		url: URL;
		origin: string;
	}

	let { url, origin }: Props = $props();

	function copyToClipboard() {
		navigator.clipboard.writeText(`${origin}/${url.short_code}`);
	}

	const confirmDelete: SubmitFunction = ({ cancel }) => {
		if (!confirm("Are you sure you want to delete this URL? This action cannot be undone.")) {
			cancel();
		}
	};
</script>

<div class="rounded-lg border border-gray-200 p-4">
	<div class="flex items-start justify-between gap-4">
		<div class="min-w-0 flex-1">
			<p class="font-medium break-all text-gray-900">
				<a
					href={resolve(`/${url.short_code}`)}
					target="_blank"
					rel="external noopener noreferrer"
					data-sveltekit-reload
					class="underline-offset-2 hover:text-blue-600 hover:underline"
				>
					{origin}/{url.short_code}
				</a>
			</p>
			<p class="overflow-hidden text-sm break-all text-gray-600" title={url.original_url}>
				{url.original_url}
			</p>
		</div>
		<div class="flex-shrink-0 text-right">
			<p class="text-sm font-medium text-gray-900">{url.clicks} clicks</p>
			<div class="mt-1 flex items-center justify-end gap-2">
				<button
					onclick={copyToClipboard}
					class="rounded p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
					title="Copy short URL"
					aria-label="Copy short URL"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
						<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
					</svg>
				</button>
				<form method="post" action="?/deleteUrl" class="inline" use:enhance={confirmDelete}>
					<input type="hidden" name="url_id" value={url.id} />
					<button
						type="submit"
						class="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-800"
						title="Delete URL"
						aria-label="Delete URL"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M3 6h18"></path>
							<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
							<path d="M8 6V4c0-1 1-2 2-2h4c0-1 1-2 2-2v2"></path>
							<line x1="10" y1="11" x2="10" y2="17"></line>
							<line x1="14" y1="11" x2="14" y2="17"></line>
						</svg>
					</button>
				</form>
			</div>
		</div>
	</div>
</div>
