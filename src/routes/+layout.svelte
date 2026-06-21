<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { ToastContainer } from '$lib/notifications';
	import { initializeErrorNotifications } from '$lib/errors/integrations';
	import { languageStore } from '$lib/stores/languageStore.svelte';
	import { t } from '$lib/utils/i18n';
	import { onMount } from 'svelte';
	import { useAuth } from '$lib/auth';
	
	let { children } = $props();
	const auth = useAuth();
	
	// Initialize on mount
	onMount(() => {
		// Initialize error notifications
		const unsubscribe = initializeErrorNotifications();
		
		// Initialize language store from localStorage
		languageStore.init();
		
		return () => {
			unsubscribe?.();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
</svelte:head>

<!-- Header with auth buttons only when not authenticated -->
{#if !auth.isAuthenticated}
	<header class="bg-white shadow-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<a href="/" class="text-xl font-bold text-indigo-600">vibe-management.pro</a>
				
				<nav class="flex space-x-4">
					<a href="/login" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Sign In</a>
					<a href="/register" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Sign Up</a>
				</nav>
			</div>
		</div>
	</header>
{/if}

<!-- Page Content -->
<div class="min-h-screen bg-gray-50">
	{@render children?.()}
</div>

<!-- Toast notifications -->
<ToastContainer />
