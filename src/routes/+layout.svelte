<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import { supabase } from "$lib/supabase";
	import SimpleProfileModal from "$lib/components/SimpleProfileModal.svelte";

	let { children, data } = $props();

	let session = $derived(data.session);
	let userProfile = $derived(data.userProfile);
	let showProfileModal = $state(false);

	onMount(() => {
		const { data: authData } = supabase.auth.onAuthStateChange((event) => {
			if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
				invalidate("supabase:auth");
			}
		});

		return () => authData.subscription.unsubscribe();
	});

	function openProfileModal() {
		showProfileModal = true;
	}

	function closeProfileModal() {
		showProfileModal = false;
	}
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
						<div class="flex items-center space-x-3">
							<!-- Profile Photo -->
							<button
								onclick={openProfileModal}
								class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
							>
								{#if userProfile?.avatar_url}
									<img src={userProfile.avatar_url} alt="Profile" class="h-full w-full object-cover" />
								{:else}
									<svg class="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
									</svg>
								{/if}
							</button>

							<!-- Username/Email -->
							<button
								onclick={openProfileModal}
								class="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
							>
								Welcome, {userProfile?.full_name || session.user.email}
							</button>
						</div>

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

	<!-- Profile Modal -->
	{#if session}
		<SimpleProfileModal
			isOpen={showProfileModal}
			onClose={closeProfileModal}
			userProfile={userProfile}
			session={session}
		/>
	{/if}
</div>
