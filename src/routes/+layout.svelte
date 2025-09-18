<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import { supabase } from "$lib/supabase";

	let { children, data } = $props();

	let session = $derived(data.session);
	let userProfile = $derived(data.userProfile);

	onMount(() => {
		const { data: authData } = supabase.auth.onAuthStateChange((event) => {
			if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
				invalidate("supabase:auth");
			}
		});

		return () => authData.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<nav class="border-b bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 justify-between">
				<div class="flex items-center">
					<button
						onclick={() => (window.location.href = "/")}
						class="cursor-pointer border-none bg-transparent text-xl font-bold text-gray-900"
					>
						URLShort
					</button>
				</div>
				<div class="flex items-center space-x-4">
					{#if session}
						<span class="text-gray-700"
							>Welcome, {userProfile?.full_name || session.user.email}</span
						>
						<form action="?/logout" method="post" class="inline">
							<button
								type="submit"
								class="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
							>
								Logout
							</button>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</nav>

	<main>
		{@render children?.()}
	</main>
</div>
