<script lang="ts">
  import type { HTMLTableAttributes } from 'svelte/elements';
  import { onMount } from 'svelte';

  // Типы для колонок
  export type Column<T> = {
    key: string;
    header: string;
    sortable?: boolean;
    filterable?: boolean;
    render?: (item: T) => string | number;
    width?: string;
  };

  // Типы для пропсов
  type Props<T> = {
    data: T[];
    columns: Column<T>[];
    caption?: string;
    striped?: boolean;
    bordered?: boolean;
    hoverable?: boolean;
    pageSize?: number;
    enableFiltering?: boolean;
    enableSorting?: boolean;
    enablePagination?: boolean;
  } & HTMLTableAttributes;

  let props: Props<any> = $props();

  // Состояния
  let currentPage = $state(1);
  let sortKey = $state<string | null>(null);
  let sortDirection = $state<'asc' | 'desc'>('asc');
  let filters = $state<Record<string, string>>({});
  let filteredData = $derived(() => {
    let result = [...props.data];

    // Фильтрация
    if (props.enableFiltering) {
      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          result = result.filter(item => {
            const itemValue = String(getNestedValue(item, key)).toLowerCase();
            return itemValue.includes(value.toLowerCase());
          });
        }
      }
    }

    // Сортировка
    if (props.enableSorting && sortKey) {
      result.sort((a, b) => {
        const aValue = getNestedValue(a, sortKey);
        const bValue = getNestedValue(b, sortKey);
        
        // Для строковых значений
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return sortDirection === 'asc' ? comparison : -comparison;
        } 
        // Для числовых значений
        else {
          const comparison = (aValue || 0) - (bValue || 0);
          return sortDirection === 'asc' ? comparison : -comparison;
        }
      });
    }

    // Пагинация
    if (props.enablePagination) {
      const start = (currentPage - 1) * (props.pageSize || 10);
      const end = start + (props.pageSize || 10);
      result = result.slice(start, end);
    }

    return result;
  });

  // Общее количество страниц
  let totalPages = $derived(() => {
    if (!props.enablePagination) return 1;
    const totalItems = props.enableFiltering 
      ? props.data.filter(item => {
          for (const [key, value] of Object.entries(filters)) {
            if (value) {
              const itemValue = String(getNestedValue(item, key)).toLowerCase();
              if (!itemValue.includes(value.toLowerCase())) {
                return false;
              }
            }
          }
          return true;
        }).length
      : props.data.length;
    
    return Math.ceil(totalItems / (props.pageSize || 10));
  });

  // Обработчики событий
  function handleSort(key: string) {
    if (!props.enableSorting) return;
    
    if (sortKey === key) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      sortDirection = 'asc';
    }
  }

  function handleFilterChange(key: string, value: string) {
    if (!props.enableFiltering) return;
    
    filters = { ...filters, [key]: value };
    currentPage = 1; // Сброс на первую страницу при фильтрации
  }

  function handlePageChange(page: number) {
    if (!props.enablePagination) return;
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Навигация по страницам
  let pageNumbers = $derived(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  });

  // Классы для таблицы
  let tableClasses = $derived(`min-w-full divide-y divide-gray-200 ${
    props.striped ? 'divide-gray-100' : ''
  } ${props.class || ''}`);
</script>

<div class="overflow-x-auto">
  <!-- Фильтры -->
  {#if props.enableFiltering}
    <div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
      {#each props.columns as column}
        {#if column.filterable}
          <div>
            <label for="filter-{column.key}" class="block text-sm font-medium text-gray-700 mb-1">
              {column.header}
            </label>
            <input
              id="filter-{column.key}"
              type="text"
              placeholder="Фильтр {column.header}"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              bind:value={filters[column.key]}
              on:input={() => handleFilterChange(column.key, filters[column.key])}
            />
          </div>
        {/if}
      {/each}
    </div>
  {/if}

  <!-- Таблица -->
  <table class={tableClasses} {...$restProps}>
    <caption class="py-3 px-6 text-left text-sm font-medium text-gray-900 bg-gray-50">
      {props.caption}
    </caption>
    <thead class="bg-gray-50">
      <tr>
        {#each props.columns as column}
          <th
            scope="col"
            class="
              px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
              {column.width ? `w-${column.width}` : 'w-auto'}
              {column.sortable ? 'cursor-pointer hover:text-gray-700' : ''}
            "
            class:selected={sortKey === column.key}
            on:click={() => handleSort(column.key)}
          >
            <div class="flex items-center">
              {column.header}
              {#if props.enableSorting && column.sortable}
                {#if sortKey === column.key}
                  {sortDirection === 'asc' 
                    ? ' ↑' 
                    : ' ↓'}
                {:else}
                  {#if column.sortable}
                    <span class="text-gray-300">↕</span>
                  {/if}
                {/if}
              {/if}
            </div>
          </th>
        {/each}
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      {#each filteredData as item (item.id || item[props.columns[0]?.key])}
        <tr class={props.striped && current_index % 2 ? 'bg-gray-50' : ''}>
          {#each props.columns as column}
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {#if column.render}
                {@html column.render(item)}
              {:else}
                {getNestedValue(item, column.key)}
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>

  <!-- Пагинация -->
  {#if props.enablePagination}
    <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          disabled={currentPage <= 1}
          on:click={() => handlePageChange(currentPage - 1)}
        >
          Назад
        </button>
        <button
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          disabled={currentPage >= totalPages}
          on:click={() => handlePageChange(currentPage + 1)}
        >
          Вперед
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Страница <span class="font-medium">{currentPage}</span> из <span class="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              disabled={currentPage <= 1}
              on:click={() => handlePageChange(currentPage - 1)}
            >
              <span>предыдущая</span>
            </button>

            {#each pageNumbers as page}
              {#if page === '...'}
                <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">...</span>
              {:else}
                <button
                  class="relative inline-flex items-center px-4 py-2 text-sm font-semibold 
                  {currentPage === page 
                    ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' 
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'}"
                  on:click={() => handlePageChange(page as number)}
                >
                  {page}
                </button>
              {/if}
            {/each}

            <button
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              disabled={currentPage >= totalPages}
              on:click={() => handlePageChange(currentPage + 1)}
            >
              <span>следующая</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  {/if}
</div>