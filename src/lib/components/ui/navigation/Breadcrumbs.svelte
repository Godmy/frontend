<script lang="ts">
  type Breadcrumb = {
    label: string;
    href?: string;
    onClick?: () => void;
  };

  type Props = {
    items: Breadcrumb[];
    class?: string;
  };

  let props: Props = $props();
</script>

<nav class="flex {props.class || ''}" aria-label="Breadcrumb" {...$$rest}>
  <ol class="inline-flex items-center space-x-1 md:space-x-3">
    {#each props.items as item, i}
      <li class="inline-flex items-center">
        {#if i > 0}
          <span class="text-gray-400 mx-2">/</span>
        {/if}
        {#if item.href}
          <a 
            href={item.href} 
            class="text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            {item.label}
          </a>
        {:else if item.onClick}
          <button 
            type="button"
            class="text-sm font-medium text-gray-700 hover:text-indigo-600"
            on:click={item.onClick}
          >
            {item.label}
          </button>
        {:else}
          <span class="text-sm font-medium text-gray-500">
            {item.label}
          </span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>