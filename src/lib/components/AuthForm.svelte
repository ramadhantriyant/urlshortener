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

<div class="w-full rounded-2xl border border-base-300 bg-base-200 p-6 shadow-2xl">
	<!-- Tabs -->
	<div class="mb-6 flex rounded-lg bg-base-300 p-1">
		<button
			class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all
				{!showRegister
				? 'bg-base-100 text-base-content shadow-sm'
				: 'text-base-content/50 hover:text-base-content/80'}"
			onclick={() => (showRegister = false)}
		>
			Sign In
		</button>
		<button
			class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all
				{showRegister
				? 'bg-base-100 text-base-content shadow-sm'
				: 'text-base-content/50 hover:text-base-content/80'}"
			onclick={() => (showRegister = true)}
		>
			Register
		</button>
	</div>

	{#if form?.message}
		<div class="mb-4">
			<Alert message={form.message} type={form.success ? "success" : "error"} />
		</div>
	{/if}

	<form
		method="post"
		action="?/{showRegister ? 'register' : 'login'}"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				isSubmitting = false;
				await update();
			};
		}}
		class="space-y-4"
	>
		<div>
			<label class="mb-1.5 block text-sm font-medium text-base-content/70" for="email">
				Email address
			</label>
			<input
				type="email"
				id="email"
				name="email"
				required
				disabled={isSubmitting}
				placeholder="you@example.com"
				class="w-full rounded-lg border border-base-300 bg-base-100 px-3.5 py-2.5 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
			/>
		</div>

		<div>
			<label class="mb-1.5 block text-sm font-medium text-base-content/70" for="password">
				Password
			</label>
			<input
				type="password"
				id="password"
				name="password"
				required
				disabled={isSubmitting}
				placeholder={showRegister ? "Min. 6 characters" : "Your password"}
				class="w-full rounded-lg border border-base-300 bg-base-100 px-3.5 py-2.5 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
			/>
		</div>

		<button
			type="submit"
			disabled={isSubmitting}
			class="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-content transition-opacity hover:opacity-90 disabled:opacity-50"
		>
			{#if isSubmitting}
				<span class="loading loading-sm loading-spinner"></span>
				{showRegister ? "Creating account…" : "Signing in…"}
			{:else}
				{showRegister ? "Create Account" : "Sign In"}
			{/if}
		</button>
	</form>
</div>
