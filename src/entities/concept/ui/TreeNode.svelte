<script lang="ts">
  import type { Concept, TreeConcept } from '../model/types';
  import type { Writable } from 'svelte/store';

  type Props = {
    concept: TreeConcept;
    expandedNodes: Writable<Set<number>>;
    onEdit: (concept: Concept) => void;
    onDelete: (id: number) => void;
    onMove?: (conceptId: number, newParentId: number | null) => Promise<void>;
    toggleNode: (id: number) => void;
    getChildCount: (id: number) => number;
    validateParent: (conceptId: number, newParentId: number | null) => boolean;
    level?: number;
  };

  let {
    concept,
    expandedNodes,
    onEdit,
    onDelete,
    onMove,
    toggleNode,
    getChildCount,
    validateParent,
    level = 0
  }: Props = $props();

  let isExpanded = $derived($expandedNodes.has(concept.id));
  let hasChildren = $derived(concept.children && concept.children.length > 0);
  let childCount = $derived(getChildCount(concept.id));

  // Drag & Drop state
  let isDragging = $state(false);
  let isDragOver = $state(false);
  let showContextMenu = $state(false);
  let contextMenuX = $state(0);
  let contextMenuY = $state(0);

  // Drag handlers
  function handleDragStart(e: DragEvent) {
    if (!e.dataTransfer) return;
    isDragging = true;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('conceptId', concept.id.toString());
  }

  function handleDragEnd() {
    isDragging = false;
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (!e.dataTransfer) return;

    const draggedId = e.dataTransfer.getData('conceptId');
    if (draggedId && validateParent(parseInt(draggedId), concept.id)) {
      e.dataTransfer.dropEffect = 'move';
      isDragOver = true;
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  }

  function handleDragLeave() {
    isDragOver = false;
  }

  async function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragOver = false;

    if (!e.dataTransfer || !onMove) return;

    const draggedIdStr = e.dataTransfer.getData('conceptId');
    if (!draggedIdStr) return;

    const draggedId = parseInt(draggedIdStr);

    // Валидация
    if (!validateParent(draggedId, concept.id)) {
      alert('Cannot move: this would create a circular dependency');
      return;
    }

    // Выполнить перемещение
    try {
      await onMove(draggedId, concept.id);
    } catch (error) {
      console.error('Failed to move concept:', error);
    }
  }

  // Context menu handlers
  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    contextMenuX = e.clientX;
    contextMenuY = e.clientY;
    showContextMenu = true;
  }

  function closeContextMenu() {
    showContextMenu = false;
  }

  // Keyboard navigation
  function handleKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowRight':
        if (hasChildren && !isExpanded) {
          toggleNode(concept.id);
        }
        break;
      case 'ArrowLeft':
        if (isExpanded) {
          toggleNode(concept.id);
        }
        break;
      case 'Enter':
        onEdit(concept);
        break;
      case 'Delete':
        if (e.shiftKey) {
          onDelete(concept.id);
        }
        break;
    }
  }

  // Depth indicator colors
  const depthColors = [
    'border-l-blue-500',
    'border-l-green-500',
    'border-l-yellow-500',
    'border-l-red-500',
    'border-l-purple-500',
    'border-l-pink-500'
  ];

  let depthColor = $derived(depthColors[level % depthColors.length]);
</script>

<svelte:window onclick={closeContextMenu} />

<li
  class="tree-node"
  class:dragging={isDragging}
  class:drag-over={isDragOver}
>
  <div
    class="node-content px-6 py-3 hover:bg-gray-50 cursor-pointer border-l-4 {depthColor}"
    style="padding-left: {level * 24 + 24}px"
    draggable={true}
    ondragstart={handleDragStart}
    ondragend={handleDragEnd}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    oncontextmenu={handleContextMenu}
    onkeydown={handleKeyDown}
    role="treeitem"
    tabindex="0"
    aria-expanded={hasChildren ? isExpanded : undefined}
    aria-level={level + 1}
    aria-selected="false"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <!-- Expand/Collapse button -->
        {#if hasChildren}
          <button
            onclick={() => toggleNode(concept.id)}
            class="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
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
          <div class="w-5 h-5 flex-shrink-0"></div>
        {/if}

        <!-- Concept info -->
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-medium text-gray-900 truncate">{concept.path}</h3>
          <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span>Depth: {concept.depth}</span>
            {#if concept.parentId}
              <span>Parent: {concept.parentId}</span>
            {/if}
            {#if childCount > 0}
              <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                {childCount} {childCount === 1 ? 'child' : 'children'}
              </span>
            {/if}
          </div>
        </div>

        <!-- Drag handle icon -->
        <div class="flex-shrink-0 text-gray-400 cursor-move">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 ml-4 flex-shrink-0">
        <button
          onclick={() => onEdit(concept)}
          class="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Edit concept"
        >
          Edit
        </button>
        <button
          onclick={() => onDelete(concept.id)}
          class="px-3 py-1 text-xs font-medium text-white bg-red-600 border border-transparent rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          aria-label="Delete concept"
        >
          Delete
        </button>
      </div>
    </div>
  </div>

  <!-- Children -->
  {#if hasChildren && isExpanded}
    <ul class="children" role="group">
      {#each concept.children as child}
        <svelte:self
          concept={child}
          {expandedNodes}
          {onEdit}
          {onDelete}
          {onMove}
          {toggleNode}
          {getChildCount}
          {validateParent}
          level={level + 1}
        />
      {/each}
    </ul>
  {/if}
</li>

<!-- Context Menu -->
{#if showContextMenu}
  <div
    class="context-menu fixed bg-white shadow-lg rounded-md border border-gray-200 py-1 z-50"
    style="left: {contextMenuX}px; top: {contextMenuY}px"
  >
    <button
      onclick={() => {
        onEdit(concept);
        closeContextMenu();
      }}
      class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
    >
      Edit
    </button>
    <button
      onclick={() => {
        onDelete(concept.id);
        closeContextMenu();
      }}
      class="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50"
    >
      Delete
    </button>
    {#if hasChildren}
      <button
        onclick={() => {
          toggleNode(concept.id);
          closeContextMenu();
        }}
        class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
      >
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
    {/if}
  </div>
{/if}

<style>
  .tree-node {
    position: relative;
  }

  .tree-node.dragging {
    opacity: 0.5;
  }

  .tree-node.drag-over .node-content {
    background-color: #e0e7ff;
    border-color: #4f46e5;
  }

  .node-content {
    transition: background-color 0.15s ease;
  }

  .children {
    list-style: none;
  }

  .context-menu {
    min-width: 150px;
    max-width: 250px;
  }
</style>
