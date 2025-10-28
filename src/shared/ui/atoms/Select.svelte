<script lang="ts">
  import type { HTMLSelectElementAttributes } from 'svelte/elements';

  type Option = {
    value: string;
    label: string;
  };

  type Props = {
    id: string;
    label: string;
    value?: string;
    options: Option[];
    errors?: string[];
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
  } & HTMLSelectElementAttributes;

  let {
    id,
    label,
    value = $bindable(),
    options,
    errors = [],
    required = false,
    disabled = false,
    placeholder,
    ...restProps
  }: Props = $props();

  let hasError = $derived(errors.length > 0);
  let errorId = $derived(`${id}-error`);
</script>

<div class="mb-4">
  <label 
    for={id} 
    class="block text-sm font-medium text-gray-700 mb-1"
  >
    {label}
    {#if required}
      <span class="text-red-500">*</span>
    {/if}
  </label>
  
  <select
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
    required={required}
    aria-describedby={hasError ? errorId : undefined}
    {...restProps}
  >
    {#if placeholder}
      <option value="">{placeholder}</option>
    {/if}
    {#each options as option}
      <option value={option.value}>
        {option.label}
      </option>
    {/each}
  </select>
  
  {#if hasError}
    <p id={errorId} class="mt-1 text-sm text-red-600">
      {#each errors as error, i}
        {error}{i < errors.length - 1 ? ' ' : ''}
      {/each}
    </p>
  {/if}
</div>