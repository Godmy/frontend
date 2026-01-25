<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  // Типы для пропсов
  type Props = {
    title: string;
    description?: string;
    collapsible?: boolean;
    initiallyCollapsed?: boolean;
    required?: boolean;
    border?: boolean;
    padding?: boolean;
  } & HTMLAttributes<HTMLElement>;

  let {
    title,
    description,
    collapsible,
    initiallyCollapsed,
    required,
    border,
    padding,
    class: className = '',
    ...restProps
  }: Props = $props();


  // Состояние свернутости
  let isCollapsed = $state(initiallyCollapsed || false);

  // Обработка переключения свернутости
  function toggleCollapsed() {
    if (collapsible) {
      isCollapsed = !isCollapsed;
    }
  }

  // Вычисляемые классы
  let sectionClasses = $derived(`
    form-section 
    ${border ? 'border border-gray-200 rounded-lg' : ''}
    ${padding ? 'p-6' : 'p-0'}
    ${className}
  `);

  // Определение, есть ли заголовок для отображения
  let showHeader = $derived(!!title || collapsible);
</script>

<section class={sectionClasses} {...restProps}>
  {#if showHeader}
    <header 
      class="section-header flex items-start justify-between pb-4 {collapsible ? 'cursor-pointer' : ''}"
      onclick={toggleCollapsed}
      role={collapsible ? 'button' : undefined}
      aria-expanded={collapsible ? !isCollapsed : undefined}
    >
      <div class="header-content flex items-start gap-3">
        <h2 class="text-lg font-medium text-gray-900 flex items-center">
          {title}
          {#if required}
            <span class="text-red-500 ml-1" aria-label="обязательная секция">*</span>
          {/if}
        </h2>
      </div>
      
      {#if collapsible}
        <button
          class="mt-1 flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 focus:outline-none"
          aria-label={isCollapsed ? `Развернуть секцию ${title}` : `Свернуть секцию ${title}`}
          onclick={(e) => {e.stopPropagation(); toggleCollapsed();}}
        >
          <svg
            class="w-4 h-4 transform transition-transform text-gray-500"
            class:rotate-180={isCollapsed}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      {/if}
    </header>
  {/if}

  {#if description}
    <p class="section-description text-sm text-gray-500 mb-4">
      {description}
    </p>
  {/if}

  {#if !isCollapsed || !collapsible}
    <div class="section-content">
      <slot />
    </div>
  {/if}
</section>

<style>
  .form-section {
    @apply w-full bg-white;
  }
  
  .section-header {
    @apply w-full;
  }
  
  .section-content {
    @apply w-full;
  }
  
  .section-description {
    @apply w-full;
  }
</style>
