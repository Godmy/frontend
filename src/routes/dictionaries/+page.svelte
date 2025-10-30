<script lang="ts">
	import { graphql } from '$houdini';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { DictionaryList, DictionaryForm } from '$features/dictionary-management';
	import { errorHandler } from '$lib/errors';
	import { notificationStore } from '$lib/notifications';
	import { t } from '$lib/utils/i18n';
	import type { DictionaryInput } from '$lib/api/dictionaries';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const dictionariesStore = data.GetDictionariesData;
	const dictionariesData = $derived($dictionariesStore?.data ?? {});

	// Get translations from layout
	const trans = $derived($page.data.translations || {});

	// Houdini Mutations
	const CreateDictionary = graphql(`
		mutation CreateDictionary($input: DictionaryInput!) {
			createDictionary(input: $input) {
				id
				name
				description
				image
				languageId
				conceptId
			}
		}
	`);

	const UpdateDictionary = graphql(`
		mutation UpdateDictionary($dictionaryId: Int!, $input: DictionaryUpdateInput!) {
			updateDictionary(dictionaryId: $dictionaryId, input: $input) {
				id
				name
				description
				image
				languageId
				conceptId
			}
		}
	`);

	const DeleteDictionary = graphql(`
		mutation DeleteDictionary($dictionaryId: Int!) {
			deleteDictionary(dictionaryId: $dictionaryId)
		}
	`);

	let showForm = $state(false);
	let editingDictionary = $state<any>(undefined);

	function handleEdit(dictionary: any) {
		editingDictionary = dictionary;
		showForm = true;
	}

	async function handleDelete(id: number) {
		if (confirm(t(trans, 'ui/dictionaries/confirmDelete', 'Are you sure you want to delete this dictionary?'))) {
			try {
				await DeleteDictionary.mutate({ dictionaryId: id });
				notificationStore.success(t(trans, 'ui/dictionaries/deleteSuccess', 'Dictionary deleted successfully'));
				await invalidate('app:dictionaries');
			} catch (error) {
				errorHandler.handle(error);
			}
		}
	}

	async function handleSubmit(formData: DictionaryInput) {
		try {
			if (editingDictionary) {
				await UpdateDictionary.mutate({
					dictionaryId: editingDictionary.id,
					input: {
						name: formData.name || null,
						description: formData.description || null,
						image: formData.image || null,
						languageId: formData.languageId,
						conceptId: formData.conceptId
					}
				});
				notificationStore.success(t(trans, 'ui/dictionaries/updateSuccess', 'Dictionary updated successfully'));
			} else {
				await CreateDictionary.mutate({
					input: {
						name: formData.name,
						description: formData.description || null,
						image: formData.image || null,
						languageId: formData.languageId,
						conceptId: formData.conceptId
					}
				});
				notificationStore.success(t(trans, 'ui/dictionaries/createSuccess', 'Dictionary created successfully'));
			}
			showForm = false;
			editingDictionary = undefined;
			await invalidate('app:dictionaries');
		} catch (error) {
			errorHandler.handle(error);
		}
	}

	function handleCancel() {
		showForm = false;
		editingDictionary = undefined;
	}
</script>

<svelte:head>
	<title>{t(trans, 'ui/dictionaries/title', 'Dictionaries')} - Multipult</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="py-10">
		<header class="mb-8">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between items-center">
					<h1 class="text-3xl font-bold leading-tight text-gray-900">
						{t(trans, 'ui/dictionaries/title', 'Dictionaries')}
					</h1>
					<button
						onclick={() => { showForm = true; }}
						class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						{t(trans, 'ui/dictionaries/create', 'Add Dictionary')}
					</button>
				</div>
			</div>
		</header>

		<main>
			<div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
				<div class="px-4 sm:px-0">
					{#if $dictionariesStore?.data}
						<DictionaryList
							dictionaries={$dictionariesData.dictionaries}
							languages={$dictionariesData.languages}
							concepts={$dictionariesData.concepts}
							onEdit={handleEdit}
							onDelete={handleDelete}
						/>
					{:else}
						<div class="flex justify-center py-12">
							<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
						</div>
					{/if}
				</div>
			</div>
		</main>
	</div>
</div>

{#if showForm}
	<DictionaryForm
		dictionary={editingDictionary}
		languages={$dictionariesStore?.data?.languages || []}
		concepts={$dictionariesStore?.data?.concepts || []}
		onSubmit={handleSubmit}
		onCancel={handleCancel}
	/>
{/if}

