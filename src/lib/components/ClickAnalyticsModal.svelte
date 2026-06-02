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
		return new Date(dateString).toLocaleString(undefined, {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	}

	function formatRelative(dateString: string) {
		const diff = Date.now() - new Date(dateString).getTime();
		const mins = Math.floor(diff / 60000);
		if (mins < 1) return "Just now";
		if (mins < 60) return `${mins}m ago`;
		const hours = Math.floor(mins / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		return `${days}d ago`;
	}

	let topCountry = $derived.by(() => {
		const counts: Record<string, number> = {};
		clicks
			.filter((c) => c.country)
			.forEach((c) => {
				counts[c.country!] = (counts[c.country!] || 0) + 1;
			});
		const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
		return sorted[0]?.[0] ?? null;
	});

	let uniqueCountries = $derived(new Set(clicks.map((c) => c.country).filter(Boolean)).size);

	let lastClick = $derived(
		clicks.length > 0 ? clicks.reduce((a, b) => (a.clicked_at > b.clicked_at ? a : b)) : null
	);

	function parseUA(ua: string | null): string {
		if (!ua) return "—";
		if (/iPhone|iPad|iOS/i.test(ua)) return "iOS";
		if (/Android/i.test(ua)) return "Android";
		if (/Chrome/i.test(ua)) return "Chrome";
		if (/Firefox/i.test(ua)) return "Firefox";
		if (/Safari/i.test(ua)) return "Safari";
		if (/bot|crawl|spider/i.test(ua)) return "Bot";
		return ua.slice(0, 24);
	}
</script>

<div class="modal {isOpen ? 'modal-open' : ''}">
	<div
		class="modal-box flex max-h-[90vh] w-11/12 max-w-4xl flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-200 p-0 shadow-2xl"
	>
		<!-- Header -->
		<div class="flex flex-shrink-0 items-center justify-between border-b border-base-300 px-6 py-4">
			<div class="flex items-center gap-3">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
					<svg class="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						/>
					</svg>
				</div>
				<div>
					<h3 class="font-display text-base font-semibold text-base-content">Analytics</h3>
					<p class="font-mono-url text-xs text-base-content/40">/{shortCode}</p>
				</div>
			</div>
			<button
				onclick={onClose}
				aria-label="Close"
				class="flex h-8 w-8 items-center justify-center rounded-lg text-base-content/40 transition-colors hover:bg-base-300 hover:text-base-content"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>

		{#if clicks.length === 0}
			<div class="flex flex-1 flex-col items-center justify-center py-16">
				<div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-base-300">
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
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						/>
					</svg>
				</div>
				<p class="text-sm font-medium text-base-content/40">No clicks yet</p>
				<p class="mt-1 text-xs text-base-content/25">Share this link to start tracking</p>
			</div>
		{:else}
			<!-- Summary stats -->
			<div class="flex-shrink-0 border-b border-base-300 px-6 py-4">
				<div class="grid grid-cols-3 gap-4">
					<div class="rounded-xl bg-base-100 px-4 py-3">
						<p class="text-xs text-base-content/40">Total clicks</p>
						<p class="font-display mt-1 text-2xl font-extrabold text-primary tabular-nums">
							{clicks.length.toLocaleString()}
						</p>
					</div>
					<div class="rounded-xl bg-base-100 px-4 py-3">
						<p class="text-xs text-base-content/40">Countries</p>
						<p class="font-display mt-1 text-2xl font-extrabold text-base-content tabular-nums">
							{uniqueCountries || "—"}
						</p>
						{#if topCountry}
							<p class="mt-0.5 text-xs text-base-content/40">Top: {topCountry}</p>
						{/if}
					</div>
					<div class="rounded-xl bg-base-100 px-4 py-3">
						<p class="text-xs text-base-content/40">Last click</p>
						<p class="font-display mt-1 text-xl font-extrabold text-base-content">
							{lastClick ? formatRelative(lastClick.clicked_at) : "—"}
						</p>
					</div>
				</div>
			</div>

			<!-- Click table -->
			<div class="flex-1 overflow-auto">
				<table class="w-full text-sm">
					<thead class="sticky top-0 border-b border-base-300 bg-base-200">
						<tr>
							<th
								class="font-mono-url px-4 py-3 text-left text-xs font-medium tracking-wider text-base-content/30 uppercase"
								>When</th
							>
							<th
								class="font-mono-url px-4 py-3 text-left text-xs font-medium tracking-wider text-base-content/30 uppercase"
								>Location</th
							>
							<th
								class="font-mono-url px-4 py-3 text-left text-xs font-medium tracking-wider text-base-content/30 uppercase"
								>Device</th
							>
							<th
								class="font-mono-url px-4 py-3 text-left text-xs font-medium tracking-wider text-base-content/30 uppercase"
								>Referer</th
							>
							<th
								class="font-mono-url hidden px-4 py-3 text-left text-xs font-medium tracking-wider text-base-content/30 uppercase lg:table-cell"
								>IP</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-base-300">
						{#each clicks as click (click.id)}
							<tr class="hover:bg-base-300/30">
								<td class="px-4 py-3 text-xs whitespace-nowrap text-base-content/70">
									{formatDate(click.clicked_at)}
								</td>
								<td class="px-4 py-3 text-xs text-base-content/70">
									{#if click.city || click.country}
										<span class="flex items-center gap-1">
											{#if click.country}
												<span
													class="font-mono-url inline-flex h-4 items-center rounded bg-base-300 px-1 text-[10px] text-base-content/50"
													>{click.country}</span
												>
											{/if}
											{click.city || ""}
										</span>
									{:else}
										<span class="text-base-content/25">—</span>
									{/if}
								</td>
								<td class="px-4 py-3 text-xs text-base-content/70">
									{parseUA(click.user_agent)}
								</td>
								<td
									class="max-w-[180px] truncate px-4 py-3 text-xs text-base-content/70"
									title={click.referer || ""}
								>
									{#if click.referer}
										{click.referer}
									{:else}
										<span class="text-base-content/25">—</span>
									{/if}
								</td>
								<td
									class="font-mono-url hidden px-4 py-3 text-xs text-base-content/40 lg:table-cell"
								>
									{click.ip_address || "—"}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
	<button type="button" class="modal-backdrop" aria-label="Close analytics modal" onclick={onClose}
	></button>
</div>
