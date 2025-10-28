<script lang="ts">
  import { Button } from '../forms/Button.svelte';

  type Props = {
    value?: string;
    onchange?: (value: string) => void;
    placeholder?: string;
    class?: string;
  };

  let props: Props = $props();

  let internalValue = $state(props.value || '');
  
  $: if (props.value !== undefined && props.value !== internalValue) {
    internalValue = props.value;
  }

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    internalValue = target.value;
    if (props.onchange) {
      props.onchange(internalValue);
    }
  }

  function clear() {
    internalValue = '';
    if (props.onchange) {
      props.onchange('');
    }
  }
</script>

<div class="relative rounded-md shadow-sm {props.class || ''}" {...$$rest}>
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
  <input
    type="text"
    value={internalValue}
    on:input={handleInput}
    placeholder={props.placeholder || 'Поиск...'}
    class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
  />
  {#if internalValue}
    <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
      <button
        type="button"
        class="text-gray-400 hover:text-gray-500 focus:outline-none"
        on:click={clear}
        aria-label="Очистить"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  {/if}
</div>