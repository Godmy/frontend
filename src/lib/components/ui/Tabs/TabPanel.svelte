<script lang="ts">
  import { getContext } from 'svelte';
  import type { HTMLDivElementAttributes } from 'svelte/elements';

  type Props = {
    id: string;
    class?: string;
    children?: any;
  } & HTMLDivElementAttributes;

  let { children, ...props }: Props = $props();

  // Получаем контекст вкладок
  const context = getContext<{
    tabsId: string;
    selectedTabId: string;
    registerTab: (id: string) => void;
    unregisterTab: (id: string) => void;
    handleTabChange: (id: string) => void;
  }>('tabs-context');

  let isSelected = $derived(context.selectedTabId === props.id);
  let tabId = $derived(`tab-${context.tabsId}-${props.id}`);
  let panelId = $derived(`panel-${context.tabsId}-${props.id}`);
</script>

<div
  {...props}
  id={panelId}
  role="tabpanel"
  aria-labelledby={tabId}
  hidden={!isSelected}
  class="{isSelected ? 'block' : 'hidden'} {props.class || ''}"
>
  {#if isSelected}
    {@render children()}
  {/if}
</div>