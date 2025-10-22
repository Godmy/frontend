<script lang="ts">
	import type { KeyboardShortcut } from '$lib/utils/keyboard';
	import { formatShortcut } from '$lib/utils/keyboard';
	import Modal from './Modal.svelte';

	type Props = {
		isOpen: boolean;
		onClose: () => void;
		shortcuts: KeyboardShortcut[];
		title?: string;
	};

	let {
		isOpen = $bindable(),
		onClose,
		shortcuts,
		title = 'Keyboard Shortcuts'
	}: Props = $props();

	const shortcutsWithDescriptions = $derived(
		shortcuts.filter(s => s.description)
	);
</script>

<Modal {isOpen} {onClose} {title} size="md">
	{#snippet children()}
		<div class="space-y-2">
			{#if shortcutsWithDescriptions.length === 0}
				<p class="text-gray-500 text-sm">No keyboard shortcuts available.</p>
			{:else}
				<dl class="space-y-3">
					{#each shortcutsWithDescriptions as shortcut}
						<div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
							<dt class="text-sm text-gray-700">{shortcut.description}</dt>
							<dd class="ml-4">
								<kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
									{formatShortcut(shortcut)}
								</kbd>
							</dd>
						</div>
					{/each}
				</dl>
			{/if}
		</div>
	{/snippet}

	{#snippet footer()}
		<button
			type="button"
			onclick={onClose}
			class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
		>
			Close
		</button>
	{/snippet}
</Modal>
