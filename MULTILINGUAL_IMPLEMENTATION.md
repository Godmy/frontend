# Multilingual Implementation Plan

## Анализ готовности архитектуры ✅

### Что уже есть в архитектуре:

#### 1. GraphQL Schema (ГОТОВО ✅)
```graphql
# Query с поддержкой фильтрации по языку
dictionaries(conceptId: Int = null, languageId: Int = null): [Dictionary!]!

# Модель данных
type Dictionary {
  id: Int!
  name: String!           # Название на конкретном языке
  description: String     # Описание на конкретном языке
  image: String
  languageId: Int!        # Связь с языком
  conceptId: Int!         # Связь с концепцией
}

# Профиль пользователя с языковыми предпочтениями
type UserProfile {
  language: String!       # Предпочитаемый язык пользователя
  # ... другие поля
}
```

#### 2. Houdini GraphQL Client (ГОТОВО ✅)
- Автоматическая генерация типов
- Reactive queries с переменными
- Кеширование с автообновлением через `@list`
- Централизованная обработка ошибок

#### 3. Архитектура данных (ГОТОВО ✅)
```
Concept (id, path, depth)
    ↓ (1:N)
Dictionary (id, name, description, image, languageId, conceptId)
    ↓ (N:1)
Language (id, code, name)
```

**Вывод:** Архитектура ПОЛНОСТЬЮ готова! Осталось только добавить UI для переключения языка.

---

## Что нужно реализовать

### 1. Language Store (State Management)

**Файл:** `src/lib/stores/languageStore.svelte.ts`

```typescript
// Svelte 5 Runes store для управления текущим языком
export const languageStore = (() => {
  let currentLanguageId = $state<number | null>(null);

  return {
    get currentLanguageId() {
      return currentLanguageId;
    },
    setLanguage(languageId: number | null) {
      currentLanguageId = languageId;
      // Сохранить в localStorage
      if (languageId !== null) {
        localStorage.setItem('selectedLanguageId', languageId.toString());
      } else {
        localStorage.removeItem('selectedLanguageId');
      }
    },
    // Инициализация из localStorage при загрузке
    init() {
      const saved = localStorage.getItem('selectedLanguageId');
      if (saved) {
        currentLanguageId = parseInt(saved, 10);
      }
    }
  };
})();
```

**Зачем:**
- Хранит ID выбранного языка
- Автоматически сохраняет в localStorage
- Reactive - все компоненты обновятся автоматически

---

### 2. Language Switcher Component

**Файл:** `src/lib/components/LanguageSwitcher.svelte`

```svelte
<script lang="ts">
  import { graphql } from '$houdini';
  import { languageStore } from '$lib/stores/languageStore.svelte';

  // Загрузить все доступные языки
  const GetLanguages = graphql(`
    query GetLanguages {
      languages {
        id
        name
        code
      }
    }
  `);

  const { data } = GetLanguages.fetch();

  function handleLanguageChange(languageId: number | null) {
    languageStore.setLanguage(languageId);
  }
</script>

<div class="language-switcher">
  <label for="language-select" class="text-sm font-medium text-gray-700">
    Language:
  </label>
  <select
    id="language-select"
    value={languageStore.currentLanguageId ?? ''}
    onchange={(e) => {
      const value = e.currentTarget.value;
      handleLanguageChange(value ? parseInt(value, 10) : null);
    }}
    class="ml-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
  >
    <option value="">All Languages</option>
    {#if $data?.languages}
      {#each $data.languages as language}
        <option value={language.id}>{language.name}</option>
      {/each}
    {/if}
  </select>
</div>

<style>
  .language-switcher {
    @apply flex items-center;
  }
</style>
```

**Зачем:**
- Dropdown для выбора языка
- Отображает "All Languages" для просмотра всех переводов
- Интегрируется с languageStore

---

### 3. Обновить GraphQL Queries с фильтрацией

**Файл:** `src/routes/dictionaries/+page.svelte`

```svelte
<script lang="ts">
  import { graphql } from '$houdini';
  import { languageStore } from '$lib/stores/languageStore.svelte';
  // ... другие импорты

  // ИЗМЕНЕНО: Добавлена переменная languageId
  const GetDictionariesData = graphql(`
    query GetDictionariesData($languageId: Int) {
      dictionaries(languageId: $languageId) @list(name: "Dictionaries_Page") {
        id
        name
        description
        image
        languageId
        conceptId
      }
      languages {
        id
        name
        code
      }
      concepts {
        id
        path
        depth
        parentId
      }
    }
  `);

  // ИЗМЕНЕНО: Reactive query с фильтрацией
  // Автоматически перезагружается при изменении languageStore
  const { data } = GetDictionariesData.fetch({
    variables: {
      languageId: languageStore.currentLanguageId
    }
  });

  // Остальной код без изменений...
</script>
```

**Что изменилось:**
1. Добавлен параметр `$languageId: Int` в query
2. Используется `dictionaries(languageId: $languageId)`
3. Передаётся reactive переменная из store

**Как работает:**
- При изменении `languageStore.currentLanguageId` → query автоматически перезапускается
- Houdini кеширует результаты для каждого языка
- Переключение языка моментальное (если данные в кеше)

---

### 4. Интегрировать в Navigation

**Файл:** `src/lib/components/Navigation.svelte`

