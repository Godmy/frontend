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

<div class="flex h-full flex-col bg-white rounded-xl shadow-lg border border-gray-200">
	{#if !tableName}
		<!-- Empty State -->
		<div class="flex h-full items-center justify-center p-8">
			<div class="text-center">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
					<TableIcon class="h-8 w-8 text-gray-400" />
				</div>
				<h3 class="text-lg font-medium text-gray-900">No table selected</h3>
				<p class="mt-1 text-sm text-gray-500">Select a table from the list to view its data</p>
			</div>
		</div>
	{:else}
		<!-- Header -->
		<div class="border-b border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-xl font-bold text-gray-900">{tableName}</h2>
					<p class="mt-1 text-sm text-gray-500">
						{tableData?.total || 0} total records
					</p>
				</div>
				<button
					onclick={onCreateRecord}
					class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
				>
					<Plus class="h-4 w-4" />
					Add Record
				</button>
			</div>
		</div>

		<!-- Table Content -->
		<div class="flex-1 overflow-auto">
			{#if isLoading}
				<div class="flex h-full items-center justify-center">
					<div class="text-center">
						<div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
						<p class="mt-2 text-sm text-gray-500">Loading data...</p>
					</div>
				</div>
			{:else if !tableData || tableData.rows.length === 0}
				<div class="flex h-full items-center justify-center p-8">
					<div class="text-center">
						<p class="text-sm text-gray-500">No records found</p>
					</div>
				</div>
			{:else}
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50 sticky top-0 z-10">
						<tr>
							{#each tableData.columns as column}
								<th
									class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									<div class="flex items-center gap-1">
										{column}
										{#if tableSchema?.columns.find((c) => c.name === column)?.primaryKey}
											<span class="text-indigo-600" title="Primary Key">🔑</span>
										{/if}
									</div>
								</th>
							{/each}
							<th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white">
						{#each tableData.rows as row, idx}
							<tr class="hover:bg-gray-50 transition-colors">
								{#each tableData.columns as column}
									<td class="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
										<span title={formatValue(row[column])}>
											{truncate(formatValue(row[column]))}
										</span>
									</td>
								{/each}
								<td class="px-4 py-3 text-sm text-right whitespace-nowrap">
									<div class="flex items-center justify-end gap-2">
										<button
											onclick={() => onEditRecord(row)}
											class="rounded-lg p-1.5 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
											title="Edit record"
										>
											<Edit class="h-4 w-4" />
										</button>
										<button
											onclick={() => onDeleteRecord(row)}
											class="rounded-lg p-1.5 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
											title="Delete record"
										>
											<Trash2 class="h-4 w-4" />
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>

		<!-- Pagination -->
		{#if tableData && tableData.rows.length > 0}
			<div class="border-t border-gray-200 p-4">
				<div class="flex items-center justify-between">
					<!-- Page Size Selector -->
					<div class="flex items-center gap-2">
						<span class="text-sm text-gray-700">Rows per page:</span>
						<select
							bind:value={pageSize}
							onchange={(e) => onPageSizeChange(Number((e.target as HTMLSelectElement).value))}
							class="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						>
							<option value={10}>10</option>
							<option value={25}>25</option>
							<option value={50}>50</option>
							<option value={100}>100</option>
						</select>
					</div>

					<!-- Pagination Info -->
					<div class="flex items-center gap-4">
						<span class="text-sm text-gray-700">
							Page {currentPage + 1} of {totalPages || 1}
						</span>

						<!-- Pagination Buttons -->
						<div class="flex items-center gap-1">
							<button
								onclick={() => onPageChange(currentPage - 1)}
								disabled={currentPage === 0}
								class="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
							>
								<ChevronLeft class="h-4 w-4" />
							</button>
							<button
								onclick={() => onPageChange(currentPage + 1)}
								disabled={!tableData.hasMore}
								class="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
							>
								<ChevronRight class="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>
