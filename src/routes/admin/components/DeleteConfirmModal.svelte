<script lang="ts">
	import { AlertTriangle, X } from 'lucide-svelte';
	import { onMount } from 'svelte';

	interface Props {
		isOpen: boolean;
		tableName: string;
		record: Record<string, any> | null;
		primaryKeyColumn: string;
		onClose: () => void;
		onConfirm: () => Promise<void>;
	}

	let { isOpen, tableName, record, primaryKeyColumn, onClose, onConfirm }: Props = $props();

	let isDeleting = $state(false);
	let error = $state<string | null>(null);

	function handleClose() {
		if (!isDeleting) {
			onClose();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}

	async function handleConfirm() {
		isDeleting = true;
		error = null;

		try {
			await onConfirm();
			handleClose();
		} catch (err) {
			console.error('Error deleting record:', err);
			error = err instanceof Error ? err.message : 'Failed to delete record';
		} finally {
			isDeleting = false;
		}
	}

	// Handle escape key
	onMount(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				handleClose();
			}
		};

		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	});
</script>

{#if isOpen && record}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Escape' && handleClose()}
		role="dialog"
		aria-modal="true"
		tabindex={-1}
	>
		<div class="w-full max-w-md bg-white rounded-xl shadow-2xl">
			<!-- Header -->
			<div class="flex items-start gap-4 p-6">
				<div class="flex-shrink-0 rounded-full bg-red-100 p-3">
					<AlertTriangle class="h-6 w-6 text-red-600" />
				</div>
				<div class="flex-1">
					<h3 class="text-lg font-semibold text-gray-900">Delete Record</h3>
					<p class="mt-2 text-sm text-gray-500">
						Are you sure you want to delete this record from <span class="font-medium"
							>{tableName}</span
						>? This action cannot be undone.
					</p>

					{#if record}
						<div class="mt-4 rounded-lg bg-gray-50 p-3">
							<p class="text-xs font-medium uppercase tracking-wide text-gray-500">
								Record Details:
							</p>
							<dl class="mt-2 space-y-1">
								{#each Object.entries(record).slice(0, 5) as [key, value]}
									<div class="flex gap-2 text-sm">
										<dt class="font-medium text-gray-700">{key}:</dt>
										<dd class="text-gray-600 truncate">
											{value === null || value === undefined ? '-' : String(value)}
										</dd>
									</div>
								{/each}
								{#if Object.entries(record).length > 5}
									<p class="text-xs text-gray-500 italic">
										...and {Object.entries(record).length - 5} more fields
									</p>
								{/if}
							</dl>
						</div>
					{/if}

					{#if error}
						<div class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
							{error}
						</div>
					{/if}
				</div>

				<button
					onclick={handleClose}
					disabled={isDeleting}
					class="flex-shrink-0 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 transition-colors"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Footer -->
			<div class="flex items-center justify-end gap-3 border-t border-gray-200 p-6">
				<button
					type="button"
					onclick={handleClose}
					disabled={isDeleting}
					class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
				>
					Cancel
				</button>
				<button
					type="button"
					onclick={handleConfirm}
					disabled={isDeleting}
					class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
				>
					{#if isDeleting}
						<div
							class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
						></div>
						Deleting...
					{:else}
						Delete
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
