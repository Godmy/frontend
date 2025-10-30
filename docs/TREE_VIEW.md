# Tree View Components Documentation

Документация по компонентам для работы с иерархическими данными концепций.

## Обзор

Система Tree View состоит из трех основных компонентов:
- **ConceptTree** - основной компонент дерева с управлением и поиском
- **TreeNode** - рекурсивный узел дерева с поддержкой drag-and-drop
- **ConceptBreadcrumb** - breadcrumb навигация по иерархии

## ConceptTree Component

### Описание
Основной компонент для отображения иерархии концепций в виде дерева с возможностью поиска, раскрытия/скрытия узлов и drag-and-drop перемещения.

### Props

```typescript
{
  concepts: Concept[];           // Массив всех концепций
  onEdit: (concept: Concept) => void;  // Callback для редактирования
  onDelete: (id: number) => void;      // Callback для удаления
  onMove?: (conceptId: number, newParentId: number | null) => Promise<void>; // Callback для перемещения
}
```

### Основные функции

#### Построение дерева
Компонент автоматически строит дерево из плоского списка концепций, используя поля `id` и `parentId`.

```typescript
function buildTree(concepts: Concept[]): Concept[] {
  // Создает иерархическую структуру
  // Узлы без родителя или с несуществующим родителем добавляются в корень
}
```

#### Поиск по дереву
Встроенный поиск фильтрует концепции по полю `path`:

```svelte
<input
  type="text"
  bind:value={searchQuery}
  placeholder="Search concepts..."
/>
```

#### Управление раскрытием узлов

```typescript
// Раскрыть все узлы
expandAll()

// Свернуть все узлы
collapseAll()

// Toggle отдельного узла
toggleNode(conceptId: number)
```

#### Валидация циклических зависимостей

```typescript
function validateParent(conceptId: number, newParentId: number | null): boolean {
  // Проверяет, не создаст ли перемещение циклическую зависимость
  // Возвращает false, если newParent является потомком conceptId
}
```

### Использование

```svelte
<script>
  import ConceptTree from '$lib/components/concepts/ConceptTree.svelte';

  const concepts = [
    { id: 1, path: 'Root', depth: 0, parentId: null },
    { id: 2, path: 'Child 1', depth: 1, parentId: 1 },
    { id: 3, path: 'Child 2', depth: 1, parentId: 1 }
  ];

  function handleEdit(concept) {
    console.log('Edit:', concept);
  }

  function handleDelete(id) {
    console.log('Delete:', id);
  }

  async function handleMove(conceptId, newParentId) {
    // Обновить концепцию на сервере
    await updateConcept(conceptId, { parentId: newParentId });
  }
</script>

<ConceptTree
  {concepts}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onMove={handleMove}
/>
```

## TreeNode Component

### Описание
Рекурсивный компонент для отображения отдельного узла дерева с поддержкой:
- Drag & Drop перемещения
- Keyboard navigation
- Контекстное меню
- Accessibility

### Props

```typescript
{
  concept: Concept & { children?: Concept[] };  // Узел с дочерними элементами
  expandedNodes: Writable<Set<number>>;         // Store раскрытых узлов
  onEdit: (concept: Concept) => void;
  onDelete: (id: number) => void;
  onMove?: (conceptId: number, newParentId: number | null) => Promise<void>;
  toggleNode: (id: number) => void;
  getChildCount: (id: number) => number;
  validateParent: (conceptId: number, newParentId: number | null) => boolean;
  level?: number;  // Уровень вложенности (для отступов)
}
```

### Keyboard Shortcuts

| Клавиша | Действие |
|---------|----------|
| `→` (Arrow Right) | Раскрыть узел (если есть дети) |
| `←` (Arrow Left) | Свернуть узел |
| `Enter` | Редактировать узел |
| `Shift + Delete` | Удалить узел |

### Drag & Drop

**Перемещение узла:**
1. Начните перетаскивание узла
2. Наведите на целевой узел (который станет родителем)
3. Отпустите для перемещения

**Валидация:**
- Нельзя переместить узел на самого себя
- Нельзя переместить узел на его потомка (защита от циклов)

### Контекстное меню

Правый клик по узлу открывает контекстное меню с опциями:
- Edit (Редактировать)
- Delete (Удалить)
- Expand/Collapse (Раскрыть/Свернуть) - только для узлов с детьми

### Визуальная индикация

#### Цветовые индикаторы глубины
Каждый уровень вложенности имеет свой цвет левой границы:
- Level 0: blue
- Level 1: green
- Level 2: yellow
- Level 3: red
- Level 4: purple
- Level 5+: pink

#### Padding по уровням
Отступ слева = `level * 24 + 24` пикселей

### Accessibility

- `role="treeitem"` - роль узла дерева
- `aria-expanded` - состояние раскрытия (для узлов с детьми)
- `aria-level` - уровень вложенности
- `tabindex="0"` - фокусируемость с клавиатуры

## ConceptBreadcrumb Component

### Описание
Компонент для отображения пути от корня до выбранной концепции.

### Props

```typescript
{
  concepts: Concept[];           // Все концепции
  currentConceptId?: number;     // ID текущей выбранной концепции
  onNavigate?: (conceptId: number | null) => void;  // Callback для навигации
}
```

