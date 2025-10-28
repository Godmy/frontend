<script lang="ts">
  import { getContext } from 'svelte';
  import type { HTMLDivAttributes } from 'svelte/elements';

  type Props = {
    value: string;
    class?: string;
    children?: any;
  } & HTMLDivAttributes;

  let { children, ...props }: Props = $props();

  // Получаем контекст аккордеона
  const context = getContext<{
    accordionId: string;
    isPanelOpen: (panelId: string) => boolean;
    handleValueChange: (panelId: string) => void;
  }>('accordion-context');

  let isOpen = $derived(context.isPanelOpen(props.value));
</script>

<div
  {...props}
  class="
    overflow-hidden transition-all duration-200 ease-in-out
    {isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
    {props.class || ''}
  "
  aria-hidden={!isOpen}
>
  <div class="p-4 border-t border-gray-200 bg-white">
    {@render children()}
  </div>
</div>