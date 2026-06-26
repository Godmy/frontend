<script lang="ts">
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
		class="c-delete-modal"
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Escape' && handleClose()}
		role="dialog"
		aria-modal="true"
		tabindex={-1}
	>
		<div class="c-delete-modal__dialog">
			<div class="c-delete-modal__header">
				<div class="c-delete-modal__icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
				</div>
				<div class="c-delete-modal__body">
					<h3 class="c-delete-modal__title">Delete Record</h3>
					<p class="c-delete-modal__description">
						Are you sure you want to delete this record from
						<strong class="c-delete-modal__table-name">{tableName}</strong>?
						This action cannot be undone.
					</p>

					{#if record}
						<div class="c-delete-modal__record">
							<p class="c-delete-modal__record-label">Record Details:</p>
							<dl class="c-delete-modal__record-list">
								{#each Object.entries(record).slice(0, 5) as [key, value]}
									<div class="c-delete-modal__record-item">
										<dt>{key}:</dt>
										<dd>{value === null || value === undefined ? '-' : String(value)}</dd>
									</div>
								{/each}
								{#if Object.entries(record).length > 5}
									<p class="c-delete-modal__record-more">
										...and {Object.entries(record).length - 5} more fields
									</p>
								{/if}
							</dl>
						</div>
					{/if}

					{#if error}
						<div class="c-delete-modal__error">{error}</div>
					{/if}
				</div>
				<button
					class="c-delete-modal__close"
					onclick={handleClose}
					disabled={isDeleting}
					aria-label="Close"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
				</button>
			</div>

			<div class="c-delete-modal__footer">
				<button
					type="button"
					class="c-delete-modal__cancel"
					onclick={handleClose}
					disabled={isDeleting}
				>
					Cancel
				</button>
				<button
					type="button"
					class="c-delete-modal__confirm"
					onclick={handleConfirm}
					disabled={isDeleting}
				>
					{#if isDeleting}
						<span class="c-delete-modal__spinner"></span>
						Deleting...
					{:else}
						Delete
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.c-delete-modal {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background: rgb(0 0 0 / 0.5);
	}
	.c-delete-modal__dialog {
		width: 100%;
		max-width: 28rem;
		background: var(--color-background-primary, #fff);
		border-radius: var(--radius-xl, 0.75rem);
		box-shadow: 0 20px 60px rgb(0 0 0 / 0.2);
	}
	.c-delete-modal__header {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.5rem;
	}
	.c-delete-modal__icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: #fee2e2;
		color: #dc2626;
	}
	.c-delete-modal__body {
		flex: 1;
	}
	.c-delete-modal__title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-text-primary, #111827);
		margin: 0 0 0.5rem;
	}
	.c-delete-modal__description {
		font-size: 0.875rem;
		color: var(--color-text-secondary, #6b7280);
		margin: 0;
	}
	.c-delete-modal__table-name {
		font-weight: 500;
		color: var(--color-text-primary, #111827);
	}
	.c-delete-modal__record {
		margin-top: 1rem;
		padding: 0.75rem;
		background: var(--color-background-secondary, #f9fafb);
		border-radius: var(--radius-md, 0.375rem);
	}
	.c-delete-modal__record-label {
		font-size: 0.6875rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-tertiary, #9ca3af);
		margin: 0 0 0.5rem;
	}
	.c-delete-modal__record-list {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin: 0;
	}
	.c-delete-modal__record-item {
		display: flex;
		gap: 0.5rem;
		font-size: 0.875rem;
	}
	.c-delete-modal__record-item dt {
		font-weight: 500;
		color: var(--color-text-secondary, #374151);
		white-space: nowrap;
	}
	.c-delete-modal__record-item dd {
		color: var(--color-text-secondary, #6b7280);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin: 0;
	}
	.c-delete-modal__record-more {
		font-size: 0.75rem;
		color: var(--color-text-tertiary, #9ca3af);
		font-style: italic;
		margin: 0.25rem 0 0;
	}
	.c-delete-modal__error {
		margin-top: 1rem;
		padding: 0.75rem;
		border-radius: var(--radius-md, 0.375rem);
		background: #fef2f2;
		color: #b91c1c;
		font-size: 0.875rem;
	}
	.c-delete-modal__close {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: none;
		border-radius: var(--radius-md, 0.375rem);
		background: transparent;
		color: var(--color-text-tertiary, #9ca3af);
		cursor: pointer;
		transition: background 0.12s, color 0.12s;
	}
	.c-delete-modal__close:hover {
		background: var(--color-background-secondary, #f3f4f6);
		color: var(--color-text-secondary, #374151);
	}
	.c-delete-modal__close:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.c-delete-modal__footer {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.75rem;
		border-top: 1px solid var(--color-border-primary, #e5e7eb);
		padding: 1rem 1.5rem;
	}
	.c-delete-modal__cancel {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary, #374151);
		background: var(--color-background-primary, #fff);
		border: 1px solid var(--color-border-primary, #d1d5db);
		border-radius: var(--radius-md, 0.375rem);
		cursor: pointer;
		transition: background 0.12s;
	}
	.c-delete-modal__cancel:hover {
		background: var(--color-background-secondary, #f9fafb);
	}
	.c-delete-modal__cancel:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.c-delete-modal__confirm {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #fff;
		background: #dc2626;
		border: none;
		border-radius: var(--radius-md, 0.375rem);
		cursor: pointer;
		transition: background 0.12s;
	}
	.c-delete-modal__confirm:hover {
		background: #b91c1c;
	}
	.c-delete-modal__confirm:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.c-delete-modal__spinner {
		display: inline-block;
		width: 1rem;
		height: 1rem;
		border: 2px solid rgb(255 255 255 / 0.4);
		border-top-color: #fff;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
