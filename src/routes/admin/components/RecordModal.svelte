<script lang="ts">
	import { onMount } from 'svelte';

	interface ColumnInfo {
		name: string;
		type: string;
		nullable: boolean;
		primaryKey: boolean;
		default: string | null;
	}

	interface Props {
		isOpen: boolean;
		mode: 'create' | 'edit';
		tableName: string;
		columns: ColumnInfo[];
		initialData?: Record<string, any>;
		onClose: () => void;
		onSave: (data: Record<string, any>) => Promise<void>;
	}

	let { isOpen, mode, tableName, columns, initialData, onClose, onSave }: Props = $props();

	let formData = $state<Record<string, any>>({});
	let isSaving = $state(false);
	let errors = $state<Record<string, string>>({});

	$effect(() => {
		if (isOpen) {
			if (mode === 'edit' && initialData) {
				formData = { ...initialData };
			} else {
				const newData: Record<string, any> = {};
				columns.forEach((col) => {
					if (!col.primaryKey) {
						newData[col.name] = initialData?.[col.name] ?? '';
					}
				});
				formData = newData;
			}
			errors = {};
		}
	});

	function handleClose() {
		if (!isSaving) {
			onClose();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}

	function getInputType(columnType: string): string {
		const type = columnType.toLowerCase();
		if (type.includes('int') || type.includes('numeric') || type.includes('decimal')) return 'number';
		if (type.includes('bool')) return 'checkbox';
		if (type.includes('date') && !type.includes('timestamp')) return 'date';
		if (type.includes('timestamp') || type.includes('datetime')) return 'datetime-local';
		if (type.includes('text')) return 'textarea';
		return 'text';
	}

	function validateForm(): boolean {
		const newErrors: Record<string, string> = {};
		columns.forEach((col) => {
			if (col.primaryKey && mode === 'create') return;
			const value = formData[col.name];
			const isEmpty = value === null || value === undefined || value === '';
			if (!col.nullable && isEmpty && !col.default) {
				newErrors[col.name] = 'This field is required';
			}
		});
		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!validateForm()) return;

		isSaving = true;
		try {
			const cleanedData: Record<string, any> = {};
			Object.entries(formData).forEach(([key, value]) => {
				const col = columns.find((c) => c.name === key);
				if (value === '' && col?.nullable) {
					cleanedData[key] = null;
				} else if (value !== '' || !col?.nullable) {
					cleanedData[key] = value;
				}
			});
			await onSave(cleanedData);
			handleClose();
		} catch (error) {
			console.error('Error saving record:', error);
			errors._form = error instanceof Error ? error.message : 'Failed to save record';
		} finally {
			isSaving = false;
		}
	}

	onMount(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) handleClose();
		};
		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	});
</script>

