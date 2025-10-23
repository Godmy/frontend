<script lang="ts">
	import { graphql } from '$houdini';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import ConceptTree from '$lib/components/concepts/ConceptTree.svelte';
	import ConceptForm from '$lib/components/concepts/ConceptForm.svelte';
	import { errorHandler } from '$lib/errors';
	import { notificationStore } from '$lib/notifications';
	import { t } from '$lib/utils/i18n';
	import type { ConceptInput } from '$lib/api/concepts';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Get translations from layout
	const trans = $derived($page.data.translations || {});

	// Debug logging
	$effect(() => {
		console.log('Concepts page data:', data);
	});

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

	let showForm = $state(false);
	let editingConcept = $state<any>(undefined);

	function handleEdit(concept: any) {
		editingConcept = concept;
		showForm = true;
	}

	async function handleDelete(id: number) {
		if (confirm(t(trans, 'ui/concepts/confirmDelete', 'Are you sure you want to delete this concept?'))) {
			try {
				await DeleteConcept.mutate({ conceptId: id });
				notificationStore.success(t(trans, 'ui/concepts/deleteSuccess', 'Concept deleted successfully'));
				await invalidate('app:concepts');
			} catch (error) {
				errorHandler.handle(error);
			}
		}
	}

	async function handleMove(conceptId: number, newParentId: number | null) {
		try {
			// Найти концепцию для обновления depth
			const concept = data.GetConcepts?.concepts.find((c) => c.id === conceptId);
			if (!concept) return;

			// Вычислить новый depth
			let newDepth = 0;
			if (newParentId !== null) {
				const parent = data.GetConcepts?.concepts.find((c) => c.id === newParentId);
				if (parent) {
					newDepth = parent.depth + 1;
				}
			}

			await UpdateConcept.mutate({
				conceptId,
				input: {
					parentId: newParentId,
					depth: newDepth
				}
			});
			notificationStore.success(t(trans, 'ui/concepts/moveSuccess', 'Concept moved successfully'));
			await invalidate('app:concepts');
		} catch (error) {
			errorHandler.handle(error);
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
				notificationStore.success(t(trans, 'ui/concepts/updateSuccess', 'Concept updated successfully'));
			} else {
				await CreateConcept.mutate({
					input: formData
				});
				notificationStore.success(t(trans, 'ui/concepts/createSuccess', 'Concept created successfully'));
			}
			showForm = false;
			editingConcept = undefined;
			await invalidate('app:concepts');
		} catch (error) {
			errorHandler.handle(error);
		}
	}

	function handleCancel() {
		showForm = false;
		editingConcept = undefined;
	}
</script>

<svelte:head>
	<title>{t(trans, 'ui/concepts/title', 'Concepts')} - Multipult</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="py-10">
		<header class="mb-8">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between items-center">
					<h1 class="text-3xl font-bold leading-tight text-gray-900">
						{t(trans, 'ui/concepts/title', 'Concepts')}
					</h1>
					<button
						onclick={() => { showForm = true; }}
						class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						{t(trans, 'ui/concepts/create', 'Add Concept')}
					</button>
				</div>
			</div>
		</header>

		<main>
			<div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
				<div class="px-4 sm:px-0">
					{#if data.GetConcepts}
						<ConceptTree
							concepts={data.GetConcepts.concepts || []}
							onEdit={handleEdit}
							onDelete={handleDelete}
							onMove={handleMove}
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
	<ConceptForm concept={editingConcept} onSubmit={handleSubmit} onCancel={handleCancel} />
{/if}
