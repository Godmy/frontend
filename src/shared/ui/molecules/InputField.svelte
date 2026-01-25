<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { Input } from '../atoms';

  type Props = {
    id: string;
    label: string;
    error?: string;
    required?: boolean;
  } & HTMLInputAttributes;

  let { id, label, error, required, class: className = '', ...rest } = $props();
</script>

<div class="mb-4">
  {#if label}
    <label for={id} class="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}

  <Input
    id={id}
    label={label}
    {...rest}
    class={`w-full {error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} ${className}`}
  />

  {#if error}
    <p class="mt-1 text-sm text-red-600">{error}</p>
  {/if}
</div>
