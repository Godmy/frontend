<script lang="ts">
  // Компонент Tabs теперь будет реализован в новой структуре
  // Пока создадим базовый компонент для обратной совместимости
  
  import { getContext, setContext } from 'svelte';
  import type { HTMLDivAttributes } from 'svelte/elements';

  type Props = {
    selectedId?: string;
    onTabChange?: (value: string[]) => void;
    class?: string;
    children?: any;
  } & HTMLDivAttributes;

  let { children, ...props }: Props = $props();

  // Unique ID для контекста
  const tabsId = Math.random().toString(36).substring(2, 9);
  
  // Состояние активной вкладки
  let selectedTabId = $state<string>(props.selectedId || '');
  
  // Все доступные вкладки
  let tabs = $state<string[]>([]);
  
  // Обработчик изменения вкладки
  function handleTabChange(id: string) {
    selectedTabId = id;
    if (props.onTabChange) {
      props.onTabChange(id);
    }
  }

  // Регистрация вкладки
  function registerTab(id: string) {
    if (!tabs.includes(id)) {
      tabs = [...tabs, id];
      // Если это первая вкладка и selectedId не задан, делаем её активной
      if (tabs.length === 1 && !props.selectedId) {
        selectedTabId = id;
      }
    }
  }
  
  // Отмена регистрации вкладки
  function unregisterTab(id: string) {
    tabs = tabs.filter(tabId => tabId !== id);
  }

  // Устанавливаем контекст
  setContext('tabs-context', {
    tabsId,
    selectedTabId,
    registerTab,
    unregisterTab,
    handleTabChange
  });
</script>

<div {...props} class="w-full {props.class || ''}">
  {@render children()}
</div>