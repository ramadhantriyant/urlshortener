<script lang="ts">
	interface Click {
		id: string;
		user_agent: string | null;
		referer: string | null;
		ip_address: string | null;
		country: string | null;
		city: string | null;
		clicked_at: string;
	}

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		shortCode: string;
		clicks: Click[];
	}

	let { isOpen, onClose, shortCode, clicks }: Props = $props();

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleString();
	}
</script>

<div class="modal {isOpen ? 'modal-open' : ''}">
	<div class="modal-box w-11/12 max-w-5xl">
		<form method="dialog">
			<button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm" onclick={onClose}>
				✕
			</button>
		</form>

		<h3 class="mb-4 flex items-center gap-2 text-lg font-bold">
			<svg class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
				></path>
			</svg>
			Click Analytics - {shortCode}
		</h3>

		{#if clicks.length === 0}
			<div class="py-8 text-center text-base-content/70">
				<svg
					class="mx-auto mb-4 h-16 w-16 text-base-content/30"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
					></path>
				</svg>
				<p class="text-lg">No clicks yet</p>
			</div>
		{:else}
			<div class="stats mb-4 shadow">
				<div class="stat">
					<div class="stat-title">Total Clicks</div>
					<div class="stat-value text-primary">{clicks.length}</div>
				</div>
			</div>

			<div class="max-h-96 overflow-x-auto">
				<table class="table table-zebra table-sm">
					<thead class="sticky top-0 z-10 bg-base-200">
						<tr>
							<th>Date & Time</th>
							<th>Location</th>
							<th>User Agent</th>
							<th>Referer</th>
							<th>IP Address</th>
						</tr>
					</thead>
					<tbody>
						{#each clicks as click (click.id)}
							<tr>
								<td class="whitespace-nowrap">{formatDate(click.clicked_at)}</td>
								<td>
									{#if click.city || click.country}
										{click.city ? `${click.city}, ` : ""}{click.country || ""}
									{:else}
										<span class="text-base-content/50">-</span>
									{/if}
								</td>
								<td class="max-w-xs truncate" title={click.user_agent || ""}>
									{click.user_agent || "-"}
								</td>
								<td class="max-w-xs truncate" title={click.referer || ""}>
									{click.referer || "-"}
								</td>
								<td>{click.ip_address || "-"}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<div class="modal-action">
			<button type="button" onclick={onClose} class="btn btn-primary">Close</button>
		</div>
	</div>
	<button type="button" class="modal-backdrop" aria-label="Close analytics modal" onclick={onClose}
	></button>
</div>
