<script lang="ts">
	import { useAuth } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const auth = useAuth();

	onMount(() => {
		if (auth.isAuthenticated) goto(`/${auth.roles[0]?.name ?? 'user'}`);
	});
</script>

<div class="c-landing">
	<div class="c-landing__card">
		<h1 class="c-landing__title">Welcome to vibe-management.pro</h1>
		<p class="c-landing__subtitle">Simple and efficient interface</p>
		<div class="c-landing__actions">
			<a href="/login" class="c-landing__btn c-landing__btn--primary">Sign In</a>
			<a href="/register" class="c-landing__btn c-landing__btn--secondary">Create Account</a>
		</div>
	</div>
</div>

<style>
	.c-landing {
		min-height: 100vh;
		background: linear-gradient(
			135deg,
			var(--color-primary-50, #eef2ff),
			var(--color-primary-100, #e0e7ff)
		);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}
	.c-landing__card {
		max-width: 28rem;
		width: 100%;
		background: var(--color-background-primary, #fff);
		border-radius: var(--radius-xl, 1rem);
		box-shadow: 0 20px 40px rgb(0 0 0 / 0.1);
		padding: 2.5rem 2rem;
		text-align: center;
	}
	.c-landing__title {
		font-size: 1.875rem;
		font-weight: 700;
		color: var(--color-text-primary, #111827);
		margin: 0 0 0.5rem;
	}
	.c-landing__subtitle {
		color: var(--color-text-secondary, #6b7280);
		margin: 0 0 2rem;
	}
	.c-landing__actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.c-landing__btn {
		display: block;
		padding: 0.75rem 1rem;
		border-radius: var(--radius-md, 0.5rem);
		font-weight: 500;
		text-decoration: none;
		transition: background 0.15s, color 0.15s;
	}
	.c-landing__btn--primary {
		background: var(--color-primary-600, #4f46e5);
		color: var(--color-text-inverse, #fff);
	}
	.c-landing__btn--primary:hover {
		background: var(--color-primary-700, #4338ca);
	}
	.c-landing__btn--secondary {
		background: var(--color-background-primary, #fff);
		border: 1px solid var(--color-border-primary, #d1d5db);
		color: var(--color-text-primary, #111827);
	}
	.c-landing__btn--secondary:hover {
		background: var(--color-background-secondary, #f9fafb);
	}
</style>
