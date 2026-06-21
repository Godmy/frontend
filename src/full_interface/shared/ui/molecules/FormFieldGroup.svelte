<script lang="ts">
  import type { HTMLDivAttributes } from 'svelte/elements';

  // Типы для пропсов
  type Props = {
    label?: string;
    description?: string;
    required?: boolean;
    error?: string;
    hint?: string;
    disabled?: boolean;
    orientation?: 'horizontal' | 'vertical';
    class?: string;
  } & HTMLDivAttributes;

  let props: Props = $props();

  // Вычисляемые классы
  let containerClasses = $derived(`field-group ${props.orientation === 'horizontal' ? 'flex items-start gap-3' : 'flex flex-col gap-2'} ${props.disabled ? 'opacity-70 cursor-not-allowed' : ''} ${props.class || ''}`);
  
  // Определяем, есть ли ошибка
  let hasError = $derived(!!props.error);
</script>

<div class={containerClasses} {...$restProps}>
  {#if props.label}
    <label class="field-label text-sm font-medium text-gray-700 flex items-center gap-1">
      {props.label}
      {#if props.required}
        <span class="text-red-500" aria-label="обязательное поле">*</span>
      {/if}
    </label>
  {/if}
  
  <div class="field-content flex-1">
    <slot />
    
    {#if props.description}
      <p class="mt-1 text-sm text-gray-500">
        {props.description}
      </p>
    {/if}
    
    {#if hasError}
      <p class="mt-1 text-sm text-red-600" aria-live="polite">
        {props.error}
      </p>
    {/if}
    
    {#if props.hint && !hasError}
      <p class="mt-1 text-sm text-gray-500">
        {props.hint}
      </p>
    {/if}
  </div>
</div>

<style>
  .field-group {
    width: 100%;
  }

  .field-label {
    min-width: 120px;
  }

  .field-content {
    width: 100%;
  }

  .field-group.horizontal .field-label {
    padding-top: 0.5rem;
  }

  .field-group.vertical .field-label {
    padding-bottom: 0.25rem;
  }
</style>