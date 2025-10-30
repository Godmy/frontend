<script lang="ts">
  import type { HTMLDivAttributes } from 'svelte/elements';

  // Типы для колонок
  export type ColumnConfig = {
    key: string;
    header: string;
    visible: boolean;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
  };

  // Типы для пропсов
  type Props = {
    columns: ColumnConfig[];
    onColumnsChange?: (columns: ColumnConfig[]) => void;
  } & HTMLDivAttributes;

  let props: Props = $props();

  // Локальное состояние колонок
  let localColumns = $state<ColumnConfig[]>([]);

  // Инициализация локального состояния
  $effect(() => {
    localColumns = [...props.columns];
  });

  // Обработчики
  function toggleColumnVisibility(index: number) {
    localColumns[index] = { ...localColumns[index], visible: !localColumns[index].visible };
    if (props.onColumnsChange) {
      props.onColumnsChange(localColumns);
    }
  }

  function moveColumn(fromIndex: number, toIndex: number) {
    const newColumns = [...localColumns];
    const [movedItem] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, movedItem);
    localColumns = newColumns;
    if (props.onColumnsChange) {
      props.onColumnsChange(localColumns);
    }
  }

  function resetToDefault() {
    // Восстанавливаем видимость по умолчанию
    const resetColumns = props.columns.map(col => ({
      ...col,
      visible: true // Устанавливаем все колонки как видимые по умолчанию
    }));
    localColumns = resetColumns;
    if (props.onColumnsChange) {
      props.onColumnsChange(resetColumns);
    }
  }
</script>

<div class="column-manager bg-white rounded-lg shadow p-4 {props.class || ''}" {...$restProps}>
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-lg font-medium text-gray-900">Настройка колонок</h3>
    <button
      class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      on:click={resetToDefault}
    >
      Сбросить
    </button>
  </div>

  <div class="border border-gray-200 rounded-md divide-y divide-gray-200">
    {#each localColumns as column, index}
      <div class="flex items-center justify-between p-3 hover:bg-gray-50">
        <div class="flex items-center">
          <button
            class="mr-2 cursor-move"
            title="Перетащить"
            aria-label="Перетащить колонку {column.header}"
          >
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0V20m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
          
          <input
            type="checkbox"
            id="column-{index}"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            bind:group={localColumns[index].visible}
            on:change={() => toggleColumnVisibility(index)}
          />
          <label for="column-{index}" class="ml-2 block text-sm text-gray-900">
            {column.header}
          </label>
        </div>

        <div class="flex space-x-2">
          <button
            class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled={index === 0}
            on:click={() => moveColumn(index, index - 1)}
            title="Переместить вверх"
            aria-label="Переместить колонку вверх"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled={index === localColumns.length - 1}
            on:click={() => moveColumn(index, index + 1)}
            title="Переместить вниз"
            aria-label="Переместить колонку вниз"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    {/each}
  </div>

  <div class="mt-4 text-sm text-gray-500">
    <p>Всего колонок: {localColumns.length}</p>
    <p>Видимых колонок: {localColumns.filter(col => col.visible).length}</p>
  </div>
</div>