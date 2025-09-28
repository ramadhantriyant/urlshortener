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

<div class="card mx-auto w-full max-w-md bg-base-100 shadow-xl">
	<div class="card-body">
		<div class="tabs-boxed mb-6 tabs">
			<button
				class="tab {!showRegister ? 'tab-active' : ''}"
				onclick={() => {
					showRegister = false;
				}}
			>
				<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7c2 0 3 1 3 3v1"
					></path>
				</svg>
				Sign In
			</button>
			<button
				class="tab {showRegister ? 'tab-active' : ''}"
				onclick={() => {
					showRegister = true;
				}}
			>
				<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
					></path>
				</svg>
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
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
		>
			<div class="form-control w-full">
				<label class="label" for="email">
					<span class="label-text">Email address</span>
				</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					disabled={isSubmitting}
					placeholder="Enter your email"
					class="input-bordered input w-full"
				/>
			</div>

			<div class="form-control w-full">
				<label class="label" for="password">
					<span class="label-text">Password</span>
				</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					disabled={isSubmitting}
					placeholder="Enter your password"
					class="input-bordered input w-full"
				/>
			</div>

			<div class="form-control mt-6">
				<button type="submit" disabled={isSubmitting} class="btn btn-primary">
					{#if isSubmitting}
						<span class="loading loading-sm loading-spinner"></span>
						{showRegister ? "Creating account..." : "Signing in..."}
					{:else}
						{showRegister ? "Create Account" : "Sign In"}
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
