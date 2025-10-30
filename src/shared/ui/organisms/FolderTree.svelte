<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  // Типы для узла дерева
  export type FolderNode = {
    id: number | string;
    name: string;
    children?: FolderNode[];
    expanded?: boolean;
    icon?: string;
    url?: string; // для навигации
    count?: number; // количество элементов в папке
    disabled?: boolean;
  };

  // Типы для пропсов
  type Props = {
    nodes: FolderNode[];
    defaultExpanded?: boolean;
    onNodeClick?: (node: FolderNode) => void;
    onNodeToggle?: (node: FolderNode, expanded: boolean) => void;
    loadChildren?: (nodeId: string | number) => Promise<FolderNode[]>;
  } & HTMLAttributes<HTMLDivElement>;

  let props: Props = $props();

  // Состояние развернутых узлов
  let expandedNodes = $state<Set<string | number>>(new Set());

  // Состояние загрузки для lazy loading
  let loadingNodes = $state<Set<string | number>>(new Set());

  // Lazy загруженные дети
  let lazyLoadedChildren = $state<Record<string | number, FolderNode[]>>({});

  // Обработка клика по узлу
  function handleNodeClick(node: FolderNode) {
    if (node.disabled) return;
    
    // Если узел имеет URL, переходим по нему
    if (node.url) {
      window.location.href = node.url;
    }
    
    // Вызываем внешний обработчик
    if (props.onNodeClick) {
      props.onNodeClick(node);
    }
    
    // Если у узла есть дети или есть функция loadChildren, переключаем его
    if (node.children || props.loadChildren) {
      toggleNode(node);
    }
  }

  // Переключение состояния узла (развернут/свернут)
  function toggleNode(node: FolderNode) {
    if (node.disabled) return;
    
    const nodeId = node.id;
    const isCurrentlyExpanded = expandedNodes.has(nodeId);
    
    if (isCurrentlyExpanded) {
      expandedNodes.delete(nodeId);
    } else {
      expandedNodes.add(nodeId);
      // Если есть функция загрузки и дети еще не загружены
      if (props.loadChildren && !lazyLoadedChildren[nodeId]) {
        loadChildrenForNode(nodeId);
      }
    }
    
    // Вызываем внешний обработчик
    if (props.onNodeToggle) {
      props.onNodeToggle(node, !isCurrentlyExpanded);
    }
  }

  // Загрузка детей узла (lazy loading)
  async function loadChildrenForNode(nodeId: string | number) {
    if (!props.loadChildren) return;
    
    loadingNodes.add(nodeId);
    try {
      const children = await props.loadChildren(nodeId);
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

  // Проверка, развернут ли узел
  function isExpanded(nodeId: string | number): boolean {
    return expandedNodes.has(nodeId);
  }

  // Проверка, загружаются ли дети узла
  function isLoading(nodeId: string | number): boolean {
    return loadingNodes.has(nodeId);
  }

  // Получение всех детей узла (как загруженных, так и lazy)
  function getChildren(node: FolderNode): FolderNode[] {
    const directChildren = node.children || [];
    const lazyChildren = lazyLoadedChildren[node.id] || [];
    return [...directChildren, ...lazyChildren];
  }

  // Установка начального состояния развернутых узлов
  $effect(() => {
    if (props.defaultExpanded) {
      const allNodeIds = collectAllNodeIds(props.nodes);
      expandedNodes = new Set(allNodeIds);
    }
  });

  // Вспомогательная функция для сбора всех ID узлов
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

<div class="folder-tree {props.class || ''}" {...$restProps}>
  <ul role="tree" class="space-y-1">
    {#each props.nodes as node}
      <TreeNode 
        {node}
        {expandedNodes}
        {loadingNodes}
        {lazyLoadedChildren}
        on:click={handleNodeClick}
        on:toggle={toggleNode}
      />
    {/each}
  </ul>
</div>

<!-- Подкомпонент для узла дерева -->
<script context="module">
  type NodeProps = {
    node: FolderNode;
    expandedNodes: Set<string | number>;
    loadingNodes: Set<string | number>;
    lazyLoadedChildren: Record<string | number, FolderNode[]>;
  };

  let { node, expandedNodes, loadingNodes, lazyLoadedChildren }: NodeProps = $props();
  
  let hasChildren = $derived(!!(node.children?.length || lazyLoadedChildren[node.id]?.length || node.loadFunction));
  let isExpanded = $derived(expandedNodes.has(node.id));
  let isLoading = $derived(loadingNodes.has(node.id));
  let allChildren = $derived([
    ...(node.children || []),
    ...(lazyLoadedChildren[node.id] || [])
  ]);

  function handleNodeClick() {
    dispatchEvent(new CustomEvent('click', { detail: { node } }));
  }

  function handleToggle() {
    dispatchEvent(new CustomEvent('toggle', { detail: { node } }));
  }
</script>

<li role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} class="relative">
  <div 
    class="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 cursor-pointer text-sm transition-colors"
    class:opacity-50={node.disabled}
    on:click={handleNodeClick}
  >
    {#if hasChildren}
      <button
        class="mr-1 flex items-center justify-center w-6 h-6 rounded hover:bg-gray-200 focus:outline-none"
        on:click|stopPropagation={handleToggle}
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
      <!-- Индикатор загрузки -->
      <div class="w-4 h-4 mr-2 flex items-center justify-center">
        <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900"></div>
      </div>
    {:else}
      <!-- Иконка папки -->
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
        <svelte:component 
          this={import.meta.url.split('?')[0].replace('.svelte', '.svelte')}
          node={child}
          {expandedNodes}
          {loadingNodes}
          {lazyLoadedChildren}
          on:click={(e) => dispatchEvent(new CustomEvent('click', e.detail))}
          on:toggle={(e) => dispatchEvent(new CustomEvent('toggle', e.detail))}
        />
      {/each}
    </ul>
  {/if}
</li>

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