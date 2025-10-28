<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  type Props = {
    id: string;
    label: string;
    value?: string;
    errors?: string[];
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    rows?: number;
    maxlength?: number;
  } & HTMLTextareaAttributes;

  let {
    id,
    label,
    value = $bindable(),
    errors = [],
    required = false,
    disabled = false,
    placeholder,
    rows = 3,
    maxlength,
    ...restProps
  }: Props = $props();

  let hasError = $derived(errors.length > 0);
  let errorId = $derived(`${id}-error`);
  let length = $derived(value?.length || 0);
  let showCounter = $derived(maxlength !== undefined);
</script>

<div class="mb-4">
  <div class="flex justify-between">
    <label 
      for={id} 
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
    
    {#if showCounter}
      <span class="text-sm text-gray-500">
        {length}/{maxlength}
      </span>
    {/if}
  </div>
  
  <textarea
    id={id}
    bind:value={value}
    class="
      w-full px-3 py-2 border rounded-md shadow-sm
      {hasError 
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}
      {disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    "
    disabled={disabled}
    placeholder={placeholder}
    required={required}
    rows={rows}
    maxlength={maxlength}
    aria-describedby={hasError ? errorId : undefined}
    {...restProps}
  ></textarea>
  
  {#if hasError}
    <p id={errorId} class="mt-1 text-sm text-red-600">
      {#each errors as error, i}
        {error}{i < errors.length - 1 ? ' ' : ''}
      {/each}
    </p>
  {/if}
</div>