<script lang="ts">
	import { graphql } from '$houdini';
	import { invalidate } from '$app/navigation';
	import Navigation from '$lib/components/Navigation.svelte';
	import LanguageList from '$lib/components/languages/LanguageList.svelte';
	import LanguageForm from '$lib/components/languages/LanguageForm.svelte';
	import { errorHandler } from '$lib/errors';
	import { notificationStore } from '$lib/notifications';
	import type { LanguageInput } from '$lib/api/languages';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

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
		if (confirm('Are you sure you want to delete this language?')) {
			try {
				await DeleteLanguage.mutate({ languageId: id });
				notificationStore.success('Language deleted successfully');
				// Перезагрузить данные после мутации
				await invalidate('app:languages');
			} catch (error) {
				errorHandler.handle(error);
			}
		}
	}

	async function handleSubmit(formData: LanguageInput) {
		try {
			if (editingLanguage) {
				await UpdateLanguage.mutate({
					languageId: editingLanguage.id,
					input: {
						name: formData.name,
						code: formData.code
					}
				});
				notificationStore.success('Language updated successfully');
			} else {
				await CreateLanguage.mutate({
					input: formData
				});
				notificationStore.success('Language created successfully');
			}
			showForm = false;
			editingLanguage = undefined;
			// Перезагрузить данные после мутации
			await invalidate('app:languages');
		} catch (error) {
			errorHandler.handle(error);
		}
	}

	function handleCancel() {
		showForm = false;
		editingLanguage = undefined;
	}
</script>

<div class="min-h-screen bg-gray-50">
	<Navigation />

	<div class="py-10">
		<header class="mb-8">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between items-center">
					<h1 class="text-3xl font-bold leading-tight text-gray-900">Languages</h1>
					<button
						onclick={() => { showForm = true; }}
						class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Add Language
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
