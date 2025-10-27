<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$lib/utils/i18n';
  import HumanOntologyTree from '$lib/components/ontology/HumanOntologyTree.svelte';
  import type { DomainConcept } from '$lib/api/domain-concepts';
  import { Search, AlertCircle, Database, Layers } from 'lucide-svelte';

  // Получаем данные из page data
  const data = $derived($page.data);
  const trans = $derived(data.translations || {});
  const rootConcepts = $derived<DomainConcept[]>(data.rootConcepts || []);
  const error = $derived(data.error);

  // State для поиска и выбранного концепта
  let searchQuery = $state('');
  let selectedConcept = $state<DomainConcept | null>(null);
  let expandedCount = $state(0);

  // Обработчик выбора концепта
  function handleConceptSelect(concept: DomainConcept) {
    selectedConcept = concept;
    console.log('Selected concept:', concept);
  }

  // Получить название концепта
  function getConceptName(concept: DomainConcept) {
    return concept.dictionaries.find(d => d.language.code === 'ru')?.name || concept.path;
  }

  // Подсчет количества раскрытых узлов
  $effect(() => {
    // Здесь можно добавить логику подсчета
  });
</script>

<svelte:head>
  <title>Онтология аттракторов человека | Visualization</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <!-- Заголовок -->
  <div class="mb-8">
    <div class="flex items-center gap-3 mb-2">
      <Database class="w-8 h-8 text-indigo-600" />
      <h1 class="text-3xl font-bold text-gray-900">
        Онтология аттракторов человека
      </h1>
    </div>
    <p class="text-gray-600">
      Иерархическая структура ~11,000-15,000 концептов физиологических аттракторов человеческого организма
    </p>
  </div>

  <!-- Ошибка загрузки -->
  {#if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
      <AlertCircle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div>
        <h3 class="font-medium text-red-900 mb-1">Ошибка загрузки данных</h3>
        <p class="text-sm text-red-700">{error}</p>
        <p class="text-sm text-red-600 mt-2">
          Убедитесь, что backend запущен и база данных проинициализирована.
        </p>
      </div>
    </div>
  {/if}

  <!-- Статистика -->
  {#if rootConcepts.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-indigo-600">Основных категорий</p>
            <p class="text-2xl font-bold text-indigo-900">{rootConcepts.length}</p>
          </div>
          <Layers class="w-8 h-8 text-indigo-600 opacity-50" />
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-purple-600">Всего концептов</p>
            <p class="text-2xl font-bold text-purple-900">~11,000-15,000</p>
          </div>
          <Database class="w-8 h-8 text-purple-600 opacity-50" />
        </div>
      </div>

      <div class="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-pink-600">Максимальная глубина</p>
            <p class="text-2xl font-bold text-pink-900">10+ уровней</p>
          </div>
          <Layers class="w-8 h-8 text-pink-600 opacity-50" />
        </div>
      </div>
    </div>
  {/if}

  <!-- Поиск (TODO: реализовать функциональность поиска) -->
  <div class="mb-6">
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Поиск по онтологии... (в разработке)"
        bind:value={searchQuery}
        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        disabled
      />
    </div>
  </div>

  <!-- Дерево онтологии -->
  <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
    <!-- Заголовок блока -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
      <h2 class="text-xl font-semibold">Иерархия аттракторов</h2>
      <p class="text-sm text-indigo-100 mt-1">
        Нажмите на стрелку, чтобы раскрыть подкатегории
      </p>
    </div>

    <!-- Дерево -->
    <div class="p-6 max-h-[800px] overflow-y-auto">
      {#if rootConcepts.length === 0 && !error}
        <div class="text-center py-12">
          <Database class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500 mb-2">Загрузка онтологии...</p>
          <p class="text-sm text-gray-400">Пожалуйста, подождите</p>
        </div>
      {:else}
        <div class="space-y-1">
          {#each rootConcepts as concept (concept.id)}
            <HumanOntologyTree
              {concept}
              languageCode="ru"
              onSelect={handleConceptSelect}
            />
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Информация о выбранном концепте -->
  {#if selectedConcept}
    <div class="mt-6 bg-indigo-50 rounded-lg border border-indigo-200 p-6">
      <h3 class="text-lg font-semibold text-indigo-900 mb-3">
        Выбранный концепт
      </h3>
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <dt class="text-sm font-medium text-indigo-600">Название</dt>
          <dd class="text-gray-900 mt-1">{getConceptName(selectedConcept)}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-indigo-600">Путь</dt>
          <dd class="text-gray-900 mt-1 font-mono text-sm">{selectedConcept.path}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-indigo-600">ID</dt>
          <dd class="text-gray-900 mt-1">{selectedConcept.id}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-indigo-600">Глубина</dt>
          <dd class="text-gray-900 mt-1">Уровень {selectedConcept.depth}</dd>
        </div>
      </dl>
    </div>
  {/if}

  <!-- Описание категорий -->
  <div class="mt-8 bg-gray-50 rounded-lg border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      7 основных категорий аттракторов
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <h4 class="font-medium text-gray-900 mb-1">1. Точечные аттракторы</h4>
        <p class="text-sm text-gray-600">4000-5000 концептов</p>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <h4 class="font-medium text-gray-900 mb-1">2. Периодические аттракторы</h4>
        <p class="text-sm text-gray-600">100-135 концептов</p>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <h4 class="font-medium text-gray-900 mb-1">3. Квазипериодические</h4>
        <p class="text-sm text-gray-600">210-255 концептов</p>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <h4 class="font-medium text-gray-900 mb-1">4. Странные (хаотические)</h4>
        <p class="text-sm text-gray-600">400-450 концептов</p>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <h4 class="font-medium text-gray-900 mb-1">5. Переходные процессы</h4>
        <p class="text-sm text-gray-600">1500-1800 концептов</p>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <h4 class="font-medium text-gray-900 mb-1">6. Межсистемные взаимодействия</h4>
        <p class="text-sm text-gray-600">3000-3500 концептов</p>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <h4 class="font-medium text-gray-900 mb-1">7. Интегративные функции</h4>
        <p class="text-sm text-gray-600">2500-3000 концептов</p>
      </div>
    </div>
  </div>
</div>
