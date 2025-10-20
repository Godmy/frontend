<script lang="ts">
	import type { Concept } from '$lib/api/concepts';
	import TreeNode from './TreeNode.svelte';
	import { writable } from 'svelte/store';

	type Props = {
		concepts: Concept[];
		onEdit: (concept: Concept) => void;
		onDelete: (id: number) => void;
		onMove?: (conceptId: number, newParentId: number | null) => Promise<void>;
	};

	let { concepts, onEdit, onDelete, onMove }: Props = $props();

	// Store для отслеживания раскрытых узлов (по умолчанию все раскрыты)
	const expandedNodes = writable<Set<number>>(new Set());

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
		expandedNodes.update((nodes) => {
			const newNodes = new Set(nodes);
			if (newNodes.has(conceptId)) {
				newNodes.delete(conceptId);
			} else {
				newNodes.add(conceptId);
			}
			return newNodes;
		});
	}

	// Раскрыть все
	function expandAll() {
		expandedNodes.set(new Set(concepts.map((c) => c.id)));
	}

	// Свернуть все
	function collapseAll() {
		expandedNodes.set(new Set());
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
		return concepts.filter((c) => c.parentId === conceptId).length;
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
						{onEdit}
						{onDelete}
						{onMove}
						{toggleNode}
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
</style>
