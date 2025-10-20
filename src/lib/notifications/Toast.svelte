<script lang="ts">
	import { NotificationType, type Notification } from './types';
	import { notificationStore } from './notificationStore.svelte';

	let { notification }: { notification: Notification } = $props();

	const icons = {
		[NotificationType.SUCCESS]: '✓',
		[NotificationType.ERROR]: '✕',
		[NotificationType.WARNING]: '⚠',
		[NotificationType.INFO]: 'ℹ'
	};

	const colors = {
		[NotificationType.SUCCESS]: 'bg-green-50 border-green-200 text-green-800',
		[NotificationType.ERROR]: 'bg-red-50 border-red-200 text-red-800',
		[NotificationType.WARNING]: 'bg-yellow-50 border-yellow-200 text-yellow-800',
		[NotificationType.INFO]: 'bg-blue-50 border-blue-200 text-blue-800'
	};

	const iconColors = {
		[NotificationType.SUCCESS]: 'bg-green-500 text-white',
		[NotificationType.ERROR]: 'bg-red-500 text-white',
		[NotificationType.WARNING]: 'bg-yellow-500 text-white',
		[NotificationType.INFO]: 'bg-blue-500 text-white'
	};

	function handleDismiss() {
		notificationStore.dismiss(notification.id);
	}

	function handleAction() {
		if (notification.action) {
			notification.action.callback();
			handleDismiss();
		}
	}
</script>

<div
	role="alert"
	class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all {colors[
		notification.type
	]}"
>
	<div class="p-4">
		<div class="flex items-start">
			<!-- Icon -->
			<div class="flex-shrink-0">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold {iconColors[
						notification.type
					]}"
				>
					{icons[notification.type]}
				</div>
			</div>

			<!-- Content -->
			<div class="ml-3 w-0 flex-1">
				{#if notification.title}
					<p class="text-sm font-medium">{notification.title}</p>
				{/if}
				<p class="mt-1 text-sm {notification.title ? 'opacity-90' : ''}">
					{notification.message}
				</p>

				{#if notification.action}
					<div class="mt-3">
						<button
							type="button"
							onclick={handleAction}
							class="rounded-md text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2"
						>
							{notification.action.label}
						</button>
					</div>
				{/if}
			</div>

			<!-- Close button -->
			{#if notification.dismissible}
				<div class="ml-4 flex flex-shrink-0">
					<button
						type="button"
						onclick={handleDismiss}
						class="inline-flex rounded-md hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2"
					>
						<span class="sr-only">Close</span>
						<svg
							class="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
							/>
						</svg>
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
