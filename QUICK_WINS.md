# Quick Wins

Быстрые улучшения, которые можно реализовать за 15-30 минут каждое.

## 🚀 Доступные Quick Wins

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

## Приоритизация

**Высокий приоритет (делать первыми):**
1. Breadcrumbs (#3) - улучшит навигацию
2. Avatar (#7) - для будущего профиля пользователя

**Низкий приоритет:**
3. Tooltip (#8) - nice to have

---

## Как добавить Quick Win

1. Выберите задачу из списка
2. Создайте необходимые файлы
3. Скопируйте код из примера
4. Обновите exports в `src/lib/components/ui/index.ts`
5. Протестируйте компонент
6. Отметьте как завершенное
