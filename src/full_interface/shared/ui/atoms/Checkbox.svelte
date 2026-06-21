<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  type Props = {
    id: string;
    label: string;
    description?: string;
    checked?: boolean;
    errors?: string[];
    required?: boolean;
    disabled?: boolean;
  } & HTMLInputAttributes;

  let {
    id,
    label,
    description,
    checked = $bindable(false),
    errors = [],
    required = false,
    disabled = false,
    ...restProps
  }: Props = $props();

  let hasError = $derived(errors.length > 0);
  let errorId = $derived(`${id}-error`);
</script>

<div class="mb-4">
  <div class="flex items-start">
    <div class="flex items-center h-5">
      <input
        id={id}
        type="checkbox"
        bind:checked={checked}
        class="
          h-4 w-4 text-indigo-600 border-gray-300 rounded
          {disabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-indigo-500'}
        "
        disabled={disabled}
        required={required}
        aria-describedby={hasError ? errorId : undefined}
        {...restProps}
      />
    </div>
    <div class="ml-3 text-sm">
      <label for={id} class="font-medium text-gray-700">
        {label}
        {#if required}
          <span class="text-red-500">*</span>
        {/if}
      </label>
      {#if description}
        <p class="text-gray-500">{description}</p>
      {/if}
    </div>
  </div>
  
  {#if hasError}
    <p id={errorId} class="mt-1 text-sm text-red-600">
      {#each errors as error, i}
        {error}{i < errors.length - 1 ? ' ' : ''}
      {/each}
    </p>
  {/if}
</div>