```svelte
<script lang="ts">
  import LanguageSwitcher from './LanguageSwitcher.svelte';
  import { useAuth } from '$lib/auth';

  const auth = useAuth();
</script>

<nav class="bg-white shadow">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex">
        <!-- Логотип и основные ссылки -->
      </div>

      <div class="flex items-center space-x-4">
        <!-- ДОБАВЛЕНО: Language Switcher -->
        <LanguageSwitcher />

        <!-- Авторизация, профиль и т.д. -->
        {#if auth.isAuthenticated}
          <a href="/dashboard">Dashboard</a>
          <button onclick={() => auth.logout()}>Logout</button>
        {:else}
          <a href="/login">Login</a>
        {/if}
      </div>
    </div>
  </div>
</nav>
```

---

### 5. Инициализация при загрузке приложения

**Файл:** `src/routes/+layout.svelte`

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { languageStore } from '$lib/stores/languageStore.svelte';
  import ToastContainer from '$lib/notifications/ToastContainer.svelte';

  // Инициализировать язык из localStorage
  onMount(() => {
    languageStore.init();
  });
</script>

<div>
  <slot />
  <ToastContainer />
</div>
```

---

## Расширенные возможности (опционально)

### 1. Синхронизация с профилем пользователя

После авторизации можно загружать предпочитаемый язык пользователя:

```typescript
// В useAuth hook или после login
const { data: userData } = await graphql`
  query Me {
    me {
      profile {
        language
      }
    }
  }
`.fetch();

if (userData?.me?.profile?.language) {
  languageStore.setLanguage(parseInt(userData.me.profile.language, 10));
}
```

### 2. Mutation для сохранения предпочтений

```svelte
<script lang="ts">
  const UpdateProfile = graphql(`
    mutation UpdateProfile($language: String) {
      updateProfile(language: $language) {
        profile {
          language
        }
      }
    }
  `);

  async function saveLanguagePreference(languageId: number) {
    await UpdateProfile.mutate({
      language: languageId.toString()
    });
  }
</script>
```

### 3. Фильтрация на странице Concepts

Добавить фильтрацию для показа только концепций, у которых есть переводы на выбранном языке:

```graphql
query GetConceptsWithTranslations($languageId: Int) {
  concepts {
    id
    path
    depth
    # Можно добавить resolvers на backend для подсчета переводов
  }
  dictionaries(languageId: $languageId) {
    conceptId
    languageId
  }
}
```

### 4. Индикатор доступных языков для концепции

Показать иконки флагов или badges для языков, на которые переведена концепция.

---

## Преимущества текущей архитектуры

### ✅ Type-Safety
- Houdini автоматически генерирует типы из GraphQL
- TypeScript проверяет все на этапе компиляции
- Нет ошибок рантайма из-за типов

### ✅ Performance
- GraphQL фильтрация на backend (не загружаем лишние данные)
- Houdini кеширование (мгновенное переключение языков)
- Reactive updates (нет manual refetch)

### ✅ DX (Developer Experience)
- Просто добавить переменную в query
- Store автоматически обновляет все компоненты
- localStorage persistence из коробки

### ✅ Scalability
- Легко добавить новые языки через админ-панель
- Можно фильтровать по нескольким параметрам одновременно
- Архитектура готова к i18n интерфейса

---

## План реализации (порядок шагов)

### Шаг 1: Store (5 минут)
- [ ] Создать `src/lib/stores/languageStore.svelte.ts`

### Шаг 2: Language Switcher (10 минут)
- [ ] Создать `src/lib/components/LanguageSwitcher.svelte`
- [ ] Протестировать отдельно

### Шаг 3: Интеграция в Navigation (5 минут)
- [ ] Добавить `<LanguageSwitcher />` в Navigation
- [ ] Проверить верстку

### Шаг 4: Обновить Dictionaries Query (10 минут)
- [ ] Добавить переменную `languageId` в query
- [ ] Передать значение из store
- [ ] Запустить `npx houdini generate`

### Шаг 5: Инициализация (2 минуты)
- [ ] Добавить `languageStore.init()` в `+layout.svelte`

### Шаг 6: Тестирование (10 минут)
- [ ] Протестировать переключение языков
- [ ] Проверить сохранение в localStorage
- [ ] Убедиться что кеш работает

**Общее время:** ~40 минут

---

## Возможные улучшения в будущем

1. **I18n интерфейса:**
   - Переводить сам UI (кнопки, labels, сообщения)
   - Библиотека: `svelte-i18n` или `typesafe-i18n`

2. **Bulk translation:**
   - Функция копирования перевода на другой язык
   - AI-assisted translation через OpenAI/DeepL API

3. **Translation completeness:**
   - Dashboard с прогрессом переводов
   - Индикатор "missing translations"

4. **SEO:**
   - URL с языковыми префиксами (`/en/concepts`, `/ru/concepts`)
   - hreflang метатеги

5. **RTL Support:**
   - Поддержка right-to-left языков (арабский, иврит)
   - Динамическая смена direction в CSS

---

## Вывод

**Ваша идея отлично вписывается в архитектуру проекта!**

✅ GraphQL схема уже поддерживает фильтрацию по языку
✅ Модель данных спроектирована правильно
✅ Houdini обеспечит reactive updates и кеширование
✅ Реализация займёт ~40 минут

Вы изначально правильно спроектировали систему! 🎉
