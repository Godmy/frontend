<script lang="ts">
  import { getContext } from 'svelte';
  import type { HTMLDivElementAttributes } from 'svelte/elements';

  type Props = {
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
</script>

<div 
  {...props} 
  role="tablist" 
  aria-orientation="horizontal" 
  class="flex border-b border-gray-200 {props.class || ''}"
>
  {@render children()}
</div>