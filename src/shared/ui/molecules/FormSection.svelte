<script lang="ts">
  import type { HTMLDivAttributes } from 'svelte/elements';

  // Типы для пропсов
  type Props = {
    title: string;
    description?: string;
    collapsible?: boolean;
    initiallyCollapsed?: boolean;
    required?: boolean;
    border?: boolean;
    padding?: boolean;
  } & HTMLDivAttributes;

  let props: Props = $props();

  // Состояние свернутости
  let isCollapsed = $state(props.initiallyCollapsed || false);

  // Обработка переключения свернутости
  function toggleCollapsed() {
    if (props.collapsible) {
      isCollapsed = !isCollapsed;
    }
  }

  // Вычисляемые классы
  let sectionClasses = $derived(`
    form-section 
    ${props.border ? 'border border-gray-200 rounded-lg' : ''}
    ${props.padding ? 'p-6' : 'p-0'}
    ${props.class || ''}
  `);

  // Определение, есть ли заголовок для отображения
  let showHeader = $derived(!!props.title || props.collapsible);
</script>

<section class={sectionClasses} {...$restProps}>
  {#if showHeader}
    <header 
      class="section-header flex items-start justify-between pb-4 {props.collapsible ? 'cursor-pointer' : ''}"
      on:click={toggleCollapsed}
      role={props.collapsible ? 'button' : undefined}
      aria-expanded={props.collapsible ? !isCollapsed : undefined}
    >
      <div class="header-content flex items-start gap-3">
        <h2 class="text-lg font-medium text-gray-900 flex items-center">
          {props.title}
          {#if props.required}
            <span class="text-red-500 ml-1" aria-label="обязательная секция">*</span>
          {/if}
        </h2>
      </div>
      
      {#if props.collapsible}
        <button 
          class="mt-1 flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 focus:outline-none"
          aria-label={isCollapsed ? `Развернуть секцию ${props.title}` : `Свернуть секцию ${props.title}`}
          on:click|stopPropagation={toggleCollapsed}
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

  {#if props.description}
    <p class="section-description text-sm text-gray-500 mb-4">
      {props.description}
    </p>
  {/if}

  {#if !isCollapsed || !props.collapsible}
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