<script lang="ts">
  import Self from './FolderTreeNode.svelte';

  type FolderNode = {
    id: number | string;
    name: string;
    children?: FolderNode[];
    expanded?: boolean;
    icon?: string;
    url?: string;
    count?: number;
    disabled?: boolean;
  };

  type Props = {
    node: FolderNode;
    expandedNodes: Set<string | number>;
    loadingNodes: Set<string | number>;
    lazyLoadedChildren: Record<string | number, FolderNode[]>;
    onNodeClick: (node: FolderNode) => void;
    onNodeToggle: (node: FolderNode) => void;
  };

  let {
    node,
    expandedNodes,
    loadingNodes,
    lazyLoadedChildren,
    onNodeClick,
    onNodeToggle
  }: Props = $props();

  let hasChildren = $derived(
    !!(node.children?.length || lazyLoadedChildren[node.id]?.length)
  );
  let isExpanded = $derived(expandedNodes.has(node.id));
  let isLoading = $derived(loadingNodes.has(node.id));
  let allChildren = $derived([
    ...(node.children || []),
    ...(lazyLoadedChildren[node.id] || [])
  ]);

  function handleNodeClick() {
    onNodeClick(node);
  }

  function handleToggle() {
    onNodeToggle(node);
  }
</script>

<li role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} class="relative">
  <div
    class="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 cursor-pointer text-sm transition-colors"
    class:opacity-50={node.disabled}
    onclick={handleNodeClick}
  >
    {#if hasChildren}
      <button
        class="mr-1 flex items-center justify-center w-6 h-6 rounded hover:bg-gray-200 focus:outline-none"
        onclick={(e) => {e.stopPropagation(); handleToggle();}}
        aria-label={isExpanded ? 'Свернуть' : 'Развернуть'}
      >
        <svg
          class="w-4 h-4 transform transition-transform"
          class:rotate-90={isExpanded}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    {:else}
      <div class="w-6 mr-1"></div>
    {/if}

    {#if isLoading}
      <div class="w-4 h-4 mr-2 flex items-center justify-center">
        <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900"></div>
      </div>
    {:else}
      <svg
        class="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
    {/if}

    <span class="truncate flex-1">{node.name}</span>

    {#if node.count !== undefined}
      <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {node.count}
      </span>
    {/if}
  </div>

  {#if isExpanded && allChildren.length > 0}
    <ul role="group" class="ml-6 space-y-1 mt-1">
      {#each allChildren as child}
        <Self
          node={child}
          {expandedNodes}
          {loadingNodes}
          {lazyLoadedChildren}
          {onNodeClick}
          {onNodeToggle}
        />
      {/each}
    </ul>
  {/if}
</li>
