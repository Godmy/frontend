<script lang="ts">
	import { useAuth } from '$lib/auth';
	import { graphql } from '$houdini';
	import AuthGuard from '$stylist/user/component/organism/auth-guard/index.svelte';
	import type { PageData } from './$types';
	import { Shield } from 'lucide-svelte';
	import TableList from './components/TableList.svelte';
	import TableDataView from './components/TableDataView.svelte';
	import RecordModal from './components/RecordModal.svelte';
	import DeleteConfirmModal from './components/DeleteConfirmModal.svelte';

	const auth = useAuth();

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

<AuthGuard
	isAuthenticated={auth.isAuthenticated}
	userRoles={auth.roles.map((r) => r.name)}
	requiredRole="admin"
	redirectUrl="/login"
>
	<div class="c-admin">
		<header class="c-admin__header">
			<div class="c-admin__header-inner">
				<div class="c-admin__header-icon">
					<Shield size={24} />
				</div>
				<div>
					<h1 class="c-admin__header-title">Database Administration</h1>
					<p class="c-admin__header-sub">Manage all database tables and records</p>
				</div>
			</div>
		</header>

		<main class="c-admin__main">
			<div class="c-admin__grid">
				<div class="c-admin__sidebar">
					<TableList
						{tables}
						{selectedTable}
						onSelectTable={handleSelectTable}
					/>
				</div>
				<div class="c-admin__content">
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
</AuthGuard>

<style>
	.c-admin {
		min-height: 100vh;
		background: var(--color-background-secondary, #f9fafb);
	}
	.c-admin__header {
		background: var(--color-background-primary, #fff);
		border-bottom: 1px solid var(--color-border-primary, #e5e7eb);
		backdrop-filter: blur(8px);
	}
	.c-admin__header-inner {
		display: flex;
		align-items: center;
		gap: 1rem;
		max-width: 112rem;
		margin: 0 auto;
		padding: 1.25rem 1.5rem;
	}
	.c-admin__header-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: var(--radius-lg, 0.75rem);
		background: var(--color-primary-600, #4f46e5);
		color: #fff;
		flex-shrink: 0;
		box-shadow: 0 4px 12px rgb(79 70 229 / 0.3);
	}
	.c-admin__header-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text-primary, #111827);
		margin: 0;
	}
	.c-admin__header-sub {
		font-size: 0.875rem;
		color: var(--color-text-secondary, #6b7280);
		margin: 0;
	}
	.c-admin__main {
		max-width: 112rem;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}
	.c-admin__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		height: calc(100vh - 200px);
	}
	@media (min-width: 1024px) {
		.c-admin__grid {
			grid-template-columns: 380px 1fr;
			gap: 2rem;
		}
	}
	.c-admin__sidebar,
	.c-admin__content {
		height: 100%;
		min-height: 0;
	}
</style>
