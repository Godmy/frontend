# Multilingual Feature - User Guide

## Обзор

Система теперь поддерживает фильтрацию словарей (dictionaries) по языкам. Вы можете выбрать конкретный язык и видеть только переводы на этом языке, либо выбрать "All Languages" для просмотра всех переводов.

---

## Как использовать

### 1. Переключение языка

**В правом верхнем углу навигации** находится dropdown "Language":

```
Language: [All Languages ▼]
```

Выберите язык из списка:
- **All Languages** - показать все переводы на всех языках
- **English (en)** - показать только английские переводы
- **Русский (ru)** - показать только русские переводы
- И т.д.

### 2. Фильтрация словарей

При выборе языка:
- Страница **Dictionaries** автоматически обновляется
- Показываются только словари на выбранном языке
- Списки Concepts и Languages остаются без изменений

### 3. Сохранение выбора

Ваш выбор языка **автоматически сохраняется**:
- В localStorage браузера
- Восстанавливается при следующем посещении
- Работает между вкладками браузера

---

## Для разработчиков

### Архитектура

**Language Store** (`src/lib/stores/languageStore.svelte.ts`)
- Svelte 5 Runes store
- Хранит ID выбранного языка
- Автоматически синхронизируется с localStorage

**LanguageSwitcher** (`src/lib/components/LanguageSwitcher.svelte`)
- Dropdown компонент
- Загружает доступные языки через GraphQL
- Обновляет languageStore при изменении

**Reactive Queries**
```typescript
const { data } = GetDictionariesData.fetch({
  variables: {
    languageId: languageStore.currentLanguageId  // Reactive!
  }
});
```

При изменении `languageStore.currentLanguageId` → query автоматически перезапускается.

---

## Добавление фильтрации на другие страницы

Чтобы добавить языковую фильтрацию на другую страницу:

### 1. Импортировать store

```typescript
import { languageStore } from '$lib/stores/languageStore.svelte';
```

### 2. Обновить GraphQL Query

```typescript
const GetMyData = graphql(`
  query GetMyData($languageId: Int) {
    dictionaries(languageId: $languageId) {
      id
      name
      # ...
    }
  }
`);

const { data } = GetMyData.fetch({
  variables: {
    languageId: languageStore.currentLanguageId
  }
});
```

### 3. Regenerate Houdini types

```bash
npx houdini generate
```

**Готово!** Теперь эта страница будет автоматически фильтроваться при изменении языка.

---

## GraphQL API

Backend поддерживает фильтрацию через параметр `languageId`:

```graphql
query GetDictionaries($languageId: Int) {
  dictionaries(languageId: $languageId) {
    id
    name
    description
    languageId
    conceptId
  }
}
```

**Параметры:**
- `languageId: Int` (optional) - ID языка для фильтрации
- `null` или не указан - возвращает все словари

---

## Будущие улучшения

### 1. Синхронизация с профилем пользователя

После авторизации можно загружать предпочитаемый язык из профиля:

```typescript
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

### 2. Сохранение в профиль

Можно сохранять выбор языка в профиль пользователя:

```typescript
const UpdateProfile = graphql(`
  mutation UpdateProfile($language: String) {
    updateProfile(language: $language) {
      profile {
        language
      }
    }
  }
`);

await UpdateProfile.mutate({
  language: languageStore.currentLanguageId?.toString()
});
```

### 3. Фильтрация на странице Concepts

Показывать только концепции с переводами на выбранном языке:

```typescript
// Filter concepts that have translations in selected language
const filteredConcepts = $data.concepts.filter(concept => {
  return $data.dictionaries.some(dict =>
    dict.conceptId === concept.id &&
    dict.languageId === languageStore.currentLanguageId
  );
});
```

### 4. Индикация доступных языков

Показывать иконки/badges языков, на которые переведена концепция:

```svelte
<div class="flex gap-1">
  {#each getAvailableLanguagesForConcept(concept.id) as lang}
    <span class="px-2 py-1 text-xs bg-blue-100 rounded">
      {lang.code}
    </span>
  {/each}
</div>
```

### 5. Bulk translation

Функция копирования перевода:
```
[Copy to other language] → Select target language → Create dictionary
```

---

## Troubleshooting

### Фильтр не работает

1. Проверьте что `languageStore.init()` вызывается в `+layout.svelte`
2. Убедитесь что query использует переменную `languageId`
3. Запустите `npx houdini generate`

### Выбор не сохраняется

Проверьте console браузера на ошибки localStorage (может быть заблокирован в приватном режиме).

### Компонент не обновляется

Убедитесь что используете reactive переменную:
```typescript
// ✅ Правильно
variables: {
  languageId: languageStore.currentLanguageId
}

// ❌ Неправильно
const langId = languageStore.currentLanguageId;
variables: {
  languageId: langId  // Не реактивно!
}
```

---

## API Reference

### languageStore

**Properties:**
- `currentLanguageId: number | null` - ID выбранного языка или null

**Methods:**
- `setLanguage(languageId: number | null)` - установить язык
- `init()` - инициализировать из localStorage
- `reset()` - сбросить выбор (показать все)

**Example:**
```typescript
import { languageStore } from '$lib/stores/languageStore.svelte';

// Установить английский
languageStore.setLanguage(1);

// Показать все языки
languageStore.reset();

// Получить текущий
const currentId = languageStore.currentLanguageId;
```

---

## Тестирование

### Manual Testing

1. Откройте страницу Dictionaries
2. Создайте несколько словарей на разных языках
3. Используйте Language Switcher для фильтрации
4. Обновите страницу - выбор должен сохраниться

### Automated Testing

```typescript
import { languageStore } from '$lib/stores/languageStore.svelte';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Language Store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save and restore language selection', () => {
    languageStore.setLanguage(1);
    expect(languageStore.currentLanguageId).toBe(1);

    // Simulate page reload
    languageStore.init();
    expect(languageStore.currentLanguageId).toBe(1);
  });
});
```

---

## Changelog

### v1.0.0 (2025-01-14)
- ✅ Initial implementation
- ✅ Language Store with localStorage persistence
- ✅ LanguageSwitcher component in Navigation
- ✅ Dictionaries page filtering
- ✅ Automatic Houdini integration
- ✅ Documentation

---

Система готова к использованию! 🎉
