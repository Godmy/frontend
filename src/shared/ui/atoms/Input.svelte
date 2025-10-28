<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  export type InputProps = {
    id: string;
    label: string;
    type?: string;
    value?: string;
    errors?: string[];
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
  } & HTMLInputAttributes;

  let {
    id,
    label,
    type = 'text',
    value = $bindable(),
    errors = [],
    required = false,
    disabled = false,
    placeholder,
    min,
    max,
    step,
    class: className = '',
    ...restProps
  }: InputProps = $props();

  let hasError = $derived(errors.length > 0);
  let errorId = $derived(`${id}-error`);
</script>

<div class="mb-4 {className}">
  <label 
    for={id} 
    class="block text-sm font-medium text-gray-700 mb-1"
  >
    {label}
    {#if required}
      <span class="text-red-500">*</span>
    {/if}
  </label>
  
  <input
    id={id}
    type={type}
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
    min={min}
    max={max}
    step={step}
    aria-describedby={hasError ? errorId : undefined}
    {...restProps}
  />
  
  {#if hasError}
    <p id={errorId} class="mt-1 text-sm text-red-600">
      {#each errors as error, i}
        {error}{i < errors.length - 1 ? ' ' : ''}
      {/each}
    </p>
  {/if}
</div>