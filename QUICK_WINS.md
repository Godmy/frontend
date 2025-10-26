# Quick Wins

Быстрые улучшения, которые можно реализовать за 15-30 минут каждое и которые дадут максимальный эффект проекту.

## 🚀 Доступные Quick Wins

### 1. Добавить систему логирования ошибок с Sentry
**Оценка:** 20 минут | **Статус:** ⏳ Не начато

**Описание:**
Интеграция Sentry для мониторинга ошибок в реальном времени.

**Файлы:**
- `src/lib/utils/errorReporting.ts` - создать утилиту для отправки ошибок в Sentry
- `vite.config.ts` - обновить конфигурацию для поддержки Sentry

**Причина высокого приоритета:** 
- Позволит быстро обнаруживать и исправлять ошибки в production
- Улучшит стабильность приложения
- Сократит время на диагностику проблем

---

### 2. Добавить прогресс индикатор загрузки страниц
**Оценка:** 15 минут | **Статус:** ⏳ Не начато

**Описание:**
Реализовать глобальный progress bar для показа загрузки страниц.

**Файлы:**
- `src/routes/+layout.svelte` - добавить компонент прогресса
- `src/lib/components/ui/ProgressBar.svelte` - обновить/улучшить компонент

**Причина высокого приоритета:**
- Улучшит UX за счет визуальной обратной связи
- Сделает приложение более отзывчивым
- Пользователь будет понимать, что происходит загрузка

---

### 3. Добавить систему поиска по онтологиям
**Оценка:** 25 минут | **Статус:** ⏳ Не начато

**Описание:**
Реализовать глобальный поиск по всем концепциям, словарям и языкам.

**Файлы:**
- `src/lib/components/ui/SearchModal.svelte` - создать модальное окно поиска
- `src/lib/stores/searchStore.svelte.ts` - создать store для поиска

**Причина высокого приоритета:**
- Критически важно для навигации по большим онтологиям
- Улучшит доступность информации
- Сократит время поиска нужных элементов

---

### 4. Добавить тёмную тему
**Оценка:** 25 минут | **Статус:** ⏳ Не начато

**Описание:**
Реализовать поддержку тёмной темы с автоматическим переключением.

**Файлы:**
- `src/app.css` - добавить CSS переменные для тёмной темы
- `src/lib/stores/themeStore.svelte.ts` - создать store для управления темой
- `src/routes/+layout.svelte` - добавить переключатель темы

**Причина высокого приоритета:**
- Улучшит UX для пользователей, предпочитающих тёмную тему
- Современный стандарт для веб-приложений
- Повысит доступность и комфорт использования

---

### 5. Добавить keyboard navigation
**Оценка:** 20 минут | **Статус:** ⏳ Не начато

**Описание:**
Реализовать навигацию с клавиатуры для основных элементов интерфейса.

**Файлы:**
- `src/lib/utils/keyboardNavigation.ts` - улучшить существующую утилиту
- `src/lib/components/ui/Dropdown.svelte` - добавить keyboard support
- `src/lib/components/ui/Modal.svelte` - улучшить accessibility

**Причина высокого приоритета:**
- Улучшит доступность (accessibility)
- Совместимость с WCAG стандартами
- Повысит UX для продвинутых пользователей

---

### 6. Добавить систему hotkeys
**Оценка:** 20 минут | **Статус:** ⏳ Не начато

**Описание:**
Реализовать систему горячих клавиш для частых действий.

**Файлы:**
- `src/lib/utils/hotkeys.ts` - улучшить существующую утилиту
- `src/routes/+layout.svelte` - добавить панель справки по горячим клавишам

**Причина высокого приоритета:**
- Улучшит продуктивность продвинутых пользователей
- Современная фича для productivity приложений
- Упростит выполнение частых операций

---

### 7. Добавить breadcrumbs для навигации
**Оценка:** 25 минут | **Статус:** ⏳ Не начато

**Описание:**
Создать компонент breadcrumbs для отображения текущего пути.

**Файлы:**
- `src/lib/components/ui/Breadcrumbs.svelte` - создать компонент

