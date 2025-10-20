<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ToastContainer } from '$lib/notifications';
	import { initializeErrorNotifications } from '$lib/errors/integrations';
	import { languageStore } from '$lib/stores/languageStore.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	// Initialize on mount
	onMount(() => {
		// Initialize error notifications
		const unsubscribe = initializeErrorNotifications();

		// Initialize language store from localStorage
		languageStore.init();

		return unsubscribe;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<!-- Toast notifications -->
<ToastContainer />
