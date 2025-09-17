<script lang="ts">
	import { enhance } from "$app/forms";
	import { browser } from "$app/environment";
	import type { ActionData, PageData } from "./$types";

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showRegister = $state(false);
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
		<!-- Authentication Form -->
		<div class="mx-auto max-w-md rounded-lg bg-white p-8 shadow-md">
			<div class="mb-6 flex border-b">
				<button
					class="flex-1 py-2 {!showRegister
						? 'border-b-2 border-blue-500 text-blue-600'
						: 'text-gray-500'}"
					onclick={() => {
						showRegister = false;
					}}
				>
					Sign In
				</button>
				<button
					class="flex-1 py-2 {showRegister
						? 'border-b-2 border-blue-500 text-blue-600'
						: 'text-gray-500'}"
					onclick={() => {
						showRegister = true;
					}}
				>
					Register
				</button>
			</div>

			{#if form?.message}
				<div
					class="mb-4 rounded p-3 {form.success
						? 'bg-green-100 text-green-700'
						: 'bg-red-100 text-red-700'}"
				>
					{form.message}
				</div>
			{/if}

			<form method="post" action="?/{showRegister ? 'register' : 'login'}" use:enhance>
				<div class="mb-4">
					<label for="email" class="mb-2 block text-sm font-medium text-gray-700">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div class="mb-6">
					<label for="password" class="mb-2 block text-sm font-medium text-gray-700">Password</label
					>
					<input
						type="password"
						id="password"
						name="password"
						required
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<button
					type="submit"
					class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				>
					{showRegister ? "Register" : "Sign In"}
				</button>
			</form>
		</div>
	{:else}
		<!-- URL Shortener Form -->
		<div class="mx-auto mb-12 max-w-2xl">
			<div class="rounded-lg bg-white p-8 shadow-md">
				<h2 class="mb-6 text-2xl font-bold text-gray-900">Shorten a URL</h2>

				{#if form?.message}
					<div
						class="mb-4 rounded p-3 {form.success
							? 'bg-green-100 text-green-700'
							: 'bg-red-100 text-red-700'}"
					>
						{form.message}
					</div>
				{/if}

				{#if form?.success}
					<div class="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
						<p class="font-medium text-green-800">URL shortened successfully!</p>
						<div class="mt-2 flex items-center space-x-2">
							<input
								type="text"
								value="{origin}/{form.shortCode}"
								readonly
								class="flex-1 rounded-md border border-green-300 bg-white px-3 py-2"
							/>
							<button
								onclick={() => {
									navigator.clipboard.writeText(`${origin}/${form.shortCode}`);
								}}
								class="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
							>
								Copy
							</button>
						</div>
					</div>
				{/if}

				<form method="post" action="?/shorten" use:enhance>
					<div class="mb-4">
						<label for="url" class="mb-2 block text-sm font-medium text-gray-700"
							>Enter your long URL</label
						>
						<input
							type="url"
							id="url"
							name="url"
							required
							placeholder="https://example.com/very-long-url"
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
					<div class="mb-6">
						<label for="custom_code" class="mb-2 block text-sm font-medium text-gray-700"
							>Custom short code (optional)</label
						>
						<input
							type="text"
							id="custom_code"
							name="custom_code"
							placeholder="mycustomcode"
							pattern="[a-zA-Z0-9]+"
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
					<button
						type="submit"
						class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						Shorten URL
					</button>
				</form>
			</div>
		</div>

		<!-- User URLs Dashboard -->
		<div class="mx-auto max-w-4xl">
			<div class="rounded-lg bg-white p-8 shadow-md">
				<h2 class="mb-6 text-2xl font-bold text-gray-900">Your URLs</h2>

				{#if form?.success && form?.message}
					<div class="mb-4 rounded bg-green-100 p-3 text-green-700">
						{form.message}
					</div>
				{/if}

				{#if data.urls.length === 0}
					<p class="text-gray-500">No URLs created yet.</p>
				{:else}
					<div class="space-y-4">
						{#each data.urls as url (url.id)}
							<div class="rounded-lg border border-gray-200 p-4">
								<div class="flex items-start justify-between gap-4">
									<div class="flex-1 min-w-0">
										<p class="font-medium text-gray-900 break-all">
											{origin}/{url.short_code}
										</p>
										<p class="text-sm text-gray-600 break-all overflow-hidden" title={url.original_url}>
											{url.original_url}
										</p>
									</div>
									<div class="text-right flex-shrink-0">
										<p class="text-sm font-medium text-gray-900">{url.clicks} clicks</p>
										<div class="mt-1 flex items-center justify-end gap-2">
											<button
												onclick={() => {
													navigator.clipboard.writeText(`${origin}/${url.short_code}`);
												}}
												class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
												title="Copy short URL"
												aria-label="Copy short URL"
											>
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
													<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
													<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
												</svg>
											</button>
											<form
												method="post"
												action="?/deleteUrl"
												class="inline"
												use:enhance
												onsubmit={(e) => {
													if (
														!confirm(
															"Are you sure you want to delete this URL? This action cannot be undone."
														)
													) {
														e.preventDefault();
														return false;
													}
												}}
											>
												<input type="hidden" name="url_id" value={url.id} />
												<button type="submit" class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50" title="Delete URL" aria-label="Delete URL">
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
