<script lang="ts">
  import type { Concept } from '../model/types';
  import TreeNode from './TreeNode.svelte';

  type Props = {
    concepts: Concept[];
    onEdit: (concept: Concept) => void;
    onDelete: (id: number) => void;
    onMove?: (conceptId: number, newParentId: number | null) => Promise<void>;
    loadChildren?: (conceptId: number) => Promise<Concept[]>;
  };

  let { concepts, onEdit, onDelete, onMove, loadChildren }: Props = $props();

  // Состояние для отслеживания развернутых узлов
  let expandedNodes = $state<Set<number>>(new Set());

  // Состояние для отслеживания узлов, для которых загружаются дети
  let loadingNodes = $state<Set<number>>(new Set());

  // Состояние для отслеживания дочерних элементов, загруженных лениво
  let lazyLoadedChildren = $state<Record<number, Concept[]>>({});

  // Состояние для drag-and-drop
  let dragState = $state({
    draggedNode: null as number | null,
    dropTarget: null as number | null,
    dropPosition: null as 'before' | 'after' | 'inside' | null
  });

  // Поиск
  let searchQuery = $state('');
  let filteredConcepts = $derived(
    searchQuery.trim()
      ? concepts.filter((c) =>
          c.path.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : concepts
  );

  // Построение дерева из плоского списка
  function buildTree(concepts: Concept[]): Concept[] {
    const map = new Map<number, Concept & { children: Concept[] }>();
    const roots: Concept[] = [];

    // Создаем мапу всех концепций
    concepts.forEach((concept) => {
      map.set(concept.id, { ...concept, children: [] });
    });

    // Строим дерево
    concepts.forEach((concept) => {
      const node = map.get(concept.id)!;
      if (concept.parentId === null) {
        roots.push(node);
      } else {
        const parent = map.get(concept.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          // Если родитель не найден, добавляем в корень
          roots.push(node);
        }
      }
    });

    return roots;
  }

  let tree = $derived(buildTree(filteredConcepts));

  // Получение пути к узлу (breadcrumb)
  function getPath(conceptId: number): Concept[] {
    const path: Concept[] = [];
    let current = concepts.find((c) => c.id === conceptId);

    while (current) {
      path.unshift(current);
      current = current.parentId ? concepts.find((c) => c.id === current!.parentId) : undefined;
    }

    return path;
  }

  // Toggle узла
  function toggleNode(conceptId: number) {
    if (expandedNodes.has(conceptId)) {
      expandedNodes.delete(conceptId);
    } else {
      expandedNodes.add(conceptId);
      // Если узел еще не загружен и есть функция loadChildren
      if (loadChildren && !lazyLoadedChildren[conceptId]) {
        loadChildrenForNode(conceptId);
      }
    }
  }

  // Загрузка дочерних элементов узла (lazy loading)
  async function loadChildrenForNode(conceptId: number) {
    if (!loadChildren) return;
    
    loadingNodes.add(conceptId);
    try {
      const children = await loadChildren(conceptId);
      lazyLoadedChildren = {
        ...lazyLoadedChildren,
        [conceptId]: children
      };
    } catch (error) {
      console.error(`Error loading children for node ${conceptId}:`, error);
    } finally {
      loadingNodes.delete(conceptId);
    }
  }

  // Раскрыть все
  function expandAll() {
    expandedNodes = new Set(concepts.map((c) => c.id));
  }

  // Свернуть все
  function collapseAll() {
    expandedNodes = new Set();
  }

  // Проверка циклических зависимостей
  function validateParent(conceptId: number, newParentId: number | null): boolean {
    if (newParentId === null) return true;
    if (conceptId === newParentId) return false;

    // Проверяем, не является ли newParent потомком conceptId
    const descendants = getDescendants(conceptId);
    return !descendants.includes(newParentId);
  }

  function getDescendants(conceptId: number): number[] {
    const descendants: number[] = [];
    const children = concepts.filter((c) => c.parentId === conceptId);

    children.forEach((child) => {
      descendants.push(child.id);
      descendants.push(...getDescendants(child.id));
    });

    return descendants;
  }

  // Подсчет дочерних элементов
  function getChildCount(conceptId: number): number {
    // Учитываем как уже загруженные дети, так и lazy-загруженные
    const directChildren = concepts.filter((c) => c.parentId === conceptId).length;
    const lazyChildren = lazyLoadedChildren[conceptId]?.length || 0;
    return directChildren + lazyChildren;
  }

  // Drag-and-drop события
  function handleDragStart(nodeId: number) {
    dragState.draggedNode = nodeId;
  }

  function handleDragOver(nodeId: number, position: 'before' | 'after' | 'inside') {
    dragState.dropTarget = nodeId;
    dragState.dropPosition = position;
  }

  function handleDragEnd() {
    dragState.draggedNode = null;
    dragState.dropTarget = null;
    dragState.dropPosition = null;
  }

  async function handleDrop(nodeId: number) {
    if (dragState.draggedNode === null || dragState.dropTarget === null || dragState.dropPosition === null) {
      return;
    }

    const draggedId = dragState.draggedNode;
    const dropId = dragState.dropTarget;
    const position = dragState.dropPosition;

    // Проверяем возможность перемещения
    if (draggedId === dropId || !validateParent(draggedId, dropId)) {
      handleDragEnd();
      return;
    }

    try {
      // Вызываем функцию перемещения
      if (onMove) {
        await onMove(draggedId, position === 'inside' ? dropId : null);
      }
      
      // Сбрасываем состояние drag-and-drop
      handleDragEnd();
    } catch (error) {
      console.error('Error moving node:', error);
      handleDragEnd();
    }
  }

  // Найти все дочерние узлы для lazy loading
  function getAllChildren(node: Concept): Concept[] {
    const result: Concept[] = [];
    if (lazyLoadedChildren[node.id]) {
      const children = lazyLoadedChildren[node.id];
      result.push(...children);
      for (const child of children) {
        result.push(...getAllChildren(child));
      }
    }
    return result;
  }
</script>

<div class="concept-tree">
  <!-- Панель управления -->
  <div class="mb-4 flex items-center justify-between gap-4">
    <!-- Поиск -->
    <div class="flex-1 max-w-md">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search concepts..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <!-- Кнопки управления -->
    <div class="flex gap-2">
      <button
        onclick={expandAll}
        class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Expand All
      </button>
      <button
        onclick={collapseAll}
        class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Collapse All
      </button>
    </div>
  </div>

  <!-- Дерево -->
  <div class="bg-white shadow overflow-hidden sm:rounded-md">
    {#if tree.length > 0}
      <ul class="divide-y divide-gray-200">
        {#each tree as node}
          <TreeNode
            concept={node}
            {expandedNodes}
            {loadingNodes}
            {lazyLoadedChildren}
            {dragState}
            {onEdit}
            {onDelete}
            {onMove}
            on:toggleNode={() => toggleNode(node.id)}
            on:dragStart={() => handleDragStart(node.id)}
            on:dragOver={(e) => handleDragOver(node.id, e.detail.position)}
            on:dragEnd={handleDragEnd}
            on:drop={() => handleDrop(node.id)}
            {getChildCount}
            {validateParent}
            level={0}
          />
        {/each}
      </ul>
    {:else}
      <div class="px-6 py-12 text-center text-gray-500">
        {searchQuery ? 'No concepts found matching your search.' : 'No concepts found. Click "Add Concept" to create one.'}
      </div>
    {/if}
  </div>

  <!-- Информация -->
  <div class="mt-4 text-sm text-gray-500">
    Total concepts: {concepts.length}
    {#if searchQuery}
      | Filtered: {filteredConcepts.length}
    {/if}
  </div>
</div>

<style>
  .concept-tree {
    width: 100%;
  }
  
  .drop-target-before::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #3b82f6;
    z-index: 10;
  }
  
  .drop-target-after::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #3b82f6;
    z-index: 10;
  }
  
  .drop-target-inside {
    background-color: rgba(59, 130, 246, 0.1);
    border: 1px dashed #3b82f6;
  }
</style>