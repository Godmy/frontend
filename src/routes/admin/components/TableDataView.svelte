<script lang="ts">
	import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, Table as TableIcon } from 'lucide-svelte';

	interface ColumnInfo {
		name: string;
		type: string;
		nullable: boolean;
		primaryKey: boolean;
		default: string | null;
	}

	interface TableData {
		tableName: string;
		columns: string[];
		rows: Array<Record<string, any>>;
		total: number;
		hasMore: boolean;
	}

	interface TableSchema {
		tableName: string;
		columns: ColumnInfo[];
	}

	interface Props {
		tableName: string | null;
		tableData: TableData | null;
		tableSchema: TableSchema | null;
		isLoading: boolean;
		currentPage: number;
		pageSize: number;
		onPageChange: (page: number) => void;
		onPageSizeChange: (size: number) => void;
		onCreateRecord: () => void;
		onEditRecord: (record: Record<string, any>) => void;
		onDeleteRecord: (record: Record<string, any>) => void;
	}

	let {
		tableName,
		tableData,
		tableSchema,
		isLoading,
		currentPage,
		pageSize,
		onPageChange,
		onPageSizeChange,
		onCreateRecord,
		onEditRecord,
		onDeleteRecord
	}: Props = $props();

	const totalPages = $derived(() => {
		if (!tableData?.total) return 0;
		return Math.ceil(tableData.total / pageSize);
	});

	const primaryKeyColumn = $derived(() => {
		return tableSchema?.columns.find((col) => col.primaryKey)?.name || 'id';
	});

	function formatValue(value: any): string {
		if (value === null || value === undefined) return '-';
		if (typeof value === 'boolean') return value ? 'true' : 'false';
		if (typeof value === 'object') return JSON.stringify(value);
		return String(value);
	}

	function truncate(str: string, maxLength: number = 50): string {
		if (str.length <= maxLength) return str;
		return str.substring(0, maxLength) + '...';
	}
</script>

