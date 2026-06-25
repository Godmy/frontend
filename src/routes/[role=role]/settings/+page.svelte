<script lang="ts">
	import { useAuth } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import AccountSettingsForm from '$stylist/user/component/organism/account-settings-form/index.svelte';
	import type { AccountSettings } from '$stylist/user/type/object/account-settings';

	const auth = useAuth();

	let { data }: { data: { role: string } } = $props();
	const role = $derived(data.role);

	onMount(() => {
		if (!auth.isAuthenticated) {
			goto('/login');
		} else if (auth.roles.length > 0 && !auth.roles.some((r) => r.name === role)) {
			goto(`/${auth.roles[0]?.name ?? 'user'}`);
		}
	});

	function handleSaveSettings(settings: AccountSettings) {
		// TODO: реализовать через auth.updateProfile
		console.log('Saving settings:', settings);
	}
</script>

<div class="c-settings">
	<header class="c-settings__header">
		<div class="c-settings__header-inner">
			<div class="c-settings__header-left">
				<h1 class="c-settings__brand">vibe-management.pro</h1>
				<nav class="c-settings__nav">
					<a href={`/${role}`} class="c-settings__nav-link">Dashboard</a>
					<a href={`/${role}/settings`} class="c-settings__nav-link c-settings__nav-link--active">
						Settings
					</a>
				</nav>
			</div>
			<div class="c-settings__header-right">
				{#if auth.user}
					<span class="c-settings__username">Welcome, {auth.user.name}</span>
				{/if}
				<button
					class="c-settings__logout"
					onclick={() => {
						auth.logout();
						goto('/');
					}}
				>
					Logout
				</button>
			</div>
		</div>
	</header>

	<main class="c-settings__main">
		<div class="c-settings__card">
			<h2 class="c-settings__title">Account Settings</h2>
			<AccountSettingsForm
				name={auth.user?.name}
				email={auth.user?.email}
				onSubmit={handleSaveSettings}
			/>
		</div>
	</main>
</div>

<style>
	.c-settings {
		min-height: 100vh;
		background: var(--color-background-secondary, #f9fafb);
	}
	.c-settings__header {
		background: var(--color-background-primary, #fff);
		border-bottom: 1px solid var(--color-border-primary, #e5e7eb);
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.06);
	}
	.c-settings__header-inner {
		max-width: 56rem;
		margin: 0 auto;
		padding: 0 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 4rem;
	}
	.c-settings__header-left {
		display: flex;
		align-items: center;
		gap: 2.5rem;
	}
	.c-settings__brand {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-primary-600, #4f46e5);
		margin: 0;
	}
	.c-settings__nav {
		display: flex;
		gap: 2rem;
	}
	.c-settings__nav-link {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary, #6b7280);
		text-decoration: none;
		padding: 0.25rem 0;
		border-bottom: 2px solid transparent;
	}
	.c-settings__nav-link--active {
		color: var(--color-text-primary, #111827);
		border-bottom-color: var(--color-primary-500, #6366f1);
	}
	.c-settings__header-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.c-settings__username {
		font-size: 0.875rem;
		color: var(--color-text-secondary, #6b7280);
	}
	.c-settings__logout {
		padding: 0.25rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-inverse, #fff);
		background: var(--color-error, #ef4444);
		border: none;
		border-radius: var(--radius-md, 0.375rem);
		cursor: pointer;
	}
	.c-settings__logout:hover {
		background: #dc2626;
	}
	.c-settings__main {
		max-width: 56rem;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}
	.c-settings__card {
		background: var(--color-background-primary, #fff);
		border-radius: var(--radius-lg, 0.75rem);
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.08);
		padding: 1.5rem;
	}
	.c-settings__title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text-primary, #111827);
		margin: 0 0 1.5rem;
	}
</style>
