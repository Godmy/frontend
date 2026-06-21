<script lang="ts">
  import { getContext } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Props = {
    value: string;
    class?: string;
    children?: any;
  } & HTMLButtonAttributes;

  let { children, ...props }: Props = $props();

  // Получаем контекст аккордеона
  const context = getContext<{
    accordionId: string;
    isPanelOpen: (panelId: string) => boolean;
    handleValueChange: (panelId: string) => void;
  }>('accordion-context');

  let isOpen = $derived(context.isPanelOpen(props.value));

  function handleClick() {
    context.handleValueChange(props.value);
  }
</script>

<button
  {...props}
  type="button"
  class="
    flex w-full items-center justify-between p-4 text-left font-medium
    {isOpen ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}
    {props.class || ''}
  "
  onclick={handleClick}
  aria-expanded={isOpen}
>
  <span>{@render children()}</span>
  <svg
    class="h-5 w-5 text-gray-500 transition-transform duration-200"
    style={isOpen ? 'transform: rotate(180deg)' : ''}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clip-rule="evenodd"
    />
  </svg>
</button>
