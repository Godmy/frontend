# Quick Wins

Быстрые улучшения, которые можно реализовать за 15-30 минут каждое.

## 🚀 Доступные Quick Wins

### 1. Добавить debounce для поиска
**Оценка:** 15 минут | **Статус:** ✅ Завершено

**Описание:**
Добавить debounce для SearchBar компонента, чтобы не выполнять поиск на каждый символ.

**Файлы:**
- `src/lib/utils/debounce.ts` - создать утилиту
- `src/lib/components/ui/SearchBar.svelte` - обновить

**Код:**
```typescript
// src/lib/utils/debounce.ts
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
```

---

### 2. Добавить индикатор сетевого статуса
**Оценка:** 20 минут | **Статус:** ⏳ Не начато

**Описание:**
Показывать баннер когда пользователь offline.

**Файлы:**
- `src/lib/stores/online.store.ts` - создать store
- `src/routes/+layout.svelte` - добавить компонент

**Код:**
```typescript
// src/lib/stores/online.store.ts
let isOnline = $state(navigator.onLine);

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOnline = true;
  });
  window.addEventListener('offline', () => {
    isOnline = false;
  });
}

export const onlineStore = {
  get isOnline() {
    return isOnline;
  }
};
```

---

### 3. Добавить breadcrumbs для навигации
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

---

### 4. Добавить "Empty State" компоненты
**Оценка:** 20 минут | **Статус:** ✅ Завершено

**Описание:**
Компонент для отображения когда нет данных.

**Файлы:**
- `src/lib/components/ui/EmptyState.svelte`

**Код:**
```svelte
<script lang="ts">
  type Props = {
    title: string;
    description?: string;
    icon?: import('svelte').Snippet;
    action?: {
      label: string;
      onClick: () => void;
    };
  };

  let { title, description, icon, action }: Props = $props();
</script>

<div class="text-center py-12">
  {#if icon}
    <div class="mx-auto h-12 w-12 text-gray-400">
      {@render icon()}
    </div>
  {/if}
  <h3 class="mt-2 text-sm font-medium text-gray-900">{title}</h3>
  {#if description}
    <p class="mt-1 text-sm text-gray-500">{description}</p>
  {/if}
  {#if action}
    <div class="mt-6">
      <button
        type="button"
        onclick={action.onClick}
        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        {action.label}
      </button>
    </div>
  {/if}
</div>
```

---

### 5. Добавить кнопку "Copy to Clipboard"
**Оценка:** 15 минут | **Статус:** ✅ Завершено

**Описание:**
Утилита и компонент для копирования текста в буфер обмена.

**Файлы:**
- `src/lib/utils/clipboard.ts`
- `src/lib/components/ui/CopyButton.svelte`

**Код:**
```typescript
// src/lib/utils/clipboard.ts
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}
```

```svelte
<!-- CopyButton.svelte -->
<script lang="ts">
  import { copyToClipboard } from '$lib/utils/clipboard';
  import { notificationStore } from '$lib/stores/notification.store';

  type Props = {
    text: string;
    label?: string;
  };

  let { text, label = 'Copy' }: Props = $props();
  let copied = $state(false);

  async function handleCopy() {
    const success = await copyToClipboard(text);
    if (success) {
      copied = true;
      notificationStore.success('Copied to clipboard');
      setTimeout(() => (copied = false), 2000);
    }
  }
</script>

<button
  type="button"
  onclick={handleCopy}
  class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
>
  {#if copied}
    <svg class="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
    </svg>
    Copied!
  {:else}
    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
    {label}
  {/if}
</button>
```

---

### 6. Добавить Badge компонент
**Оценка:** 10 минут | **Статус:** ✅ Завершено

**Описание:**
Компонент для отображения статусов, меток, категорий.

**Файлы:**
- `src/lib/components/ui/Badge.svelte`