**Пример:**
```svelte
<script lang="ts">
  type Crumb = {
    label: string;
    href?: string;
  };

  type Props = {
    crumbs: Crumb[];
  };

  let { crumbs }: Props = $props();
</script>

<nav aria-label="Breadcrumb">
  <ol class="flex items-center space-x-2 text-sm">
    {#each crumbs as crumb, i}
      <li class="flex items-center">
        {#if i > 0}
          <svg class="h-5 w-5 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
          </svg>
        {/if}
        {#if crumb.href && i < crumbs.length - 1}
          <a href={crumb.href} class="text-gray-500 hover:text-gray-700">
            {crumb.label}
          </a>
        {:else}
          <span class="text-gray-900 font-medium">{crumb.label}</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
```

**Причина среднего приоритета:**
- Улучшит навигацию по системе
- Полезно для понимания иерархии онтологий
- Удобство использования

---

### 8. Добавить Avatar компонент
**Оценка:** 15 минут | **Статус:** ⏳ Не начато

**Описание:**
Компонент для отображения аватаров пользователей.

**Файлы:**
- `src/lib/components/ui/Avatar.svelte`

**Код:**
```svelte
<script lang="ts">
  type Props = {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  };

  let { src, alt = '', fallback, size = 'md' }: Props = $props();

  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl'
  };

  let imageError = $state(false);
  const initials = $derived(
    fallback
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  );
</script>

<div class="inline-block {sizeClasses[size]} rounded-full overflow-hidden bg-gray-200">
  {#if src && !imageError}
    <img
      {src}
      {alt}
      class="h-full w-full object-cover"
      onerror={() => (imageError = true)}
    />
  {:else}
    <div class="h-full w-full flex items-center justify-center bg-indigo-600 text-white font-medium">
      {initials}
    </div>
  {/if}
</div>
```

**Причина среднего приоритета:**
- Подготовка к системе профилей пользователей
- Улучшит UX при добавлении мульти-пользовательского функционала

---

### 9. Добавить Tooltip компонент
**Оценка:** 25 минут | **Статус:** ⏳ Не начато

**Описание:**
Всплывающие подсказки для элементов интерфейса.

**Файлы:**
- `src/lib/components/ui/Tooltip.svelte`

**Код:**
```svelte
<script lang="ts">
  type Props = {
    text: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    children: import('svelte').Snippet;
  };

  let { text, position = 'top', children }: Props = $props();
  let showTooltip = $state(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };
</script>

<div class="relative inline-block">
  <div
    onmouseenter={() => (showTooltip = true)}
    onmouseleave={() => (showTooltip = false)}
    onfocus={() => (showTooltip = true)}
    onblur={() => (showTooltip = false)}
  >
    {@render children()}
  </div>

  {#if showTooltip}
    <div
      class="absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap {positionClasses[position]}"
      role="tooltip"
    >
      {text}
      <div class="absolute w-2 h-2 bg-gray-900 transform rotate-45"></div>
    </div>
  {/if}
</div>
```

**Причина среднего приоритета:**
- Улучшит UX за счет контекстных подсказок
- Повысит доступность интерфейса

---

### 10. Добавить Button компонент с вариациями
**Оценка:** 20 минут | **Статус:** ⏳ Не начато

**Описание:**
Универсальный Button компонент с различными стилями и состояниями.

**Файлы:**
- `src/lib/components/ui/Button.svelte`

**Код:**
```svelte
<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  
  type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'link';
  type ButtonSize = 'sm' | 'md' | 'lg';

  type Props = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    block?: boolean;
  } & HTMLButtonAttributes;

  let props: Props = $props();

  $: variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300',
    link: 'bg-transparent hover:bg-gray-100 text-indigo-600 underline'
  }[props.variant || 'primary'];

  $: sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }[props.size || 'md'];

  $: disabledClass = props.disabled || props.loading
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : '';

  $: blockClass = props.block ? 'w-full' : '';

  $: classes = `inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${variantClasses} ${sizeClasses} ${disabledClass} ${blockClass}`;
</script>

<button {...props} class={classes}>
  {#if props.loading}
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    {#if $slots.default}
      {@render children()}
    {:else}
      Loading...
    {/if}
  {:else}
    {@render children()}
  {/if}
</button>
```

**Причина высокого приоритета:**
- Базовый компонент, используется повсеместно
- Унифицирует стили кнопок по всему приложению
- Упростит дальнейшую разработку

