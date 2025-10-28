<script lang="ts">
  import { setContext } from 'svelte';
  import type { HTMLDivAttributes } from 'svelte/elements';

  type Props = {
    multiple?: boolean; // Разрешить открытие нескольких панелей одновременно
    defaultValue?: string[]; // Значения по умолчанию
    value?: string[]; // Управляемое значение
    onValueChange?: (value: string[]) => void;
    class?: string;
    children?: any;
  } & HTMLDivAttributes;

  let { children, ...props }: Props = $props();

  // Генерируем уникальный ID для контекста
  const accordionId = Math.random().toString(36).substring(2, 9);
  
  // Состояние открытых панелей
  let openPanels = $state<string[]>(props.defaultValue || []);

  // Обработчик изменения состояния панели
  function handleValueChange(panelId: string) {
    let newOpenPanels: string[];
    
    if (props.multiple) {
      // Для множественного выбора переключаем состояние панели
      newOpenPanels = openPanels.includes(panelId)
        ? openPanels.filter(id => id !== panelId)
        : [...openPanels, panelId];
    } else {
      // Для одиночного выбора открываем только одну панель
      newOpenPanels = openPanels.includes(panelId) ? [] : [panelId];
    }

    openPanels = newOpenPanels;
    
    // Вызываем внешний обработчик
    if (props.onValueChange) {
      props.onValueChange(newOpenPanels);
    }
  }

  // Проверяем, открыта ли панель
  function isPanelOpen(panelId: string): boolean {
    return openPanels.includes(panelId);
  }

  // Устанавливаем контекст
  setContext('accordion-context', {
    accordionId,
    isPanelOpen,
    handleValueChange
  });
</script>

<div {...props} class="w-full space-y-2 {props.class || ''}">
  {@render children()}
</div>