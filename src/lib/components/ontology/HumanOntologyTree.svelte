<script lang="ts">
  import { getChildConcepts, type DomainConcept } from '$lib/api/domain-concepts';
  import { ChevronRight, ChevronDown, Loader2 } from 'lucide-svelte';

  // Props
  let { concept, languageCode = 'ru', onSelect = null }: {
    concept: DomainConcept;
    languageCode?: string;
    onSelect?: ((concept: DomainConcept) => void) | null;
  } = $props();

  // State
  let isExpanded = $state(false);
  let children = $state<DomainConcept[]>([]);
  let isLoading = $state(false);
  let error = $state<string | null>(null);

  // Получаем название на текущем языке
  const getName = (c: DomainConcept) => {
    const dict = c.dictionaries.find(d => d.language.code === languageCode);
    return dict?.name || c.path;
  };

  // Получаем описание (если есть)
  const getDescription = (c: DomainConcept) => {
    const dict = c.dictionaries.find(d => d.language.code === languageCode);
    if (!dict?.description) return null;

    try {
      const parsed = JSON.parse(dict.description);
      if (parsed.min !== undefined && parsed.max !== undefined) {
        return `(${parsed.min}-${parsed.max})`;
      }
    } catch (e) {
      // Если не JSON, просто вернем как есть
      return dict.description;
    }

    return null;
  };

  // Загрузка дочерних элементов
  async function toggleExpand() {
    if (!isExpanded && children.length === 0) {
      // Загружаем дочерние элементы при первом раскрытии
      isLoading = true;
      error = null;

      try {
        children = await getChildConcepts(concept.id, languageCode);
      } catch (e) {
        error = 'Ошибка загрузки';
        console.error('Failed to load children:', e);
      } finally {
        isLoading = false;
      }
    }

    isExpanded = !isExpanded;
  }

  // Обработка выбора концепта
  function handleSelect() {
    if (onSelect) {
      onSelect(concept);
    }
  }
</script>

<div class="concept-node" style="margin-left: {concept.depth * 20}px">
  <!-- Заголовок концепта -->
  <div class="concept-header flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors">
    <!-- Кнопка раскрытия/сворачивания -->
    <button
      onclick={toggleExpand}
      class="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
      disabled={isLoading}
    >
      {#if isLoading}
        <Loader2 class="w-4 h-4 animate-spin" />
      {:else if isExpanded}
        <ChevronDown class="w-4 h-4" />
      {:else}
        <ChevronRight class="w-4 h-4" />
      {/if}
    </button>

    <!-- Информация о концепте -->
    <div class="flex-1 min-w-0" onclick={handleSelect}>
      <div class="flex items-baseline gap-2 flex-wrap">
        <!-- Путь (ID) -->
        <span class="text-xs font-mono text-gray-400">{concept.path}</span>

        <!-- Название -->
        <span class="font-medium text-gray-900">{getName(concept)}</span>

        <!-- Характеристики (если есть) -->
        {#if getDescription(concept)}
          <span class="text-sm text-gray-500">{getDescription(concept)}</span>
        {/if}
      </div>
    </div>

    <!-- Индикатор глубины -->
    <span class="text-xs text-gray-400 flex-shrink-0">
      Уровень {concept.depth}
    </span>
  </div>

  <!-- Ошибка загрузки -->
  {#if error}
    <div class="ml-8 text-sm text-red-600 py-1">
      {error}
    </div>
  {/if}

  <!-- Дочерние элементы -->
  {#if isExpanded && children.length > 0}
    <div class="concept-children ml-2">
      {#each children as child (child.id)}
        <svelte:self concept={child} {languageCode} {onSelect} />
      {/each}
    </div>
  {/if}

  <!-- Сообщение об отсутствии детей -->
  {#if isExpanded && children.length === 0 && !isLoading && !error}
    <div class="ml-8 text-sm text-gray-400 py-1 italic">
      Нет подкатегорий
    </div>
  {/if}
</div>

<style>
  .concept-node {
    transition: all 0.2s ease;
  }

  .concept-header:hover {
    background-color: rgba(99, 102, 241, 0.05);
  }
</style>