<div class="c-table-view">
	{#if !tableName}
		<div class="c-table-view__empty">
			<div class="c-table-view__empty-icon">
				<TableIcon size={32} />
			</div>
			<h3 class="c-table-view__empty-title">No table selected</h3>
			<p class="c-table-view__empty-desc">Select a table from the list to view its data</p>
		</div>
	{:else}
		<div class="c-table-view__header">
			<div>
				<h2 class="c-table-view__title">{tableName}</h2>
				<p class="c-table-view__total">{tableData?.total || 0} total records</p>
			</div>
			<button class="c-table-view__add-btn" onclick={onCreateRecord}>
				<Plus size={16} />
				Add Record
			</button>
		</div>

		<div class="c-table-view__body">
			{#if isLoading}
				<div class="c-table-view__loading">
					<span class="c-table-view__spinner"></span>
					<p>Loading data...</p>
				</div>
			{:else if !tableData || tableData.rows.length === 0}
				<div class="c-table-view__no-data">
					<p>No records found</p>
				</div>
			{:else}
				<table class="c-table-view__table">
					<thead class="c-table-view__thead">
						<tr>
							{#each tableData.columns as column}
								<th class="c-table-view__th">
									<div class="c-table-view__th-inner">
										{column}
										{#if tableSchema?.columns.find((c) => c.name === column)?.primaryKey}
											<span title="Primary Key">🔑</span>
										{/if}
									</div>
								</th>
							{/each}
							<th class="c-table-view__th c-table-view__th--actions">Actions</th>
						</tr>
					</thead>
					<tbody class="c-table-view__tbody">
						{#each tableData.rows as row}
							<tr class="c-table-view__tr">
								{#each tableData.columns as column}
									<td class="c-table-view__td">
										<span title={formatValue(row[column])}>
											{truncate(formatValue(row[column]))}
										</span>
									</td>
								{/each}
								<td class="c-table-view__td c-table-view__td--actions">
									<div class="c-table-view__actions">
										<button
											class="c-table-view__edit-btn"
											onclick={() => onEditRecord(row)}
											title="Edit record"
										>
											<Edit size={16} />
										</button>
										<button
											class="c-table-view__delete-btn"
											onclick={() => onDeleteRecord(row)}
											title="Delete record"
										>
											<Trash2 size={16} />
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>

		{#if tableData && tableData.rows.length > 0}
			<div class="c-table-view__pagination">
				<div class="c-table-view__page-size">
					<span>Rows per page:</span>
					<select
						bind:value={pageSize}
						onchange={(e) => onPageSizeChange(Number((e.target as HTMLSelectElement).value))}
						class="c-table-view__page-select"
					>
						<option value={10}>10</option>
						<option value={25}>25</option>
						<option value={50}>50</option>
						<option value={100}>100</option>
					</select>
				</div>
				<div class="c-table-view__page-info">
					<span>Page {currentPage + 1} of {totalPages || 1}</span>
					<div class="c-table-view__page-btns">
						<button
							class="c-table-view__page-btn"
							onclick={() => onPageChange(currentPage - 1)}
							disabled={currentPage === 0}
						>
							<ChevronLeft size={16} />
						</button>
						<button
							class="c-table-view__page-btn"
							onclick={() => onPageChange(currentPage + 1)}
							disabled={!tableData.hasMore}
						>
							<ChevronRight size={16} />
						</button>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	.c-table-view {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: var(--color-background-primary, #fff);
		border-radius: var(--radius-lg, 0.75rem);
		border: 1px solid var(--color-border-primary, #e5e7eb);
		box-shadow: 0 2px 8px rgb(0 0 0 / 0.08);
		overflow: hidden;
	}

	/* Empty state */
	.c-table-view__empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 2rem;
		text-align: center;
	}
	.c-table-view__empty-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 4rem;
		height: 4rem;
		border-radius: 50%;
		background: var(--color-background-secondary, #f3f4f6);
		color: var(--color-text-tertiary, #9ca3af);
		margin-bottom: 1rem;
	}
	.c-table-view__empty-title {
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--color-text-primary, #111827);
		margin: 0 0 0.25rem;
	}
	.c-table-view__empty-desc {
		font-size: 0.875rem;
		color: var(--color-text-secondary, #6b7280);
		margin: 0;
	}

	/* Header */
	.c-table-view__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid var(--color-border-primary, #e5e7eb);
		padding: 1rem 1.25rem;
		flex-shrink: 0;
	}
	.c-table-view__title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-primary, #111827);
		margin: 0;
	}
	.c-table-view__total {
		font-size: 0.875rem;
		color: var(--color-text-secondary, #6b7280);
		margin: 0.25rem 0 0;
	}
	.c-table-view__add-btn {
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
	.c-table-view__add-btn:hover {
		background: var(--color-primary-700, #4338ca);
	}

	/* Body */
	.c-table-view__body {
		flex: 1;
		overflow: auto;
	}
	.c-table-view__loading,
	.c-table-view__no-data {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--color-text-secondary, #6b7280);
	}
	.c-table-view__spinner {
		display: inline-block;
		width: 2rem;
		height: 2rem;
		border: 3px solid var(--color-border-primary, #e5e7eb);
		border-top-color: var(--color-primary-600, #4f46e5);
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}
	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	/* Table */
	.c-table-view__table {
		width: 100%;
		min-width: 100%;
		border-collapse: collapse;
	}
	.c-table-view__thead {
		position: sticky;
		top: 0;
		z-index: 10;
		background: var(--color-background-secondary, #f9fafb);
	}
	.c-table-view__th {
		padding: 0.75rem 1rem;
		text-align: left;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-secondary, #6b7280);
		white-space: nowrap;
		border-bottom: 1px solid var(--color-border-primary, #e5e7eb);
	}
	.c-table-view__th--actions {
		text-align: right;
	}
	.c-table-view__th-inner {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	.c-table-view__tbody .c-table-view__tr {
		border-bottom: 1px solid var(--color-border-primary, #f3f4f6);
		transition: background 0.1s;
	}
	.c-table-view__tbody .c-table-view__tr:hover {
		background: var(--color-background-secondary, #f9fafb);
	}
	.c-table-view__td {
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		color: var(--color-text-primary, #111827);
		white-space: nowrap;
	}
	.c-table-view__td--actions {
		text-align: right;
	}
	.c-table-view__actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.375rem;
	}
	.c-table-view__edit-btn,
	.c-table-view__delete-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: none;
		border-radius: var(--radius-md, 0.375rem);
		background: transparent;
		cursor: pointer;
		transition: background 0.12s, color 0.12s;
	}
	.c-table-view__edit-btn {
		color: var(--color-text-secondary, #6b7280);
	}
	.c-table-view__edit-btn:hover {
		background: var(--color-primary-50, #eef2ff);
		color: var(--color-primary-600, #4f46e5);
	}
	.c-table-view__delete-btn {
		color: var(--color-text-secondary, #6b7280);
	}
	.c-table-view__delete-btn:hover {
		background: #fef2f2;
		color: #dc2626;
	}

	/* Pagination */
	.c-table-view__pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 1px solid var(--color-border-primary, #e5e7eb);
		padding: 0.75rem 1.25rem;
		flex-shrink: 0;
	}
	.c-table-view__page-size {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--color-text-secondary, #374151);
	}
	.c-table-view__page-select {
		border: 1px solid var(--color-border-primary, #d1d5db);
		border-radius: var(--radius-md, 0.375rem);
		padding: 0.2rem 0.5rem;
		font-size: 0.875rem;
	}
	.c-table-view__page-select:focus {
		outline: none;
		border-color: var(--color-primary-500, #6366f1);
		box-shadow: 0 0 0 2px rgb(99 102 241 / 0.15);
	}
	.c-table-view__page-info {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: 0.875rem;
		color: var(--color-text-secondary, #374151);
	}
	.c-table-view__page-btns {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	.c-table-view__page-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: none;
		border-radius: var(--radius-md, 0.375rem);
		background: transparent;
		color: var(--color-text-secondary, #6b7280);
		cursor: pointer;
		transition: background 0.12s;
	}
	.c-table-view__page-btn:hover:not(:disabled) {
		background: var(--color-background-secondary, #f3f4f6);
	}
	.c-table-view__page-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
