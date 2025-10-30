# Multipult Frontend - Setup Guide

## Быстрый старт

### 1. Установка зависимостей

```bash
yarn install
```

### 2. Настройка окружения

Скопируйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

Отредактируйте `.env` файл под ваше окружение:

```env
VITE_GRAPHQL_ENDPOINT=http://127.0.0.1:8000/graphql/
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
VITE_DEBUG=true
```

**Примечание:** В production `VITE_GRAPHQL_ENDPOINT` может быть `/graphql/` для использования proxy через Vite, как указано в `vite.config.ts`.

### 3. Генерация типов Houdini

```bash
yarn generate
```

Эта команда:
- Загружает GraphQL схему с сервера
- Генерирует TypeScript типы
- Создает type-safe клиенты для queries и mutations

**Дополнительные команды:**
```bash
yarn generate:watch    # Watch режим - автоматически регенерирует при изменениях
yarn generate:pull     # Принудительно загружает свежую схему с backend
```

### 4. Запуск development сервера

```bash
yarn dev
```

Приложение будет доступно по адресу: http://localhost:5173

---

## Команды

```bash
# Development
yarn dev                  # Запустить dev сервер
yarn build                # Production build
yarn preview              # Предпросмотр production build

# Houdini (GraphQL) - Type-safe queries & mutations
yarn generate             # Генерация TypeScript типов из GraphQL
yarn generate:watch       # Watch режим для автоматической генерации
yarn generate:pull        # Загрузить свежую схему с сервера и сгенерировать

# Code Quality
yarn lint                 # Проверить код
yarn format               # Форматировать код
yarn check                # Type checking
yarn check:watch          # Type checking в watch режиме

# Testing
yarn test                 # Все тесты
yarn test:unit            # Unit тесты
yarn test:e2e             # E2E тесты
```

**📖 Подробное описание всех команд:** см. [SCRIPTS.md](./SCRIPTS.md)

---

## Структура проекта

```
frontend/
├── .env                       # Local конфигурация (не коммитится)
├── .env.example               # Шаблон конфигурации
├── src/
│   ├── lib/
│   │   ├── config.ts          # Конфигурация приложения
│   │   ├── errors/            # Обработка ошибок
│   │   ├── notifications/     # Система уведомлений
│   │   ├── graphql/           # GraphQL queries/mutations
│   │   ├── auth/              # Система авторизации
│   │   ├── api/               # API клиенты (legacy)
│   │   └── components/        # Переиспользуемые компоненты
│   ├── routes/                # Страницы приложения
│   └── client.ts              # Houdini клиент
├── houdini.config.js          # Конфигурация Houdini
└── schema.graphql             # GraphQL схема
```

---

## Использование

### Error Handling

```typescript
import { errorHandler } from '$lib/errors';

try {
  await someOperation();
} catch (error) {
  errorHandler.handle(error); // Автоматически покажет notification
}
```

### Notifications

```typescript
import { notificationStore } from '$lib/notifications';

notificationStore.success('Operation completed!');
notificationStore.error('Something went wrong');
notificationStore.warning('Please check your input');
notificationStore.info('New update available');
```

### GraphQL с Houdini

```svelte
<script lang="ts">
  import { graphql } from '$houdini';
  import { errorHandler } from '$lib/errors';
  import { notificationStore } from '$lib/notifications';

  // Query
  const GetConcepts = graphql`
    query GetConcepts {
      concepts {
        id
        path
        depth
      }
    }
  `;

  const { data } = GetConcepts.fetch();

  // Mutation
  const CreateConcept = graphql`
    mutation CreateConcept($input: ConceptInput!) {
      createConcept(input: $input) {
        id
        path
      }
    }
  `;

  async function create() {
    try {
      await CreateConcept.mutate({
        input: {
          path: '/new',
          depth: 1,
          parentId: null
        }
      });
      notificationStore.success('Concept created!');
    } catch (error) {
      errorHandler.handle(error);
    }
  }
</script>
```

---

## Окружения

### Development
```bash
cp .env.example .env
yarn dev
```

### Staging
```bash
cp .env.staging .env
yarn build
yarn preview
```

### Production
```bash
cp .env.production .env
yarn build
# Deploy dist/
```

---

## Troubleshooting

### Ошибка "GraphQL schema not found"

Убедитесь что:
1. Backend сервер запущен
2. `VITE_GRAPHQL_ENDPOINT` правильно настроен в `.env`
3. Выполнена команда `yarn generate` или `yarn generate:pull`

### TypeScript ошибки в .gql файлах

Запустите генерацию типов:
```bash
yarn generate
```

Для постоянной синхронизации во время разработки:
```bash
# В отдельном терминале
yarn generate:watch
```

### Environment variables не применяются

1. Перезапустите dev сервер после изменения `.env`
2. Проверьте что переменные начинаются с `VITE_`
3. Используйте `import.meta.env.VITE_*` для доступа

### Проблемы с подключением к backend

Если при разработке возникают проблемы с подключением к GraphQL API, проверьте настройки proxy в `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/graphql': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
    }
  }
}
```

Эта настройка позволяет использовать `/graphql/` в `VITE_GRAPHQL_ENDPOINT`, который будет проксирован к `http://127.0.0.1:8000/graphql/`.

---

## Дополнительная документация

- [IMPROVEMENTS.md](./IMPROVEMENTS.md) - Подробное описание реализованных улучшений
- [src/lib/auth/README.md](./src/lib/auth/README.md) - Документация системы авторизации
- [src/lib/auth/ARCHITECTURE.md](./src/lib/auth/ARCHITECTURE.md) - Архитектура auth модуля

---

## Технологии

- **SvelteKit 2** - Full-stack фреймворк
- **Svelte 5** - UI фреймворк с Runes
- **TypeScript** - Типизация
- **Houdini** - GraphQL клиент
- **TailwindCSS 4** - Стилизация
- **Vite** - Build tool
- **Vitest** - Unit тестирование
- **Playwright** - E2E тестирование

---

## Помощь

Если у вас возникли вопросы:
1. Проверьте документацию в `IMPROVEMENTS.md`
2. Посмотрите примеры использования в существующих компонентах
3. Обратитесь к команде разработки