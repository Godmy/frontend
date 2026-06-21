<script lang="ts">
  import type { Dictionary, DictionaryInput } from '$entities/dictionary';
  import type { Language } from '$entities/language';
  import type { Concept } from '$entities/concept';
  import { Modal } from '$shared/ui';

  type Props = {
    dictionary?: Dictionary;
    languages: Language[];
    concepts: Concept[];
    onSubmit: (data: DictionaryInput) => void;
    onCancel: () => void;
    isOpen: boolean;
  };

  let { dictionary, languages, concepts, onSubmit, onCancel, isOpen = $bindable() }: Props = $props();

  let formData = $state<DictionaryInput>({
    name: dictionary?.name || '',
    description: dictionary?.description || null,
    image: dictionary?.image || null,
    languageId: dictionary?.languageId || 0,
    conceptId: dictionary?.conceptId || 0
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    onSubmit(formData);
  }
</script>

<Modal {isOpen} onClose={onCancel} title={dictionary ? 'Edit Dictionary' : 'Add Dictionary'}>
  <form onsubmit={handleSubmit} class="space-y-4">
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
      <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        id="description"
        bind:value={formData.description}
        rows="3"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      ></textarea>
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
        {#each languages as language}
          <option value={language.id}>{language.name}</option>
        {/each}
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
        {#each concepts as concept}
          <option value={concept.id}>{concept.path}</option>
        {/each}
      </select>
    </div>
  </form>

  <svelte:fragment slot="footer">
    <button
      type="submit"
      onclick={handleSubmit}
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
  </svelte:fragment>
</Modal>
