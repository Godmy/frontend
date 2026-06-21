<script lang="ts">
	import { ProtectedRoute, RequireRole } from '$lib/auth';
	import { graphql } from '$houdini';
	import type { PageData } from './$types';
	import { Shield } from 'lucide-svelte';
	import TableList from './components/TableList.svelte';
	import TableDataView from './components/TableDataView.svelte';
	import RecordModal from './components/RecordModal.svelte';
	import DeleteConfirmModal from './components/DeleteConfirmModal.svelte';

	let { data }: { data: PageData } = $props();

	// GraphQL stores
	const tablesStore = data.GetAdminTables;
	const createRecordMutation = graphql(`
		mutation CreateTableRecord($tableName: String!, $data: JSON!) {
			createTableRecord(tableName: $tableName, data: $data)
		}
	`);
	const updateRecordMutation = graphql(`
		mutation UpdateTableRecord($tableName: String!, $recordId: Int!, $data: JSON!) {
			updateTableRecord(tableName: $tableName, recordId: $recordId, data: $data)
		}
	`);
	const deleteRecordMutation = graphql(`
		mutation DeleteTableRecord($tableName: String!, $recordId: Int!) {
			deleteTableRecord(tableName: $tableName, recordId: $recordId)
		}
	`);

	// State
	let selectedTable = $state<string | null>(null);
	let currentPage = $state(0);
	let pageSize = $state(25);
	let tableDetailsStore = $state<any>(null);
	let isLoadingDetails = $state(false);

	// Modal state
	let isRecordModalOpen = $state(false);
	let recordModalMode = $state<'create' | 'edit'>('create');
	let editingRecord = $state<Record<string, any> | null>(null);
	let isDeleteModalOpen = $state(false);
	let deletingRecord = $state<Record<string, any> | null>(null);

	// Derived state
	const tables = $derived($tablesStore?.data?.allTables ?? []);
	const tableData = $derived($state.snapshot(tableDetailsStore?.data?.tableData ?? null));
	const tableSchema = $derived($state.snapshot(tableDetailsStore?.data?.tableSchema ?? null));
	const primaryKeyColumn = $derived(() => {
		return tableSchema?.columns?.find((col: any) => col.primaryKey)?.name || 'id';
	});

	// Load table details when table is selected or page changes
	$effect(() => {
		if (selectedTable) {
			loadTableDetails();
		}
	});

	async function loadTableDetails() {
		if (!selectedTable) return;

		isLoadingDetails = true;
		try {
			const offset = currentPage * pageSize;
			const { data: detailsData } = await graphql(`
				query GetTableDetails($tableName: String!, $limit: Int!, $offset: Int!) {
					tableSchema(tableName: $tableName) {
						tableName
						columns {
							name
							type
							nullable
							primaryKey
							default
						}
					}
					tableData(tableName: $tableName, limit: $limit, offset: $offset) {
						tableName
						columns
						rows
						total
						hasMore
					}
				}
			`).fetch({
				variables: {
					tableName: selectedTable,
					limit: pageSize,
					offset
				}
			});

			tableDetailsStore = { data: detailsData };
		} catch (error) {
			console.error('Error loading table details:', error);
		} finally {
			isLoadingDetails = false;
		}
	}

	function handleSelectTable(tableName: string) {
		selectedTable = tableName;
		currentPage = 0; // Reset to first page
	}

	function handlePageChange(page: number) {
		currentPage = page;
	}

	function handlePageSizeChange(size: number) {
		pageSize = size;
		currentPage = 0; // Reset to first page
	}

	function handleCreateRecord() {
		recordModalMode = 'create';
		editingRecord = null;
		isRecordModalOpen = true;
	}

	function handleEditRecord(record: Record<string, any>) {
		recordModalMode = 'edit';
		editingRecord = record;
		isRecordModalOpen = true;
	}

	function handleDeleteRecord(record: Record<string, any>) {
		deletingRecord = record;
		isDeleteModalOpen = true;
	}

	async function handleSaveRecord(formData: Record<string, any>) {
		if (!selectedTable) return;

		try {
			if (recordModalMode === 'create') {
				await createRecordMutation.mutate({
					tableName: selectedTable,
					data: formData
				});
			} else if (editingRecord) {
				const recordId = editingRecord[primaryKeyColumn];
				await updateRecordMutation.mutate({
					tableName: selectedTable,
					recordId: Number(recordId),
					data: formData
				});
			}

			// Reload table data
			await loadTableDetails();
		} catch (error) {
			console.error('Error saving record:', error);
			throw error; // Re-throw so modal can show error
		}
	}

	async function handleConfirmDelete() {
		if (!selectedTable || !deletingRecord) return;

		try {
			const recordId = deletingRecord[primaryKeyColumn];
			await deleteRecordMutation.mutate({
				tableName: selectedTable,
				recordId: Number(recordId)
			});

			// Reload table data
			await loadTableDetails();
		} catch (error) {
			console.error('Error deleting record:', error);
			throw error; // Re-throw so modal can show error
		}
	}
</script>

<svelte:head>
	<title>Admin Panel - Database Management</title>
</svelte:head>

<ProtectedRoute>
	<RequireRole role="admin">
		<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
			<!-- Header -->
			<header class="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
				<div class="mx-auto max-w-[1800px] px-6 py-6">
					<div class="flex items-center gap-4">
						<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/30">
							<Shield class="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 class="text-2xl font-bold text-gray-900">Database Administration</h1>
							<p class="text-sm text-gray-500">Manage all database tables and records</p>
						</div>
					</div>
				</div>
			</header>

			<!-- Main Content -->
			<main class="mx-auto max-w-[1800px] px-6 py-8">
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr] lg:gap-8 h-[calc(100vh-200px)]">
					<!-- Left Column: Table List -->
					<div class="h-full">
						<TableList
							{tables}
							{selectedTable}
							onSelectTable={handleSelectTable}
						/>
					</div>

					<!-- Right Column: Table Data View -->
					<div class="h-full">
						<TableDataView
							tableName={selectedTable}
							{tableData}
							{tableSchema}
							isLoading={isLoadingDetails}
							{currentPage}
							{pageSize}
							onPageChange={handlePageChange}
							onPageSizeChange={handlePageSizeChange}
							onCreateRecord={handleCreateRecord}
							onEditRecord={handleEditRecord}
							onDeleteRecord={handleDeleteRecord}
						/>
					</div>
				</div>
			</main>
		</div>

		<!-- Modals -->
		{#if tableSchema}
			<RecordModal
				isOpen={isRecordModalOpen}
				mode={recordModalMode}
				tableName={selectedTable ?? ''}
				columns={tableSchema.columns}
				initialData={editingRecord}
				onClose={() => (isRecordModalOpen = false)}
				onSave={handleSaveRecord}
			/>

			<DeleteConfirmModal
				isOpen={isDeleteModalOpen}
				tableName={selectedTable ?? ''}
				record={deletingRecord}
				primaryKeyColumn={primaryKeyColumn}
				onClose={() => (isDeleteModalOpen = false)}
				onConfirm={handleConfirmDelete}
			/>
		{/if}
	</RequireRole>
</ProtectedRoute>
