<script lang="ts">
	import type { Dictionary, DictionaryInput } from '$lib/api/dictionaries';
	import type { Language } from '$lib/api/languages';
	import type { Concept } from '$lib/api/concepts';

	type Props = {
		dictionary?: Dictionary;
		languages: Language[];
		concepts: Concept[];
		onSubmit: (data: DictionaryInput) => void;
		onCancel: () => void;
	};

	let { dictionary, languages, concepts, onSubmit, onCancel }: Props = $props();

	let formData = $state<DictionaryInput>({
		name: dictionary?.name || '',
		description: dictionary?.description || '',
		image: dictionary?.image || '',
		languageId: dictionary?.languageId || 0,
		conceptId: dictionary?.conceptId || 0
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		onSubmit(formData);
	}
</script>

<div class="fixed z-50 inset-0 overflow-y-auto">
	<div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
		<button
			type="button"
			class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity cursor-default z-40"
			onclick={onCancel}
			aria-label="Close modal"
		></button>

		<!-- Spacer element to trick the browser into centering the modal contents. -->
		<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

		<div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50">
			<form onsubmit={handleSubmit}>
				<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
						{dictionary ? 'Edit Dictionary' : 'Add Dictionary'}
					</h3>
					<div class="space-y-4">
						<div>
							<label for="name" class="block text-sm font-medium text-gray-700">Name</label>
							<input
								type="text"
								id="name"
								bind:value={formData.name}
								required
								class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<div>
							<label for="description" class="block text-sm font-medium text-gray-700">Description (optional)</label>
							<textarea
								id="description"
								bind:value={formData.description}
								rows="3"
								class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							></textarea>
						</div>
						<div>
							<label for="image" class="block text-sm font-medium text-gray-700">Image URL (optional)</label>
							<input
								type="text"
								id="image"
								bind:value={formData.image}
								class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<div>
							<label for="languageId" class="block text-sm font-medium text-gray-700">Language</label>
							<select
								id="languageId"
								bind:value={formData.languageId}
								required
								class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							>
								<option value={0}>Select a language</option>
								{#if languages}
									{#each languages as language}
										<option value={language.id}>{language.name} ({language.code})</option>
									{/each}
								{/if}
							</select>
						</div>
						<div>
							<label for="conceptId" class="block text-sm font-medium text-gray-700">Concept</label>
							<select
								id="conceptId"
								bind:value={formData.conceptId}
								required
								class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							>
								<option value={0}>Select a concept</option>
								{#if concepts}
									{#each concepts as concept}
										<option value={concept.id}>{concept.path}</option>
									{/each}
								{/if}
							</select>
						</div>
					</div>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
					<button
						type="submit"
						class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
					>
						{dictionary ? 'Update' : 'Create'}
					</button>
					<button
						type="button"
						onclick={onCancel}
						class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
