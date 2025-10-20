<script lang="ts">
	import type { Concept, ConceptInput } from '$lib/api/concepts';

	type Props = {
		concept?: Concept;
		onSubmit: (data: ConceptInput) => void;
		onCancel: () => void;
	};

	let { concept, onSubmit, onCancel }: Props = $props();

	let formData = $state<ConceptInput>({
		path: concept?.path || '',
		depth: concept?.depth || 0,
		parentId: concept?.parentId || null
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
						{concept ? 'Edit Concept' : 'Add Concept'}
					</h3>
					<div class="space-y-4">
						<div>
							<label for="path" class="block text-sm font-medium text-gray-700">Path</label>
							<input
								type="text"
								id="path"
								bind:value={formData.path}
								required
								class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<div>
							<label for="depth" class="block text-sm font-medium text-gray-700">Depth</label>
							<input
								type="number"
								id="depth"
								bind:value={formData.depth}
								required
								class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<div>
							<label for="parentId" class="block text-sm font-medium text-gray-700">Parent ID (optional)</label>
							<input
								type="number"
								id="parentId"
								bind:value={formData.parentId}
								class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
					</div>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
					<button
						type="submit"
						class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
					>
						{concept ? 'Update' : 'Create'}
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
