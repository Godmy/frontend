<script lang="ts">
	import { graphql } from '$houdini';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import LanguageList from '$lib/components/languages/LanguageList.svelte';
	import LanguageForm from '$lib/components/languages/LanguageForm.svelte';
	import { errorHandler } from '$lib/errors';
	import { notificationStore } from '$lib/notifications';
	import { t } from '$lib/utils/i18n';
	import type { LanguageInput } from '$lib/api/languages';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Get translations from layout
	const trans = $derived($page.data.translations || {});

	// Debug logging
	$effect(() => {
		console.log('[Languages] Page data updated:', data);
		console.log('[Languages] Languages count:', data.GetLanguages?.languages?.length || 0);
		console.log('[Languages] Languages:', data.GetLanguages?.languages);
	});

	// Houdini Mutations
	const CreateLanguage = graphql(`
		mutation CreateLanguage($input: LanguageInput!) {
			createLanguage(input: $input) {
				id
				name
				code
			}
		}
	`);

	const UpdateLanguage = graphql(`
		mutation UpdateLanguage($languageId: Int!, $input: LanguageUpdateInput!) {
			updateLanguage(languageId: $languageId, input: $input) {
				id
				name
				code
			}
		}
	`);

	const DeleteLanguage = graphql(`
		mutation DeleteLanguage($languageId: Int!) {
			deleteLanguage(languageId: $languageId)
		}
	`);

	let showForm = $state(false);
	let editingLanguage = $state<any>(undefined);

	function handleEdit(language: any) {
		editingLanguage = language;
		showForm = true;
	}

	async function handleDelete(id: number) {
		if (confirm(t(trans, 'ui/languages/confirmDelete', 'Are you sure you want to delete this language?'))) {
			try {
				await DeleteLanguage.mutate({ languageId: id });
				notificationStore.success(t(trans, 'ui/languages/deleteSuccess', 'Language deleted successfully'));
				// Перезагрузить данные после мутации
				await invalidate('app:languages');
			} catch (error) {
				errorHandler.handle(error);
			}
		}
	}

	async function handleSubmit(formData: LanguageInput) {
		try {
			console.log('[Languages] Submitting form data:', formData);
			if (editingLanguage) {
				const result = await UpdateLanguage.mutate({
					languageId: editingLanguage.id,
					input: {
						name: formData.name,
						code: formData.code
					}
				});
				console.log('[Languages] Update result:', result);
				notificationStore.success(t(trans, 'ui/languages/updateSuccess', 'Language updated successfully'));
			} else {
				const result = await CreateLanguage.mutate({
					input: formData
				});
				console.log('[Languages] Create result:', result);
				notificationStore.success(t(trans, 'ui/languages/createSuccess', 'Language created successfully'));
			}
			showForm = false;
			editingLanguage = undefined;
			// Перезагрузить данные после мутации
			console.log('[Languages] Invalidating cache...');
			await invalidate('app:languages');
			console.log('[Languages] Cache invalidated, data should reload');
		} catch (error) {
			console.error('[Languages] Error:', error);
			errorHandler.handle(error);
		}
	}

	function handleCancel() {
		showForm = false;
		editingLanguage = undefined;
	}
</script>

<svelte:head>
	<title>{t(trans, 'ui/languages/title', 'Languages')} - Multipult</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="py-10">
		<header class="mb-8">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between items-center">
					<h1 class="text-3xl font-bold leading-tight text-gray-900">
						{t(trans, 'ui/languages/title', 'Languages')}
					</h1>
					<button
						onclick={() => { showForm = true; }}
						class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						{t(trans, 'ui/languages/create', 'Add Language')}
					</button>
				</div>
			</div>
		</header>

		<main>
			<div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
				<div class="px-4 sm:px-0">
					{#if data.GetLanguages}
						<LanguageList languages={data.GetLanguages.languages} onEdit={handleEdit} onDelete={handleDelete} />
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
	<LanguageForm language={editingLanguage} onSubmit={handleSubmit} onCancel={handleCancel} />
{/if}
