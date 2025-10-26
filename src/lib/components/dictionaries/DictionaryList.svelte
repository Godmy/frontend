<script lang="ts">
	import type { Dictionary } from '$lib/api/dictionaries';
	import type { Language } from '$lib/api/languages';
	import type { Concept } from '$lib/api/concepts';

	type Props = {
		dictionaries: Dictionary[];
		languages: Language[];
		concepts: Concept[];
		onEdit: (dictionary: Dictionary) => void;
		onDelete: (id: number) => void;
	};

	let { dictionaries, languages, concepts, onEdit, onDelete }: Props = $props();

	// Create Maps for O(1) lookups (derived automatically updates when data changes)
	const languagesMap = $derived(new Map(languages?.map((l) => [l.id, l]) || []));

	const conceptsMap = $derived(new Map(concepts?.map((c) => [c.id, c]) || []));

	function getLanguageName(languageId: number) {
		const language = languagesMap.get(languageId);
		return language ? language.name : `Language #${languageId}`;
	}

	function getConceptPath(conceptId: number) {
		const concept = conceptsMap.get(conceptId);
		return concept ? concept.path : `Concept #${conceptId}`;
	}
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-md">
	<ul class="divide-y divide-gray-200">
		{#if dictionaries && dictionaries.length > 0}
			{#each dictionaries as dictionary}
				<li class="px-6 py-4 hover:bg-gray-50">
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<div class="flex items-center space-x-4">
								{#if dictionary.image}
									<img src={dictionary.image} alt={dictionary.name} class="h-12 w-12 rounded-md object-cover" />
								{/if}
								<div>
									<h3 class="text-lg font-medium text-gray-900">{dictionary.name}</h3>
									{#if dictionary.description}
										<p class="text-sm text-gray-600 mt-1">{dictionary.description}</p>
									{/if}
									<div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
										<span>Language: {getLanguageName(dictionary.languageId)}</span>
										<span>Concept: {getConceptPath(dictionary.conceptId)}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="flex space-x-2 ml-4">
							<button
								onclick={() => onEdit(dictionary)}
								class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Edit
							</button>
							<button
								onclick={() => onDelete(dictionary.id)}
								class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
							>
								Delete
							</button>
						</div>
					</div>
				</li>
			{/each}
		{:else}
			<li class="px-6 py-12 text-center text-gray-500">
				No dictionaries found. Click "Add Dictionary" to create one.
			</li>
		{/if}
	</ul>
</div>
