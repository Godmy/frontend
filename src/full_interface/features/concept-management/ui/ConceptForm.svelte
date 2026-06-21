<script lang="ts">
  import type { Concept, ConceptInput } from '$entities/concept';
  import { conceptSchema } from '$lib/schemas/concept.schema';
  import { createFormStore } from '$lib/utils/form';
  import { Modal } from '$shared/ui';
  import { Input } from '$shared/ui';

  type Props = {
    concept?: Concept;
    onSubmit: (data: ConceptInput) => void;
    onCancel: () => void;
    isOpen: boolean;
  };

  let { concept, onSubmit, onCancel, isOpen = $bindable() }: Props = $props();

  const form = createFormStore(conceptSchema, {
    path: concept?.path || '',
    depth: concept?.depth || 0,
    parentId: concept?.parentId || null
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const success = await form.handleSubmit((data) => {
      onSubmit(data);
    });
    if (success) {
      form.reset();
    }
  }
</script>

<Modal {isOpen} onClose={onCancel} title={concept ? 'Edit Concept' : 'Add Concept'}>
  <form onsubmit={handleSubmit} class="space-y-4">
    <Input
      id="path"
      label="Path"
      type="text"
      bind:value={form.data.path}
      onchange={(value) => form.setField('path', value)}
      onblur={() => form.touchField('path')}
      errors={form.errors.path}
      required
      placeholder="e.g., concepts.programming.javascript"
    />

    <Input
      id="depth"
      label="Depth"
      type="number"
      bind:value={form.data.depth}
      onchange={(value) => form.setField('depth', value)}
      onblur={() => form.touchField('depth')}
      errors={form.errors.depth}
      required
      min={0}
      max={10}
    />

    <Input
      id="parentId"
      label="Parent ID"
      type="number"
      bind:value={form.data.parentId}
      onchange={(value) => form.setField('parentId', value)}
      onblur={() => form.touchField('parentId')}
      errors={form.errors.parentId}
      placeholder="Optional parent concept ID"
    />
  </form>

  <svelte:fragment slot="footer">
    <button
      type="submit"
      onclick={handleSubmit}
      disabled={form.isSubmitting || !form.isValid}
      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {#if form.isSubmitting}
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      {/if}
      {concept ? 'Update' : 'Create'}
    </button>
    <button
      type="button"
      onclick={onCancel}
      disabled={form.isSubmitting}
      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Cancel
    </button>
  </svelte:fragment>
</Modal>
