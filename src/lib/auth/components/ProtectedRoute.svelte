<script lang="ts">
	import { useAuth } from '../composables/useAuth.svelte';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		fallback?: Snippet;
		redirectTo?: string;
	}

	let { children, fallback, redirectTo = '/login' }: Props = $props();

	const auth = useAuth();

	onMount(async () => {
		if (!auth.isAuthenticated) {
			await auth.checkAuth();
		}

		if (!auth.isAuthenticated && !auth.isLoading) {
			window.location.href = redirectTo;
		}
	});
</script>

{#if auth.isLoading}
	<div class="flex items-center justify-center min-h-screen">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
	</div>
{:else if auth.isAuthenticated}
	{@render children()}
{:else if fallback}
	{@render fallback()}
{:else}
	<div class="flex items-center justify-center min-h-screen">
		<p>Redirecting...</p>
	</div>
{/if}
