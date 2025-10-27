<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  export type ContextMenuItem = {
    label: string;
    action: (nodeId?: string) => void;
    icon?: string;
  };

  export let visible: boolean = false;
  export let x: number = 0;
  export let y: number = 0;
  export let nodeId: string | null = null;
  export let items: ContextMenuItem[] = [];
  export let title: string = 'Context Menu';

  const dispatch = createEventDispatcher();

  let menuRef: HTMLElement;

  function handleClickOutside(e: Event) {
    if (menuRef && !menuRef.contains(e.target as Node)) {
      hideMenu();
    }
  }

  function hideMenu() {
    visible = false;
    dispatch('close');
  }

  function handleItemClick(item: ContextMenuItem) {
    if (item.action) {
      item.action(nodeId);
    }
    hideMenu();
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<style>
  .context-menu {
    position: fixed;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
    z-index: 50;
    min-width: 160px;
    max-width: 300px;
  }

  .context-menu-header {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #e2e8f0;
    font-weight: 600;
    color: #1e293b;
    font-size: 0.875rem;
  }

  .context-menu-items {
    list-style: none;
    margin: 0;
    padding: 0.25rem 0;
  }

  .context-menu-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 0.875rem;
    color: #334155;
  }

  .context-menu-item:hover {
    background-color: #f1f5f9;
  }

  .context-menu-item-icon {
    margin-right: 0.5rem;
    width: 1rem;
    height: 1rem;
  }
</style>

{#if visible}
  <div 
    class="context-menu" 
    bind:this={menuRef}
    style="top: {y}px; left: {x}px;"
  >
    <div class="context-menu-header">
      {title}
    </div>
    <ul class="context-menu-items">
      {#each items as item}
        <li class="context-menu-item" on:click={() => handleItemClick(item)}>
          {#if item.icon}
            <span class="context-menu-item-icon">{item.icon}</span>
          {/if}
          <span>{item.label}</span>
        </li>
      {/each}
    </ul>
  </div>
{/if}