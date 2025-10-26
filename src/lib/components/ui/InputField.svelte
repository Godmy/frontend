<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import Input from './Input.svelte';

  type Props = {
    label?: string;
    error?: string;
    required?: boolean;
  } & HTMLInputAttributes;
  
  let { label, error, required, ...rest } = $props();
</script>

<div class="mb-4">
  {#if label}
    <label for={rest.id} class="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}
  
  <Input 
    {...rest} 
    class={`w-full {error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} ${(rest.class as string) || ''}`} 
  />
  
  {#if error}
    <p class="mt-1 text-sm text-red-600">{error}</p>
  {/if}
</div>