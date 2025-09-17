<script lang="ts">
	import { enhance } from "$app/forms";
	import Alert from "./Alert.svelte";
	import type { ActionData } from "../../routes/$types";

	interface Props {
		form: ActionData;
		origin: string;
	}

	let { form, origin }: Props = $props();

	function copyShortUrl() {
		if (form?.shortCode) {
			navigator.clipboard.writeText(`${origin}/${form.shortCode}`);
		}
	}
</script>

<div class="mx-auto mb-12 max-w-2xl">
	<div class="rounded-lg bg-white p-8 shadow-md">
		<h2 class="mb-6 text-2xl font-bold text-gray-900">Shorten a URL</h2>

		{#if form?.message}
			<Alert message={form.message} type={form.success ? "success" : "error"} />
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
						onclick={copyShortUrl}
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
