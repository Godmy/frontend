<script lang="ts">
	import { graphql } from '$houdini';
	import Navigation from '$lib/components/Navigation.svelte';
	import ConceptList from '$lib/components/concepts/ConceptList.svelte';
	import ConceptForm from '$lib/components/concepts/ConceptForm.svelte';
	import { errorHandler } from '$lib/errors';
	import { notificationStore } from '$lib/notifications';
	import type { ConceptInput } from '$lib/api/concepts';

	// Houdini Query - автоматическое кеширование
	const GetConcepts = graphql(`
		query GetConcepts {
			concepts @list(name: "Concepts_Page") {
				id
				path
				depth
				parentId
			}
		}
	`);

	// Houdini Mutations
	const CreateConcept = graphql(`
		mutation CreateConcept($input: ConceptInput!) {
			createConcept(input: $input) {
				id
				path
				depth
				parentId
			}
		}
	`);

	const UpdateConcept = graphql(`
		mutation UpdateConcept($conceptId: Int!, $input: ConceptUpdateInput!) {
			updateConcept(conceptId: $conceptId, input: $input) {
				id
				path
				depth
				parentId
			}
		}
	`);

	const DeleteConcept = graphql(`
		mutation DeleteConcept($conceptId: Int!) {
			deleteConcept(conceptId: $conceptId)
		}
	`);

	// Загрузка данных
	const { data } = GetConcepts.fetch();

	let showForm = $state(false);
	let editingConcept = $state<any>(undefined);

	function handleEdit(concept: any) {
		editingConcept = concept;
		showForm = true;
	}

	async function handleDelete(id: number) {
		if (confirm('Are you sure you want to delete this concept?')) {
			try {
				await DeleteConcept.mutate({ conceptId: id });
				notificationStore.success('Concept deleted successfully');
			} catch (error) {
				errorHandler.handle(error);
			}
		}
	}

	async function handleSubmit(formData: ConceptInput) {
		try {
			if (editingConcept) {
				await UpdateConcept.mutate({
					conceptId: editingConcept.id,
					input: {
						path: formData.path || null,
						depth: formData.depth,
						parentId: formData.parentId
					}
				});
				notificationStore.success('Concept updated successfully');
			} else {
				await CreateConcept.mutate({
					input: formData
				});
				notificationStore.success('Concept created successfully');
			}
			showForm = false;
			editingConcept = undefined;
		} catch (error) {
			errorHandler.handle(error);
		}
	}

	function handleCancel() {
		showForm = false;
		editingConcept = undefined;
	}
</script>

<div class="min-h-screen bg-gray-50">
	<Navigation />

	<div class="py-10">
		<header class="mb-8">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between items-center">
					<h1 class="text-3xl font-bold leading-tight text-gray-900">Concepts</h1>
					<button
						onclick={() => { showForm = true; }}
						class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Add Concept
					</button>
				</div>
			</div>
		</header>

		<main>
			<div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
				<div class="px-4 sm:px-0">
					{#if $data}
						<ConceptList concepts={$data.concepts} onEdit={handleEdit} onDelete={handleDelete} />
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
	<ConceptForm concept={editingConcept} onSubmit={handleSubmit} onCancel={handleCancel} />
{/if}