**Код:**
```svelte
<script lang="ts">
  type Props = {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md' | 'lg';
    children?: import('svelte').Snippet;
  };

  let { variant = 'default', size = 'md', children }: Props = $props();

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };
</script>

<span class="inline-flex items-center font-medium rounded-full {variantClasses[variant]} {sizeClasses[size]}">
  {#if children}
    {@render children()}
  {/if}
</span>
```

---

### 7. Добавить Avatar компонент
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

---

### 8. Добавить Tooltip компонент
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

---

### 9. Добавить форматирование дат
**Оценка:** 15 минут | **Статус:** ✅ Завершено

**Описание:**
Утилиты для форматирования дат.

**Файлы:**
- `src/lib/utils/date.ts`

**Код:**
```typescript
export function formatDate(
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'relative' = 'medium'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'relative') {
    return formatRelativeTime(d);
  }

  const options: Intl.DateTimeFormatOptions =
    format === 'short'
      ? { year: 'numeric', month: '2-digit', day: '2-digit' }
      : format === 'medium'
      ? { year: 'numeric', month: 'short', day: 'numeric' }
      : { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

  return new Intl.DateTimeFormat('en-US', options).format(d);
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  return formatDate(date, 'short');
}
```

---

### 10. Добавить localStorage utilities
**Оценка:** 10 минут | **Статус:** ✅ Завершено

**Описание:**
Type-safe утилиты для работы с localStorage.

**Файлы:**
- `src/lib/utils/storage.ts`

**Код:**
```typescript
export const storage = {
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.clear();
  }
};
```

---

## Выполненные Quick Wins

### ✅ 4. Empty State компонент
**Статус:** ✅ Завершено (2025-01-21)
**Файлы:** `src/lib/components/ui/EmptyState.svelte`

### ✅ 5. Copy to Clipboard
**Статус:** ✅ Завершено (2025-01-21)
**Файлы:**
- `src/lib/utils/clipboard.ts`
- `src/lib/components/ui/CopyButton.svelte`

### ✅ 6. Badge компонент
**Статус:** ✅ Завершено (2025-01-21)
**Файлы:** `src/lib/components/ui/Badge.svelte`

### ✅ 1. Debounce для поиска
**Статус:** ✅ Завершено (2025-01-21)
**Файлы:**
- `src/lib/utils/debounce.ts`
- `src/lib/components/ui/SearchBar.svelte` (обновлен)

### ✅ 9. Форматирование дат
**Статус:** ✅ Завершено (2025-01-21)
**Файлы:** `src/lib/utils/date.ts`

### ✅ 10. localStorage utilities
**Статус:** ✅ Завершено (2025-01-21)
**Файлы:** `src/lib/utils/storage.ts`

### ✅ 11. Добавить Button компонент
**Статус:** ✅ Завершено (есть в формах)

### ✅ 12. Добавить Modal компонент
**Статус:** ✅ Завершено (Priority 2)

### ✅ 13. Добавить Loading states
**Статус:** ✅ Завершено (Priority 2)

---

## Приоритизация

**Высокий приоритет (делать первыми):**
1. Copy to Clipboard (#5) - полезно для многих мест
2. Badge (#6) - нужен для статусов
3. Empty State (#4) - улучшит UX когда нет данных
4. Debounce для поиска (#1) - улучшит производительность

**Средний приоритет:**
5. localStorage utilities (#10) - полезно для настроек
6. Форматирование дат (#9) - нужно для отображения
7. Offline indicator (#2) - полезно, но не критично
8. Avatar (#7) - для будущего профиля пользователя

**Низкий приоритет:**
9. Breadcrumbs (#3) - можно отложить
10. Tooltip (#8) - nice to have

---

## Как добавить Quick Win

1. Выберите задачу из списка
2. Создайте необходимые файлы
3. Скопируйте код из примера
4. Обновите exports в `src/lib/components/ui/index.ts`
5. Протестируйте компонент
6. Отметьте как завершенное
