<script lang="ts">
	import { enhance } from "$app/forms";
	import Alert from "./Alert.svelte";
	import type { ActionData } from "../../routes/$types";

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
	let showRegister = $state(false);
	let isSubmitting = $state(false);
</script>

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
		<Alert message={form.message} type={form.success ? "success" : "error"} />
	{/if}

	<form
		method="post"
		action="?/{showRegister ? 'register' : 'login'}"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ result, update }) => {
				isSubmitting = false;
				await update();
			};
		}}
	>
		<div class="mb-4">
			<label for="email" class="mb-2 block text-sm font-medium text-gray-700">Email</label>
			<input
				type="email"
				id="email"
				name="email"
				required
				disabled={isSubmitting}
				class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
			/>
		</div>
		<div class="mb-6">
			<label for="password" class="mb-2 block text-sm font-medium text-gray-700">Password</label>
			<input
				type="password"
				id="password"
				name="password"
				required
				disabled={isSubmitting}
				class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
			/>
		</div>
		<button
			type="submit"
			disabled={isSubmitting}
			class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
		>
			{#if isSubmitting}
				<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" class="opacity-25"></circle>
					<path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				{showRegister ? "Creating account..." : "Signing in..."}
			{:else}
				{showRegister ? "Register" : "Sign In"}
			{/if}
		</button>
	</form>
</div>
