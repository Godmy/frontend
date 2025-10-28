<script lang="ts">
  import type { HTMLDivAttributes } from 'svelte/elements';

  type Item = {
    id: number;
    name: string;
    description: string;
  };

  type RenderProps = {
    items: Item[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    refresh: () => Promise<void>;
    addItem: (item: Omit<Item, 'id'>) => void;
    updateItem: (id: number, updates: Partial<Item>) => void;
    deleteItem: (id: number) => void;
  };

  type Props = {
    items?: Item[];
    children: import('svelte').Snippet<[RenderProps]>;
  } & HTMLDivAttributes;

  let { items = [], children, ...restProps }: Props = $props();

  let internalItems = $state<Item[]>(items);
  let loading = $state(false);
  let error = $state<string | null>(null);
  let searchTerm = $state('');

  // Имитация асинхронного обновления данных
  async function refresh() {
    loading = true;
    error = null;
    
    try {
      // Имитация API вызова
      await new Promise(resolve => setTimeout(resolve, 1000));
      // В реальном приложении здесь будет вызов API
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error occurred';
    } finally {
      loading = false;
    }
  }

  function setSearchTerm(term: string) {
    searchTerm = term;
  }

  function addItem(newItem: Omit<Item, 'id'>) {
    const id = Math.max(0, ...internalItems.map(i => i.id)) + 1;
    internalItems = [...internalItems, { ...newItem, id }];
  }

  function updateItem(id: number, updates: Partial<Item>) {
    internalItems = internalItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
  }

  function deleteItem(id: number) {
    internalItems = internalItems.filter(item => item.id !== id);
  }

  // Обертка для передачи в слот
  const renderProps: RenderProps = {
    items: internalItems,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refresh,
    addItem,
    updateItem,
    deleteItem
  };
</script>

<div {...restProps}>
  {@render children(renderProps)}
</div>