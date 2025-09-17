<script lang="ts">
	import { enhance } from "$app/forms";
	import Alert from "./Alert.svelte";
	import type { ActionData } from "../../routes/$types";

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
	let showRegister = $state(false);
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
			<label for="password" class="mb-2 block text-sm font-medium text-gray-700">Password</label>
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
