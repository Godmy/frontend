<script lang="ts">
  import { searchStore } from '$lib/stores/searchStore.svelte';
  import { onMount, createEventDispatcher } from 'svelte';
  import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp.svelte';
  
  const dispatch = createEventDispatcher();

  // Кэшируем значение store для использования в шаблоне
  $: query = searchStore.query;
  $: results = searchStore.results;
  $: isLoading = searchStore.isLoading;
  $: isOpen = searchStore.isOpen;

  let searchInput: HTMLInputElement;

  // Обработка клавиатурных сокращений
  function handleKeyDown(e: KeyboardEvent) {
    // ESC для закрытия модального окна
    if (e.key === 'Escape') {
      searchStore.close();
    }
    
    // Возврат в начало списка результатов по Ctrl+Home
    if (e.ctrlKey && e.key === 'Home') {
      e.preventDefault();
      const firstResult = document.querySelector('.search-result');
      if (firstResult) {
        (firstResult as HTMLElement).focus();
      }
    }
  }

  // Фокус на поле ввода при открытии
  $: if (isOpen && searchInput) {
    searchInput.focus();
  }

  // Обработка закрытия при клике вне области модального окна
  function handleBackdropClick(e: Event) {
    if (e.target === e.currentTarget) {
      searchStore.close();
    }
  }

  onMount(() => {
    // Глобальный обработчик для клавиатурных сокращений
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Cmd+K или Ctrl+K для открытия поиска
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchStore.open();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  });
</script>

{#if isOpen}
  <div 
    class="fixed inset-0 z-50 overflow-y-auto"
    on:keydown={handleKeyDown}
    on:click={handleBackdropClick}
  >
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-xl transition-all dark:bg-gray-800">
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <input
            bind:this={searchInput}
            type="text"
            placeholder="Поиск по онтологиям... (Cmd+K)"
            class="block w-full rounded-t-lg border-0 py-4 pl-10 pr-4 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 sm:text-sm sm:leading-6"
            value={query}
            on:input={(e) => searchStore.search((e.target as HTMLInputElement).value)}
          />
          
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <kbd class="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-sans text-gray-600 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300">ESC</kbd>
          </div>
        </div>
        
        {#if isLoading}
          <div class="flex items-center justify-center p-8">
            <div class="flex items-center">
              <svg class="animate-spin h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="ml-2">Поиск...</span>
            </div>
          </div>
        {:else}
          {#if results.length > 0}
            <ul class="max-h-96 overflow-y-auto">
              {#each results as result, i}
                <li class="search-result border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <a
                    href={result.url}
                    class="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    on:click={() => searchStore.close()}
                  >
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        {#if result.type === 'concept'}
                          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                        {:else if result.type === 'dictionary'}
                          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        {:else if result.type === 'language'}
                          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                          </div>
                        {/if}
                      </div>
                      
                      <div class="ml-4">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">{result.title}</h3>
                        {#if result.description}
                          <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">{result.description}</p>
                        {/if}
                        {#if result.path}
                          <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">{result.path}</p>
                        {/if}
                      </div>
                    </div>
                  </a>
                </li>
              {/each}
            </ul>
          {:else if query && query.length > 0}
            <div class="p-8 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">Результатов не найдено</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Мы не смогли найти ничего по запросу "{query}"
              </p>
            </div>
          {:else}
            <div class="p-8 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">Поиск по онтологиям</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Введите поисковый запрос для поиска концепций, словарей и языков
              </p>
              <div class="mt-4 flex justify-center">
                <div class="inline-flex items-center rounded-md bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  <kbd class="mr-1 font-sans">Cmd</kbd>
                  <span>+</span>
                  <kbd class="ml-1 font-sans">K</kbd>
                  <span class="mx-1">или</span>
                  <kbd class="font-sans">Ctrl</kbd>
                  <span>+</span>
                  <kbd class="ml-1 font-sans">K</kbd>
                </div>
              </div>
            </div>
          {/if}
        {/if}
        
        <div class="border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-700">
          <div class="flex items-center justify-between">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              Нажмите Enter для выбора, стрелки для навигации
            </div>
            <KeyboardShortcutsHelp />
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}