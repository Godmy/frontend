<script lang="ts">
  import type { Language, LanguageInput } from '$entities/language';
  import { Modal } from '$shared/ui';

  type Props = {
    language?: Language;
    onSubmit: (data: LanguageInput) => void;
    onCancel: () => void;
    isOpen: boolean;
  };

  let { language, onSubmit, onCancel, isOpen = $bindable() }: Props = $props();

  let formData = $state<LanguageInput>({
    name: language?.name || '',
    code: language?.code || '',
    nativeName: language?.nativeName || '',
    direction: language?.direction || 'ltr'
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    onSubmit(formData);
  }
</script>

<Modal {isOpen} onClose={onCancel} title={language ? 'Edit Language' : 'Add Language'}>
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
      <label for="code" class="block text-sm font-medium text-gray-700">Code</label>
      <input
        type="text"
        id="code"
        bind:value={formData.code}
        required
        maxlength="3"
        placeholder="e.g., en, ru"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>

    <div>
      <label for="nativeName" class="block text-sm font-medium text-gray-700">Native Name</label>
      <input
        type="text"
        id="nativeName"
        bind:value={formData.nativeName}
        required
        placeholder="e.g., English, Русский"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>

    <div>
      <label for="direction" class="block text-sm font-medium text-gray-700">Text Direction</label>
      <select
        id="direction"
        bind:value={formData.direction}
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="ltr">Left to Right</option>
        <option value="rtl">Right to Left</option>
      </select>
    </div>
  </form>

  <svelte:fragment slot="footer">
    <button
      type="submit"
      onclick={handleSubmit}
      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
    >
      {language ? 'Update' : 'Create'}
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