{#if isOpen}
	<div
		class="c-record-modal"
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Escape' && handleClose()}
		role="dialog"
		aria-modal="true"
		tabindex={-1}
	>
		<div class="c-record-modal__dialog">
			<div class="c-record-modal__header">
				<div>
					<h2 class="c-record-modal__title">
						{mode === 'create' ? 'Create New Record' : 'Edit Record'}
					</h2>
					<p class="c-record-modal__subtitle">Table: {tableName}</p>
				</div>
				<button class="c-record-modal__close" onclick={handleClose} disabled={isSaving} aria-label="Close">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
				</button>
			</div>

			<form class="c-record-modal__form" onsubmit={handleSubmit}>
				{#if errors._form}
					<div class="c-record-modal__form-error">{errors._form}</div>
				{/if}

				<div class="c-record-modal__fields">
					{#each columns as column}
						{#if !column.primaryKey || mode === 'edit'}
							<div class="c-record-modal__field">
								<label class="c-record-modal__label" for={column.name}>
									{column.name}
									{#if column.primaryKey}
										<span class="c-record-modal__pk-badge">(Primary Key)</span>
									{/if}
									{#if !column.nullable}
										<span class="c-record-modal__required">*</span>
									{/if}
								</label>

								<div class="c-record-modal__control">
									{#if getInputType(column.type) === 'checkbox'}
										<input
											id={column.name}
											type="checkbox"
											bind:checked={formData[column.name]}
											disabled={column.primaryKey && mode === 'edit'}
											class="c-record-modal__checkbox"
										/>
									{:else if getInputType(column.type) === 'textarea'}
										<textarea
											id={column.name}
											bind:value={formData[column.name]}
											disabled={column.primaryKey && mode === 'edit'}
											rows={3}
											class="c-record-modal__input {column.primaryKey && mode === 'edit'
												? 'c-record-modal__input--disabled'
												: ''}"
										></textarea>
									{:else}
										<input
											id={column.name}
											type={getInputType(column.type)}
											bind:value={formData[column.name]}
											disabled={column.primaryKey && mode === 'edit'}
											class="c-record-modal__input {column.primaryKey && mode === 'edit'
												? 'c-record-modal__input--disabled'
												: ''}"
										/>
									{/if}

									{#if errors[column.name]}
										<p class="c-record-modal__field-error">{errors[column.name]}</p>
									{/if}
									<p class="c-record-modal__field-hint">
										Type: {column.type}{column.nullable ? ' • Nullable' : ''}{column.default
											? ` • Default: ${column.default}`
											: ''}
									</p>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</form>

			<div class="c-record-modal__footer">
				<button
					type="button"
					class="c-record-modal__cancel"
					onclick={handleClose}
					disabled={isSaving}
				>
					Cancel
				</button>
				<button
					type="submit"
					class="c-record-modal__save"
					onclick={handleSubmit}
					disabled={isSaving}
				>
					{#if isSaving}
						<span class="c-record-modal__spinner"></span>
						Saving...
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
						{mode === 'create' ? 'Create' : 'Update'}
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.c-record-modal {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background: rgb(0 0 0 / 0.5);
	}
	.c-record-modal__dialog {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 42rem;
		max-height: 90vh;
		background: var(--color-background-primary, #fff);
		border-radius: var(--radius-xl, 0.75rem);
		box-shadow: 0 20px 60px rgb(0 0 0 / 0.2);
	}
	.c-record-modal__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid var(--color-border-primary, #e5e7eb);
		padding: 1.25rem 1.5rem;
		flex-shrink: 0;
	}
	.c-record-modal__title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-primary, #111827);
		margin: 0;
	}
	.c-record-modal__subtitle {
		font-size: 0.875rem;
		color: var(--color-text-secondary, #6b7280);
		margin: 0.25rem 0 0;
	}
	.c-record-modal__close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border: none;
		border-radius: var(--radius-md, 0.375rem);
		background: transparent;
		color: var(--color-text-tertiary, #9ca3af);
		cursor: pointer;
		transition: background 0.12s, color 0.12s;
	}
	.c-record-modal__close:hover {
		background: var(--color-background-secondary, #f3f4f6);
		color: var(--color-text-secondary, #374151);
	}
	.c-record-modal__close:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.c-record-modal__form {
		flex: 1;
		overflow-y: auto;
		padding: 1.5rem;
	}
	.c-record-modal__form-error {
		margin-bottom: 1rem;
		padding: 0.75rem;
		border-radius: var(--radius-md, 0.375rem);
		background: #fef2f2;
		color: #b91c1c;
		font-size: 0.875rem;
	}
	.c-record-modal__fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.c-record-modal__field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}
	.c-record-modal__label {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary, #374151);
	}
	.c-record-modal__pk-badge {
		font-size: 0.75rem;
		color: var(--color-primary-600, #4f46e5);
	}
	.c-record-modal__required {
		color: #ef4444;
	}
	.c-record-modal__control {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.c-record-modal__input {
		display: block;
		width: 100%;
		border: 1px solid var(--color-border-primary, #d1d5db);
		border-radius: var(--radius-md, 0.375rem);
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		color: var(--color-text-primary, #111827);
		background: var(--color-background-primary, #fff);
		box-sizing: border-box;
	}
	.c-record-modal__input:focus {
		outline: none;
		border-color: var(--color-primary-500, #6366f1);
		box-shadow: 0 0 0 2px rgb(99 102 241 / 0.15);
	}
	.c-record-modal__input--disabled,
	.c-record-modal__input:disabled {
		background: var(--color-background-secondary, #f9fafb);
		opacity: 0.7;
		cursor: not-allowed;
	}
	.c-record-modal__checkbox {
		width: 1rem;
		height: 1rem;
		accent-color: var(--color-primary-600, #4f46e5);
	}
	.c-record-modal__field-error {
		font-size: 0.75rem;
		color: #dc2626;
		margin: 0;
	}
	.c-record-modal__field-hint {
		font-size: 0.75rem;
		color: var(--color-text-tertiary, #9ca3af);
		margin: 0;
	}
	.c-record-modal__footer {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.75rem;
		border-top: 1px solid var(--color-border-primary, #e5e7eb);
		padding: 1rem 1.5rem;
		flex-shrink: 0;
	}
	.c-record-modal__cancel {
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
	.c-record-modal__cancel:hover {
		background: var(--color-background-secondary, #f9fafb);
	}
	.c-record-modal__cancel:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.c-record-modal__save {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #fff;
		background: var(--color-primary-600, #4f46e5);
		border: none;
		border-radius: var(--radius-md, 0.375rem);
		cursor: pointer;
		transition: background 0.12s;
	}
	.c-record-modal__save:hover {
		background: var(--color-primary-700, #4338ca);
	}
	.c-record-modal__save:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.c-record-modal__spinner {
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
