<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import FolderTreeNode from './FolderTreeNode.svelte';

  type FolderNode = {
    id: number | string;
    name: string;
    children?: FolderNode[];
    expanded?: boolean;
    icon?: string;
    url?: string; // for navigation
    count?: number; // number of items in folder
    disabled?: boolean;
  };

  type Props = {
    nodes: FolderNode[];
    defaultExpanded?: boolean;
    onNodeClick?: (node: FolderNode) => void;
    onNodeToggle?: (node: FolderNode, expanded: boolean) => void;
    loadChildren?: (nodeId: string | number) => Promise<FolderNode[]>;
  } & HTMLAttributes<HTMLDivElement>;

  let {
    nodes,
    defaultExpanded,
    onNodeClick,
    onNodeToggle,
    loadChildren,
    class: className = '',
    ...restProps
  }: Props = $props();

  let expandedNodes = $state<Set<string | number>>(new Set());
  let loadingNodes = $state<Set<string | number>>(new Set());
  let lazyLoadedChildren = $state<Record<string | number, FolderNode[]>>({});

  function handleNodeClick(node: FolderNode) {
    if (node.disabled) return;

    if (node.url) {
      window.location.href = node.url;
    }

    if (onNodeClick) {
      onNodeClick(node);
    }

    if (node.children || loadChildren) {
      toggleNode(node);
    }
  }

  function toggleNode(node: FolderNode) {
    if (node.disabled) return;

    const nodeId = node.id;
    const isCurrentlyExpanded = expandedNodes.has(nodeId);

    if (isCurrentlyExpanded) {
      expandedNodes.delete(nodeId);
    } else {
      expandedNodes.add(nodeId);
      if (loadChildren && !lazyLoadedChildren[nodeId]) {
        loadChildrenForNode(nodeId);
      }
    }

    if (onNodeToggle) {
      onNodeToggle(node, !isCurrentlyExpanded);
    }
  }

  async function loadChildrenForNode(nodeId: string | number) {
    if (!loadChildren) return;

    loadingNodes.add(nodeId);
    try {
      const children = await loadChildren(nodeId);
      lazyLoadedChildren = {
        ...lazyLoadedChildren,
        [nodeId]: children
      };
    } catch (error) {
      console.error(`Error loading children for node ${nodeId}:`, error);
    } finally {
      loadingNodes.delete(nodeId);
    }
  }

  $effect(() => {
    if (defaultExpanded) {
      const allNodeIds = collectAllNodeIds(nodes);
      expandedNodes = new Set(allNodeIds);
    }
  });

  function collectAllNodeIds(nodes: FolderNode[]): Array<string | number> {
    const ids: Array<string | number> = [];
    for (const node of nodes) {
      ids.push(node.id);
      if (node.children) {
        ids.push(...collectAllNodeIds(node.children));
      }
    }
    return ids;
  }
</script>

<div class="folder-tree {className}" {...restProps}>
  <ul role="tree" class="space-y-1">
    {#each nodes as node}
      <FolderTreeNode
        {node}
        {expandedNodes}
        {loadingNodes}
        {lazyLoadedChildren}
        onNodeClick={handleNodeClick}
        onNodeToggle={toggleNode}
      />
    {/each}
  </ul>
</div>

<style>
  .folder-tree {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  }

  li[role="treeitem"] {
    list-style: none;
  }

  ul[role="tree"],
  ul[role="group"] {
    padding-left: 0;
    margin: 0;
    list-style: none;
  }
</style>
