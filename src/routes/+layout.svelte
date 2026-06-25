<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { setClientSession, setClientStarted } from '$houdini';
	import { ToastContainer } from '$lib/notifications';
	import { initializeErrorNotifications } from '$lib/errors/integrations';
	import { languageStore } from '$lib/stores/languageStore.svelte';
	import { onMount } from 'svelte';
	import { useAuth } from '$lib/auth';

	let { children } = $props();
	const auth = useAuth();

	$effect(() => {
		setClientStarted();
		setClientSession(($page?.data ?? {}) as App.Session);
	});

	onMount(() => {
		const unsubscribe = initializeErrorNotifications();
		languageStore.init();
		return () => {
			unsubscribe?.();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
</svelte:head>

{#if !auth.isAuthenticated}
	<header class="c-app-header">
		<div class="c-app-header__inner">
			<a href="/" class="c-app-header__brand">vibe-management.pro</a>
			<nav class="c-app-header__nav">
				<a href="/login" class="c-app-header__link">Sign In</a>
				<a href="/register" class="c-app-header__link c-app-header__link--primary">Sign Up</a>
			</nav>
		</div>
	</header>
{/if}

<div class="c-app-shell">
	{@render children?.()}
</div>

<ToastContainer />

<style>
	.c-app-header {
		background: var(--color-background-primary, #fff);
		border-bottom: 1px solid var(--color-border-primary, #e5e7eb);
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.06);
	}
	.c-app-header__inner {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 4rem;
	}
	.c-app-header__brand {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-primary-600, #4f46e5);
		text-decoration: none;
	}
	.c-app-header__nav {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	.c-app-header__link {
		color: var(--color-text-secondary, #6b7280);
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-md, 0.375rem);
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		transition: color 0.15s;
	}
	.c-app-header__link:hover {
		color: var(--color-primary-600, #4f46e5);
	}
	.c-app-header__link--primary {
		background: var(--color-primary-600, #4f46e5);
		color: var(--color-text-inverse, #fff);
	}
	.c-app-header__link--primary:hover {
		background: var(--color-primary-700, #4338ca);
		color: var(--color-text-inverse, #fff);
	}
	.c-app-shell {
		min-height: 100vh;
		background: var(--color-background-secondary, #f9fafb);
	}
</style>
