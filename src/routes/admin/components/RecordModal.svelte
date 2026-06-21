<script lang="ts">
	import { X, Save } from 'lucide-svelte';
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

	// Initialize form data when modal opens or data changes
	$effect(() => {
		if (isOpen) {
			if (mode === 'edit' && initialData) {
				formData = { ...initialData };
			} else {
				// Initialize with empty values or defaults
				const newData: Record<string, any> = {};
				columns.forEach((col) => {
					if (!col.primaryKey) {
						// Don't include primary key for create
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
		if (type.includes('int') || type.includes('numeric') || type.includes('decimal')) {
			return 'number';
		}
		if (type.includes('bool')) {
			return 'checkbox';
		}
		if (type.includes('date') && !type.includes('timestamp')) {
			return 'date';
		}
		if (type.includes('timestamp') || type.includes('datetime')) {
			return 'datetime-local';
		}
		if (type.includes('text')) {
			return 'textarea';
		}
		return 'text';
	}

	function validateForm(): boolean {
		const newErrors: Record<string, string> = {};

		columns.forEach((col) => {
			if (col.primaryKey && mode === 'create') return; // Skip PK for create

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
			// Convert empty strings to null for nullable fields
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

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Escape' && handleClose()}
		role="dialog"
		aria-modal="true"
		tabindex={-1}
	>
		<div class="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl">
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-gray-200 p-6">
				<div>
					<h2 class="text-xl font-bold text-gray-900">
						{mode === 'create' ? 'Create New Record' : 'Edit Record'}
					</h2>
					<p class="mt-1 text-sm text-gray-500">Table: {tableName}</p>
				</div>
				<button
					onclick={handleClose}
					disabled={isSaving}
					class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 transition-colors"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Form -->
			<form onsubmit={handleSubmit} class="flex-1 overflow-y-auto p-6">
				{#if errors._form}
					<div class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
						{errors._form}
					</div>
				{/if}

				<div class="space-y-4">
					{#each columns as column}
						{#if !column.primaryKey || mode === 'edit'}
							<div>
								<label for={column.name} class="block text-sm font-medium text-gray-700">
									{column.name}
									{#if column.primaryKey}
										<span class="text-xs text-indigo-600">(Primary Key)</span>
									{/if}
									{#if !column.nullable}
										<span class="text-red-500">*</span>
									{/if}
								</label>

								<div class="mt-1">
									{#if getInputType(column.type) === 'checkbox'}
										<input
											id={column.name}
											type="checkbox"
											bind:checked={formData[column.name]}
											disabled={column.primaryKey && mode === 'edit'}
											class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
										/>
									{:else if getInputType(column.type) === 'textarea'}
										<textarea
											id={column.name}
											bind:value={formData[column.name]}
											disabled={column.primaryKey && mode === 'edit'}
											rows={3}
											class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:opacity-50"
										></textarea>
									{:else}
										<input
											id={column.name}
											type={getInputType(column.type)}
											bind:value={formData[column.name]}
											disabled={column.primaryKey && mode === 'edit'}
											class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:opacity-50"
										/>
									{/if}

									{#if errors[column.name]}
										<p class="mt-1 text-xs text-red-600">{errors[column.name]}</p>
									{/if}

									<p class="mt-1 text-xs text-gray-500">
										Type: {column.type}
										{#if column.nullable} • Nullable{/if}
										{#if column.default} • Default: {column.default}{/if}
									</p>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</form>

			<!-- Footer -->
			<div class="flex items-center justify-end gap-3 border-t border-gray-200 p-6">
				<button
					type="button"
					onclick={handleClose}
					disabled={isSaving}
					class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
				>
					Cancel
				</button>
				<button
					type="submit"
					onclick={handleSubmit}
					disabled={isSaving}
					class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
				>
					{#if isSaving}
						<div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
						Saving...
					{:else}
						<Save class="h-4 w-4" />
						{mode === 'create' ? 'Create' : 'Update'}
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
