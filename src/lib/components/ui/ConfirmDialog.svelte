<script lang="ts">
	import Modal from './Modal.svelte';

	type Props = {
		isOpen: boolean;
		onClose: () => void;
		onConfirm: () => void;
		title: string;
		message: string;
		confirmText?: string;
		cancelText?: string;
		variant?: 'danger' | 'warning' | 'info';
		isLoading?: boolean;
	};

	let {
		isOpen = $bindable(),
		onClose,
		onConfirm,
		title,
		message,
		confirmText = 'Confirm',
		cancelText = 'Cancel',
		variant = 'danger',
		isLoading = false
	}: Props = $props();

	const variantClasses = {
		danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
		warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
		info: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
	};

	const iconColors = {
		danger: 'text-red-600',
		warning: 'text-yellow-600',
		info: 'text-indigo-600'
	};

	function handleConfirm() {
		onConfirm();
	}
</script>

<Modal {isOpen} {onClose} {title} size="sm">
	{#snippet children()}
		<div class="sm:flex sm:items-start">
			<div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
				{#if variant === 'danger'}
					<svg class="h-6 w-6 {iconColors[variant]}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
				{:else if variant === 'warning'}
					<svg class="h-6 w-6 {iconColors[variant]}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
				{:else}
					<svg class="h-6 w-6 {iconColors[variant]}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				{/if}
			</div>
			<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
				<p class="text-sm text-gray-500">
					{message}
				</p>
			</div>
		</div>
	{/snippet}

	{#snippet footer()}
		<button
			type="button"
			disabled={isLoading}
			class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 {variantClasses[variant]} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
			onclick={handleConfirm}
		>
			{#if isLoading}
				<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			{/if}
			{confirmText}
		</button>
		<button
			type="button"
			disabled={isLoading}
			class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
			onclick={onClose}
		>
			{cancelText}
		</button>
	{/snippet}
</Modal>
