<script lang="ts">
	import type { Language } from '$lib/api/languages';

	type Props = {
		languages: Language[];
		onEdit: (language: Language) => void;
		onDelete: (id: number) => void;
	};

	let { languages, onEdit, onDelete }: Props = $props();
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-md">
	<ul class="divide-y divide-gray-200">
		{#if languages && languages.length > 0}
			{#each languages as language}
				<li class="px-6 py-4 hover:bg-gray-50">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="text-lg font-medium text-gray-900">{language.name}</h3>
							<p class="text-sm text-gray-500">Code: {language.code}</p>
						</div>
						<div class="flex space-x-2">
							<button
								onclick={() => onEdit(language)}
								class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Edit
							</button>
							<button
								onclick={() => onDelete(language.id)}
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
				No languages found. Click "Add Language" to create one.
			</li>
		{/if}
	</ul>
</div>
