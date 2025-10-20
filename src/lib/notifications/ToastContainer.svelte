<script lang="ts">
	import { notificationStore } from './notificationStore.svelte';
	import Toast from './Toast.svelte';
</script>

<!-- Toast container - positioned at top right -->
<div
	aria-live="assertive"
	class="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
>
	<div class="flex w-full flex-col items-center space-y-4 sm:items-end">
		{#each notificationStore.items as notification (notification.id)}
			<Toast {notification} />
		{/each}
	</div>
</div>
