<script lang="ts">
	import { Database, Search } from 'lucide-svelte';

	interface TableInfo {
		name: string;
		rowCount: number;
		hasSoftDelete: boolean;
	}

	interface Props {
		tables: TableInfo[];
		selectedTable: string | null;
		onSelectTable: (tableName: string) => void;
	}

	let { tables, selectedTable, onSelectTable }: Props = $props();

	let searchQuery = $state('');

	const filteredTables = $derived(() => {
		if (!searchQuery.trim()) return tables;
		const query = searchQuery.toLowerCase();
		return tables.filter((table) => table.name.toLowerCase().includes(query));
	});

	function handleTableClick(tableName: string) {
		onSelectTable(tableName);
	}
</script>

<div class="flex h-full flex-col bg-white rounded-xl shadow-lg border border-gray-200">
	<!-- Header -->
	<div class="border-b border-gray-200 p-4">
		<div class="flex items-center gap-3 mb-4">
			<div class="rounded-lg bg-indigo-100 p-2">
				<Database class="h-5 w-5 text-indigo-600" />
			</div>
			<div>
				<h2 class="text-lg font-semibold text-gray-900">Database Tables</h2>
				<p class="text-sm text-gray-500">{tables.length} tables</p>
			</div>
		</div>

		<!-- Search -->
		<div class="relative">
			<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search tables..."
				class="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
			/>
		</div>
	</div>

	<!-- Table List -->
	<div class="flex-1 overflow-y-auto p-2">
		{#if filteredTables.length === 0}
			<div class="flex h-full items-center justify-center">
				<p class="text-sm text-gray-500">No tables found</p>
			</div>
		{:else}
			<div class="space-y-1">
				{#each filteredTables as table (table.name)}
					<button
						onclick={() => handleTableClick(table.name)}
						class="group w-full rounded-lg px-3 py-2.5 text-left transition-all hover:bg-gray-50
							{selectedTable === table.name
							? 'bg-indigo-50 text-indigo-900 shadow-sm ring-1 ring-indigo-200'
							: 'text-gray-700'}"
					>
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<span class="font-medium text-sm">{table.name}</span>
									{#if table.hasSoftDelete}
										<span
											class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
										>
											Soft Delete
										</span>
									{/if}
								</div>
								<p class="mt-0.5 text-xs text-gray-500">{table.rowCount} rows</p>
							</div>
							{#if selectedTable === table.name}
								<div class="h-2 w-2 rounded-full bg-indigo-600"></div>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
