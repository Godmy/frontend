<script lang="ts">
  import type { HTMLTableAttributes } from 'svelte/elements';

  type Props = {
    expanded?: boolean;
    expandable?: boolean;
    expandIcon?: string;
    collapseIcon?: string;
  } & HTMLTableAttributes;

  let props: Props = $props();
  let isExpanded = $state(props.expanded || false);

  function toggle() {
    if (props.expandable !== false) {
      isExpanded = !isExpanded;
    }
  }

  // Обновляем локальное состояние при изменении пропса
  $effect(() => {
    isExpanded = props.expanded || false;
  });
</script>

<!-- Родительская строка таблицы -->
<tr {...$restProps} class="parent-row {props.class || ''}">
  <!-- Ячейка для иконки расширения -->
  {#if props.expandable !== false}
    <td class="expand-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-12">
      <button
        class="expand-toggle focus:outline-none"
        on:click={toggle}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Свернуть' : 'Развернуть'}
      >
        {#if isExpanded}
          {@html props.collapseIcon || '<svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>'}
        {:else}
          {@html props.expandIcon || '<svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>'}
        {/if}
      </button>
    </td>
  {/if}
  
  <!-- Дочерний слот для основных ячеек строки -->
  <slot />
</tr>

<!-- Расширенная строка с деталями -->
{#if isExpanded}
  <tr class="expanded-row">
    <td
      colspan={
        props.expandable !== false
          ? (props.colspan ?? props.colSpan ?? 2)
          : (props.colspan ?? props.colSpan ?? 1)
      }
      class="expanded-cell px-6 py-4 bg-gray-50 text-sm text-gray-700"
    >
      <div class="details-content p-4">
        <slot name="details" />
      </div>
    </td>
  </tr>
{/if}

<style>
  .expand-toggle {
    transition: transform 0.2s ease;
  }

  .expand-toggle:active {
    transform: scale(0.95);
  }

  .expanded-cell {
    border-top: none;
  }

  .details-content {
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      max-height: 0;
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      max-height: 500px;
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
