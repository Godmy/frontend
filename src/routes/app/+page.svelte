<script lang="ts">
	import { useAuth } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const auth = useAuth();

	onMount(() => {
		if (auth.isAuthenticated) goto(`/${auth.roles[0]?.name ?? 'user'}`);
	});
</script>

<div class="c-app-landing">
	<div class="c-app-landing__card">
		<h1 class="c-app-landing__title">vibe-management.pro</h1>
		<p class="c-app-landing__sub">Full interface — Version B</p>
		<div class="c-app-landing__actions">
			<a href="/login" class="c-app-landing__btn c-app-landing__btn--primary">Sign In</a>
			<a href="/register" class="c-app-landing__btn">Sign Up</a>
		</div>
	</div>
</div>

<style>
	.c-app-landing {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-background-secondary, #f9fafb);
	}
	.c-app-landing__card {
		background: var(--color-background-primary, #fff);
		border-radius: var(--radius-xl, 1rem);
		box-shadow: 0 4px 24px rgb(0 0 0 / 0.08);
		padding: 3rem 2.5rem;
		text-align: center;
		max-width: 28rem;
		width: 100%;
	}
	.c-app-landing__title {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-primary-600, #4f46e5);
		margin: 0 0 0.5rem;
	}
	.c-app-landing__sub {
		font-size: 0.875rem;
		color: var(--color-text-secondary, #6b7280);
		margin: 0 0 2rem;
	}
	.c-app-landing__actions {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
	}
	.c-app-landing__btn {
		padding: 0.625rem 1.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: var(--radius-md, 0.375rem);
		text-decoration: none;
		background: var(--color-background-secondary, #f3f4f6);
		color: var(--color-text-primary, #111827);
		transition: background 0.12s;
	}
	.c-app-landing__btn:hover {
		background: var(--color-border-primary, #e5e7eb);
	}
	.c-app-landing__btn--primary {
		background: var(--color-primary-600, #4f46e5);
		color: #fff;
	}
	.c-app-landing__btn--primary:hover {
		background: var(--color-primary-700, #4338ca);
	}
</style>
