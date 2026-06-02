<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { invalidate } from "$app/navigation";
	import { base } from "$app/paths";
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

	let userInitial = $derived(
		(userProfile?.full_name || session?.user?.email || "U")[0].toUpperCase()
	);

	let displayName = $derived(
		userProfile?.full_name || session?.user?.email?.split("@")[0] || "Account"
	);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-base-100" data-theme="dark">
	<!-- Navbar -->
	<header class="sticky top-0 z-50 border-b border-base-300 bg-base-100/80 backdrop-blur-md">
		<div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
			<!-- Logo -->
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="{base}/" class="flex items-center">
				<span class="font-display text-xl font-extrabold tracking-tight text-base-content">
					url<span class="text-primary">·</span>short
				</span>
			</a>

			<!-- Right side -->
			{#if session}
				<div class="dropdown dropdown-end">
					<div
						tabindex="0"
						role="button"
						class="btn flex h-9 items-center gap-2 rounded-full px-2 pr-3 btn-ghost btn-sm"
					>
						<div
							class="flex h-7 w-7 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral"
						>
							{#if userProfile?.avatar_url}
								<img
									src={userProfile.avatar_url}
									alt="Profile"
									class="h-7 w-7 rounded-full object-cover"
								/>
							{:else}
								<span class="font-display text-xs font-bold text-primary uppercase"
									>{userInitial}</span
								>
							{/if}
						</div>
						<span class="hidden text-sm font-medium sm:block">{displayName}</span>
						<svg
							class="h-3.5 w-3.5 text-base-content/40"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>
					<ul
						class="dropdown-content z-[1] mt-2 w-56 overflow-hidden rounded-xl border border-base-300 bg-base-200 p-0 shadow-2xl"
					>
						<li class="border-b border-base-300 px-3 py-2.5">
							<p class="text-xs text-base-content/40">Signed in as</p>
							<p class="truncate text-sm font-medium text-base-content">{session.user.email}</p>
						</li>
						<li>
							<button
								onclick={openProfileModal}
								class="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-base-content/80 hover:bg-base-300 hover:text-base-content"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								Profile Settings
							</button>
						</li>
						<li>
							<button
								onclick={openChangePasswordModal}
								class="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-base-content/80 hover:bg-base-300 hover:text-base-content"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
								Change Password
							</button>
						</li>
						<li class="border-t border-base-300">
							<button
								onclick={handleLogout}
								class="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-error hover:bg-error/10"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									/>
								</svg>
								Sign Out
							</button>
						</li>
					</ul>
				</div>
			{:else}
				<p class="text-sm text-base-content/40">Short links. Real analytics.</p>
			{/if}
		</div>
	</header>

	<main class="mx-auto max-w-5xl px-4 py-10">
		{@render children?.()}
	</main>

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