---

### 11. Добавить Alert компонент
**Оценка:** 15 минут | **Статус:** ⏳ Не начато

**Описание:**
Компонент для отображения важных сообщений пользователю.

**Файлы:**
- `src/lib/components/ui/Alert.svelte`

**Код:**
```svelte
<script lang="ts">
  type AlertVariant = 'info' | 'success' | 'warning' | 'error';
  
  type Props = {
    variant?: AlertVariant;
    title?: string;
    closable?: boolean;
    icon?: boolean;
  };
  
  let { variant = 'info', title, closable = false, icon = true }: Props = $props();
  let open = $state(true);

  $: iconComponent = {
    info: `<svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>`,
    success: `<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>`,
    warning: `<svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>`,
    error: `<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>`
  }[variant];

  $: bgColor = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200'
  }[variant];

  $: textColor = {
    info: 'text-blue-800',
    success: 'text-green-800',
    warning: 'text-yellow-800',
    error: 'text-red-800'
  }[variant];
</script>

{#if open}
  <div class={`rounded-md border p-4 ${bgColor} ${textColor}`}>
    <div class="flex">
      <div class="flex-shrink-0">
        {@html icon ? iconComponent : ''}
      </div>
      <div class="ml-3">
        {#if title}
          <h3 class="text-sm font-medium">{title}</h3>
        {/if}
        <div class="mt-2 text-sm">
          <p>
            {@render children()}
          </p>
        </div>
      </div>
      {#if closable}
        <div class="ml-auto pl-3">
          <button
            type="button"
            class={`-mx-1.5 -my-1.5 rounded-md p-1.5 focus:outline-none focus:ring-2 ${textColor.replace('text-', 'focus:ring-').replace('-', '-')} ${textColor.replace('text-', 'hover:bg-').replace('-', '-')}`}
            aria-label="Close"
            onclick={() => (open = false)}
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}
```

**Причина высокого приоритета:**
- Для отображения важных сообщений пользователю
- Улучшит UX за счет структурированных сообщений об ошибках/успехе
- Обеспечит единообразие в отображении уведомлений

---

### 12. Добавить Input Field компонент с лейблом
**Оценка:** 20 минут | **Статус:** ⏳ Не начато

**Описание:**
Компонент Input с встроенным лейблом и индикатором ошибки.

**Файлы:**
- `src/lib/components/ui/InputField.svelte`

**Код:**
```svelte
<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import Input from './Input.svelte';

  type Props = {
    label?: string;
    error?: string;
    required?: boolean;
  } & HTMLInputAttributes;
  
  let { label, error, required, ...rest } = $props();
</script>

<div class="mb-4">
  {#if label}
    <label for={rest.id} class="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}
  
  <Input 
    {...rest} 
    class={`w-full {error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} ${(rest.class as string) || ''}`} 
  />
  
  {#if error}
    <p class="mt-1 text-sm text-red-600">{error}</p>
  {/if}
</div>
```

**Причина высокого приоритета:**
- Упростит создание форм
- Улучшит UX за счет структурированных полей ввода
- Унифицирует отображение ошибок форм

---

## Приоритизация

**Критический приоритет (делать первыми - максимальный эффект):**
1. Button (#10) - базовый компонент, используется повсеместно
2. Alert (#11) - для отображения важных сообщений
3. Input Field (#12) - улучшает UX форм
4. Система логирования с Sentry (#1) - критично для стабильности

**Высокий приоритет (создают значительный эффект):**
5. Прогресс индикатор загрузки (#2) - улучшает UX
6. Темная тема (#4) - современный стандарт, улучшает UX
7. Keyboard navigation (#5) - улучшает доступность
8. Hotkeys (#6) - улучшает продуктивность

**Средний приоритет (полезные улучшения):**
9. Search система (#3) - улучшает навигацию по онтологиям
10. Breadcrumbs (#7) - улучшает навигацию
11. Avatar (#8) - для будущего профильного функционала
12. Tooltip (#9) - nice to have

---

## Как добавить Quick Win

1. Выберите задачу из списка
2. Создайте необходимые файлы
3. Скопируйте код из примера
4. Обновите exports в `src/lib/components/ui/index.ts`
5. Протестируйте компонент
6. Отметьте как завершенное
