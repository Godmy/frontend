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
  let uniqueId = $derived(`${context.accordionId}-${props.value}`);
</script>

<div {...props} id={uniqueId} class="border border-gray-200 rounded-lg overflow-hidden {props.class || ''}">
  {@render children()}
</div>