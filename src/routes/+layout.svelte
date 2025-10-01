<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import { supabase } from "$lib/supabase";
	import SimpleProfileModal from "$lib/components/SimpleProfileModal.svelte";
	import ChangePasswordModal from "$lib/components/ChangePasswordModal.svelte";

	let { children, data } = $props();

	let session = $derived(data.session);
	let userProfile = $derived(data.userProfile);
	let showProfileModal = $state(false);
	let showChangePasswordModal = $state(false);

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

	function openChangePasswordModal() {
		showChangePasswordModal = true;
	}

	function closeChangePasswordModal() {
		showChangePasswordModal = false;
	}

	async function handleLogout() {
		const form = document.createElement("form");
		form.method = "POST";
		form.action = "?/logout";
		document.body.appendChild(form);
		form.submit();
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen" data-theme="light">
	<div class="navbar bg-base-100 shadow-lg">
		<div class="navbar-start">
			<button
				onclick={() => (window.location.href = "/")}
				class="btn text-xl font-bold text-primary btn-ghost"
			>
				🔗 URLShort
			</button>
		</div>

		<div class="navbar-end">
			{#if session}
				<div class="dropdown dropdown-end">
					<div tabindex="0" role="button" class="btn avatar btn-circle btn-ghost">
						<div class="w-10 rounded-full">
							{#if userProfile?.avatar_url}
								<img src={userProfile.avatar_url} alt="Profile" class="rounded-full" />
							{:else}
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-neutral text-neutral-content"
								>
									<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
							{/if}
						</div>
					</div>
					<ul
						class="dropdown-content menu z-[1] mt-3 w-52 menu-sm rounded-box bg-base-100 p-2 shadow"
					>
						<li class="menu-title">
							<span>Welcome, {userProfile?.full_name || session.user.email}</span>
						</li>
						<li>
							<button onclick={openProfileModal} class="justify-between">
								Profile Settings
							</button>
						</li>
						<li>
							<button onclick={openChangePasswordModal} class="justify-between">Change Password</button>
						</li>
						<div class="divider my-2"></div>
						<li>
							<button onclick={handleLogout} class="btn w-full btn-sm btn-error shadow-none">
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									></path>
								</svg>
								Logout
							</button>
						</li>
					</ul>
				</div>
			{/if}
		</div>
	</div>

	<main class="container mx-auto p-4">
		{@render children?.()}
	</main>

	<!-- Profile Modal -->
	{#if session}
		<SimpleProfileModal
			isOpen={showProfileModal}
			onClose={closeProfileModal}
			{userProfile}
			{session}
		/>
		<ChangePasswordModal
			isOpen={showChangePasswordModal}
			onClose={closeChangePasswordModal}
			{session}
		/>
	{/if}
</div>
