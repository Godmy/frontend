<script lang="ts">
  import { getContext, onMount, onDestroy } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Props = {
    id: string;
    selected?: boolean;
    class?: string;
    children?: any;
  } & HTMLButtonAttributes;

  let { children, ...props }: Props = $props();

  // Получаем контекст вкладок
  const context = getContext<{
    tabsId: string;
    selectedTabId: string;
    registerTab: (id: string) => void;
    unregisterTab: (id: string) => void;
    handleTabChange: (id: string) => void;
  }>('tabs-context');

  onMount(() => {
    if (props.id) {
      context.registerTab(props.id);
    }
  });

  onDestroy(() => {
    if (props.id) {
      context.unregisterTab(props.id);
    }
  });

  let isSelected = $derived(context.selectedTabId === props.id);
  let tabId = $derived(`tab-${context.tabsId}-${props.id}`);
  let panelId = $derived(`panel-${context.tabsId}-${props.id}`);

  function handleClick() {
    context.handleTabChange(props.id);
  }
</script>

<button
  {...props}
  id={tabId}
  role="tab"
  aria-selected={isSelected}
  aria-controls={panelId}
  class="
    py-4 px-6 text-center border-b-2 font-medium text-sm
    {isSelected
      ? 'border-indigo-500 text-indigo-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
    {props.class || ''}
  "
  onclick={handleClick}
>
  {@render children()}
</button>
