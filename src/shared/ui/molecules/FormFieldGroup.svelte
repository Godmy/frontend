<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

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
  } & HTMLAttributes<HTMLDivElement>;

  let {
    label,
    description,
    required,
    error,
    hint,
    disabled,
    orientation = 'vertical',
    class: className = '',
    ...restProps
  }: Props = $props();


  // Вычисляемые классы
  let containerClasses = $derived(`field-group ${orientation === 'horizontal' ? 'flex items-start gap-3' : 'flex flex-col gap-2'} ${disabled ? 'opacity-70 cursor-not-allowed' : ''} ${className}`);
  
  // Определяем, есть ли ошибка
  let hasError = $derived(!!error);
</script>

<div class={containerClasses} {...restProps}>
  {#if label}
    <label class="field-label text-sm font-medium text-gray-700 flex items-center gap-1">
      {label}
      {#if required}
        <span class="text-red-500" aria-label="обязательное поле">*</span>
      {/if}
    </label>
  {/if}
  
  <div class="field-content flex-1">
    <slot />
    
    {#if description}
      <p class="mt-1 text-sm text-gray-500">
        {description}
      </p>
    {/if}
    
    {#if hasError}
      <p class="mt-1 text-sm text-red-600" aria-live="polite">
        {error}
      </p>
    {/if}
    
    {#if hint && !hasError}
      <p class="mt-1 text-sm text-gray-500">
        {hint}
      </p>
    {/if}
  </div>
</div>

<style>
  .field-group {
    @apply w-full;
  }
  
  .field-label {
    @apply min-w-[120px];
  }
  
  .field-content {
    @apply w-full;
  }
  
  .field-group.horizontal .field-label {
    @apply pt-2;
  }
  
  .field-group.vertical .field-label {
    @apply pb-1;
  }
</style>

