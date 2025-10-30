<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import favicon from '$lib/assets/favicon.svg';
	import { ToastContainer } from '$lib/notifications';
	import { initializeErrorNotifications } from '$lib/errors/integrations';
	import { languageStore } from '$lib/stores/languageStore.svelte';
	import { onlineStore } from '$lib/stores/online.store.svelte';
	import { t } from '$lib/utils/i18n';
	import { onMount } from 'svelte';
	import { AppHeader } from '$widgets/header';

	let { children } = $props();

	// Получить переводы из layout data
	const trans = $derived($page.data.translations || {});
	let isOnline = $state(true);

	// Initialize on mount
	onMount(() => {
		// Initialize error notifications
		const unsubscribe = initializeErrorNotifications();

		// Track online status from store
		const unsubscribeOnline = onlineStore.subscribe(value => {
			isOnline = value;
		});

		// Initialize language store from localStorage
		languageStore.init();

		return () => {
			unsubscribe?.();
			unsubscribeOnline();
		};
	});

	// Реактивно отслеживать изменение языка и показывать в консоли
	$effect(() => {
		const langId = languageStore.currentLanguageId;
		console.log('[Layout] Current language ID changed to:', langId);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Universal Header -->
<AppHeader />

<!-- Offline Banner -->
{#if !isOnline}
	<div class="bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium sticky top-16 z-40 shadow-md">
		<div class="flex items-center justify-center space-x-2">
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
			<span>{t(trans, 'ui/common/offline', 'You are currently offline. Some features may not be available.')}</span>
		</div>
	</div>
{/if}

<!-- Page Content -->
{@render children?.()}

<!-- Toast notifications -->
<ToastContainer />