### Использование

```svelte
<script>
  import ConceptBreadcrumb from '$lib/components/concepts/ConceptBreadcrumb.svelte';

  const concepts = [...];
  let currentConceptId = 3;

  function handleNavigate(conceptId) {
    currentConceptId = conceptId;
    // Дополнительная логика навигации
  }
</script>

<ConceptBreadcrumb
  {concepts}
  {currentConceptId}
  onNavigate={handleNavigate}
/>
```

### Отображение

```
🏠 / Root / Level 1 / Current Level
```

- 🏠 (Home) - возврат к корню (`conceptId = null`)
- Промежуточные элементы - кликабельны, ведут к соответствующему узлу
- Последний элемент - текущая позиция (не кликабелен)

## Примеры использования

### Базовый пример

```svelte
<script>
  import { graphql } from '$houdini';
  import ConceptTree from '$lib/components/concepts/ConceptTree.svelte';

  const GetConcepts = graphql(`
    query GetConcepts {
      concepts {
        id
        path
        depth
        parentId
      }
    }
  `);

  const { data } = GetConcepts.fetch();

  function handleEdit(concept) {
    // Открыть форму редактирования
  }

  function handleDelete(id) {
    if (confirm('Delete concept?')) {
      // Удалить концепцию
    }
  }

  async function handleMove(conceptId, newParentId) {
    // Обновить parentId через GraphQL mutation
  }
</script>

{#if $data}
  <ConceptTree
    concepts={$data.concepts}
    onEdit={handleEdit}
    onDelete={handleDelete}
    onMove={handleMove}
  />
{/if}
```

### С Breadcrumb навигацией

```svelte
<script>
  import ConceptTree from '$lib/components/concepts/ConceptTree.svelte';
  import ConceptBreadcrumb from '$lib/components/concepts/ConceptBreadcrumb.svelte';

  let concepts = [...];
  let selectedConceptId = $state(undefined);

  function handleSelect(conceptId) {
    selectedConceptId = conceptId;
  }
</script>

<ConceptBreadcrumb
  {concepts}
  currentConceptId={selectedConceptId}
  onNavigate={handleSelect}
/>

<ConceptTree {concepts} ... />
```

## Интеграция с GraphQL

### Queries

```graphql
query GetConcepts {
  concepts {
    id
    path
    depth
    parentId
  }
}
```

### Mutations

**Создание:**
```graphql
mutation CreateConcept($input: ConceptInput!) {
  createConcept(input: $input) {
    id
    path
    depth
    parentId
  }
}
```

**Обновление (перемещение):**
```graphql
mutation UpdateConcept($conceptId: Int!, $input: ConceptUpdateInput!) {
  updateConcept(conceptId: $conceptId, input: $input) {
    id
    path
    depth
    parentId
  }
}
```

**Удаление:**
```graphql
mutation DeleteConcept($conceptId: Int!) {
  deleteConcept(conceptId: $conceptId)
}
```

## Стилизация

Компоненты используют Tailwind CSS классы. Основные цвета:
- Primary: `indigo-600`
- Danger: `red-600`
- Gray scale: `gray-50` - `gray-900`

### Кастомизация

Для изменения цветов глубины в `TreeNode.svelte`:

```typescript
const depthColors = [
  'border-l-blue-500',    // Level 0
  'border-l-green-500',   // Level 1
  'border-l-yellow-500',  // Level 2
  'border-l-red-500',     // Level 3
  'border-l-purple-500',  // Level 4
  'border-l-pink-500'     // Level 5+
];
```

## Performance

### Оптимизации
- Использование Svelte stores для состояния раскрытия узлов
- Ленивый рендеринг дочерних узлов (только когда раскрыты)
- Efficient tree building algorithm (O(n))

### Рекомендации
- Для очень больших деревьев (1000+ узлов) рассмотрите виртуализацию
- Используйте pagination или lazy loading для загрузки данных

## Troubleshooting

### Проблема: Циклические зависимости не предотвращаются
**Решение:** Убедитесь, что передана функция `validateParent` и она вызывается перед `onMove`.

### Проблема: Состояние раскрытия не сохраняется
**Решение:** Состояние хранится в памяти. Для персистентности используйте localStorage:

```typescript
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const storedExpanded = browser
  ? JSON.parse(localStorage.getItem('expandedNodes') || '[]')
  : [];

const expandedNodes = writable<Set<number>>(new Set(storedExpanded));

expandedNodes.subscribe(value => {
  if (browser) {
    localStorage.setItem('expandedNodes', JSON.stringify([...value]));
  }
});
```

### Проблема: Drag & Drop не работает
**Решение:** Проверьте, что:
1. Передан callback `onMove`
2. Browser поддерживает HTML5 Drag & Drop API
3. Не включен strict CSP, блокирующий inline event handlers

## См. также

- [Backlog.md](../Backlog.md) - Product backlog с приоритетами
- [TESTING.md](../TESTING.md) - Руководство по тестированию
- [GraphQL Examples](../../backend/docs/graphql-examples.md) - Примеры GraphQL запросов