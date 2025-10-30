# Документация Frontend проекта Multipult

## Обзор проекта

Multipult - это система управления мультиязычным контентом, построенная на современных технологиях с применением принципов SOLID. Frontend реализован на основе SvelteKit с использованием TypeScript, TailwindCSS и Houdini GraphQL.

## Технологический стек

- **SvelteKit 2** - full-stack фреймворк для создания веб-приложений
- **Svelte 5** - UI фреймворк с новыми Runes API
- **TypeScript** - типизированный JavaScript
- **TailwindCSS 4** - utility-first CSS фреймворк
- **Houdini** - GraphQL клиент для Svelte с автогенерацией типов
- **GraphQL** - язык запросов для API
- **Vite** - сборщик проекта
- **Vitest** - unit-тестирование
- **Playwright** - E2E тестирование
- **ESLint** - линтер кода
- **Prettier** - форматирование кода
- **@sveltejs/adapter-node** - для деплоя на Node.js сервер

## Архитектура проекта

### Структура директорий

```
frontend/
├── .env, .env.staging, .env.production  # Конфигурация окружений
├── IMPROVEMENTS.md                       # Документация реализованных улучшений
├── SETUP.md                              # Подробные инструкции по настройке
├── src/
│   ├── lib/
│   │   ├── config.ts                    # Конфигурация приложения + logger
│   │   ├── errors/                      # Система обработки ошибок
│   │   │   ├── AppError.ts              # Типизированные ошибки
│   │   │   ├── ErrorHandler.ts          # Централизованный обработчик
│   │   │   ├── types.ts                 # Типы ошибок
│   │   │   ├── integrations.ts          # Интеграция с notifications
│   │   │   └── index.ts
│   │   ├── notifications/               # Система уведомлений (Toast)
│   │   │   ├── notificationStore.svelte.ts  # Store на Runes
│   │   │   ├── Toast.svelte             # Компонент уведомления
│   │   │   ├── ToastContainer.svelte    # Контейнер для уведомлений
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── graphql-client.ts            # GraphQL клиент (Houdini)
│   │   ├── auth/                        # Система авторизации (SOLID)
│   │   │   ├── adapters/                # GraphQL адаптер
│   │   │   ├── components/              # UI компоненты
│   │   │   ├── composables/             # Хуки (useAuth, usePermissions)
│   │   │   ├── services/                # Бизнес-логика
│   │   │   ├── storage/                 # Хранение токенов
│   │   │   ├── stores/                  # State management
│   │   │   ├── strategies/              # Стратегии авторизации
│   │   │   ├── README.md                # Документация модуля
│   │   │   └── ARCHITECTURE.md          # Описание архитектуры
│   │   ├── api/                         # Типы данных (бывшие API клиенты)
│   │   │   ├── concepts.ts              # Типы для концепций
│   │   │   ├── dictionaries.ts          # Типы для словарей
│   │   │   └── languages.ts             # Типы для языков
│   │   │   # Примечание: GraphQL queries используются inline через Houdini
│   │   ├── components/                  # Общие компоненты
│   │   │   ├── concepts/
│   │   │   ├── dictionaries/
│   │   │   └── languages/
│   ├── routes/                          # Страницы приложения
│   │   ├── +layout.svelte               # Layout с ToastContainer
│   │   ├── +page.svelte                 # Landing page
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── concepts/
│   │   ├── dictionaries/
│   │   ├── languages/
│   │   └── forgot-password/
│   └── client.ts                        # Houdini клиент
├── static/                              # Статические файлы
├── e2e/                                 # E2E тесты
├── houdini.config.js                    # Конфигурация Houdini
└── schema.graphql                       # GraphQL схема
```

## Установка и запуск

### 1. Установка зависимостей

```bash
yarn install
```

### 2. Настройка окружения

Скопируйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

Отредактируйте `.env` под ваше окружение:

```env
VITE_GRAPHQL_ENDPOINT=http://127.0.0.1:8000/graphql/
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
VITE_DEBUG=true
```

### 3. Запуск Backend сервера (ВАЖНО!)

**⚠️ ВАЖНО:** Frontend требует работающий backend GraphQL сервер!

Убедитесь, что backend запущен на `http://127.0.0.1:8000`:

```bash
# Перейдите в папку backend
cd ../backend

# Запустите backend сервер (Django)
python manage.py runserver 127.0.0.1:8000
```

Проверьте доступность GraphQL API: http://127.0.0.1:8000/graphql/

### 4. Генерация типов Houdini

```bash
npx houdini generate
```

### 5. Запуск development сервера

```bash
yarn dev
```

Приложение доступно по адресу: http://localhost:5173

## Основные возможности

### 1. Мультиязычность

**Фильтрация контента по языкам:**
- Language Switcher в навигационном меню
- Автоматическая фильтрация словарей по выбранному языку
- Сохранение выбора в localStorage
- Reactive updates через Houdini

### 2. Система авторизации

**Методы входа:**
- Email/Password (классическая)
- Google OAuth
- Telegram Auth

**Возможности:**
- Регистрация пользователей
- Вход/выход
- Восстановление пароля
- Email верификация
- Обновление токенов
- RBAC (Role-Based Access Control)

**Архитектура:**
- Построена по принципам SOLID
- Паттерн Strategy для методов авторизации
- Dependency Injection через AuthContext
- Разделение интерфейсов (ISP)

### 3. Управление концепциями (Concepts)

Иерархическая структура для организации контента.

**Поля:**
- `id` - уникальный идентификатор
- `path` - путь концепции
- `depth` - глубина вложенности
- `parentId` - родительская концепция (nullable)

**Операции:** CRUD через Houdini mutations

### 4. Словари (Dictionaries)

Переводы концепций на разные языки.

**Поля:**
- `id`, `name`, `description`, `image`
- `languageId` - язык
- `conceptId` - связанная концепция

**Операции:** CRUD с фильтрацией через Houdini

### 5. Языки (Languages)

Управление поддерживаемыми языками.

**Поля:**
- `id` - уникальный идентификатор
- `code` - код языка (ISO)
- `name` - название языка

### 6. Система ролей и разрешений

**Компоненты защиты:**
- `ProtectedRoute` - защита маршрутов
- `RequirePermission` - проверка прав
- `RequireRole` - проверка ролей

## Ключевые улучшения

### 1. Environment Configuration
- Конфигурация для dev/staging/production
- Централизованный модуль `config.ts`
- Conditional logging (только в development)

### 2. Централизованная обработка ошибок
- Типизированные ошибки (`AppError`)
- `ErrorHandler` для единообразной обработки
- Автоматическая интеграция с уведомлениями

### 3. Система уведомлений (Toast)
- Store на Svelte 5 Runes
- 4 типа: success, error, warning, info
- Автоматическое закрытие и кастомные действия
- Интегрирована в layout

### 4. Houdini GraphQL
- Type-safe queries и mutations
- Автоматическая генерация TypeScript типов
- Кеширование `CacheAndNetwork`
- Директива `@list` для автообновления

## Использование

### Environment Configuration

```typescript
import { config, logger } from '$lib/config';

// Доступ к конфигурации
const endpoint = config.graphqlEndpoint;
const isProduction = config.isProduction;

// Conditional logging (только в dev)
logger.log('Debug info');
logger.error('Error'); // Всегда выводится
```

### Error Handling

```typescript
import { errorHandler } from '$lib/errors';

// Автоматическая обработка с уведомлением
try {
  await someOperation();
} catch (error) {
  errorHandler.handle(error); // Покажет toast автоматически
}

// Создание специфичных ошибок
throw errorHandler.createError.validation('Invalid input');
throw errorHandler.createError.authentication('Token expired');
throw errorHandler.createError.notFound('User');

// Async обработка
await errorHandler.handleAsync(async () => {
  return await fetchData();
});
```

### Notifications

```typescript
import { notificationStore } from '$lib/notifications';

// Простые уведомления
notificationStore.success('Saved!');
notificationStore.error('Failed to load data');
notificationStore.warning('Please check your input');
notificationStore.info('New update available');

// С дополнительными опциями
notificationStore.success('Saved!', {
  title: 'Success',
  duration: 3000,
  action: {
    label: 'View',
    callback: () => navigate('/item')
  }
});

// Управление
notificationStore.dismiss(id);
notificationStore.dismissAll();
```

### GraphQL с Houdini

```svelte
<script lang="ts">
  import { graphql } from '$houdini';
  import { errorHandler } from '$lib/errors';
  import { notificationStore } from '$lib/notifications';

  // Query с автоматическим кешированием
  const GetConcepts = graphql`
    query GetConcepts {
      concepts {
        id
        path
        depth
        parentId
      }
    }
  `;

  const { data } = GetConcepts.fetch();

  // Mutation с обработкой ошибок
  const CreateConcept = graphql`
    mutation CreateConcept($input: ConceptInput!) {
      createConcept(input: $input) {
        id
        path
        depth
      }
    }
  `;

  async function create() {
    try {
      await CreateConcept.mutate({
        input: {
          path: '/categories/electronics',
          depth: 2,
          parentId: 1
        }
      });
      notificationStore.success('Concept created!');
    } catch (error) {
      errorHandler.handle(error);
    }
  }
</script>

{#if $data}
  {#each $data.concepts as concept}
    <div>{concept.path}</div>
  {/each}
{/if}
```

### Система авторизации

```svelte
<script lang="ts">
  import { useAuth } from '$lib/auth';
  import { RequirePermission, RequireRole } from '$lib/auth';

  const auth = useAuth();

  async function handleLogin() {
    await auth.login({
      username: 'user@example.com',
      password: 'password123'
    });
  }
</script>

<RequirePermission resource="articles" action="create">
  <button>Create Article</button>
</RequirePermission>

<RequireRole role="admin">
  <div>Admin Panel</div>
</RequireRole>
```

## GraphQL API

### Queries

```graphql
concepts                              # Все концепции
concept(conceptId: Int!)              # Одна концепция
dictionaries(conceptId, languageId)   # Словари
dictionary(dictionaryId)              # Один словарь
languages                             # Все языки
language(languageId)                  # Один язык
me                                   # Текущий пользователь
myRoles                              # Роли пользователя
roles                                # Все роли
role(roleId)                         # Одна роль
```

### Mutations

**Авторизация:**
```graphql
login(input: UserLoginInput!)
loginWithGoogle(input: GoogleAuthInput!)
loginWithTelegram(input: TelegramAuthInput!)
register(input: UserRegistrationInput!)
refreshToken(input: RefreshTokenInput!)
verifyEmail(input: EmailVerificationInput!)
requestPasswordReset(input: PasswordResetRequestInput!)
resetPassword(input: PasswordResetInput!)
```

**CRUD операции:**
```graphql
# Концепции
createConcept(input: ConceptInput!)
updateConcept(conceptId, input: ConceptUpdateInput!)
deleteConcept(conceptId: Int!)

# Словари
createDictionary(input: DictionaryInput!)
updateDictionary(dictionaryId, input: DictionaryUpdateInput!)
deleteDictionary(dictionaryId: Int!)

# Языки
createLanguage(input: LanguageInput!)
updateLanguage(languageId, input: LanguageUpdateInput!)
deleteLanguage(languageId: Int!)

# Роли
createRole(input: RoleInput!)
updateRole(roleId, input: RoleUpdateInput!)
assignRoleToUser(userId, roleName)
removeRoleFromUser(userId, roleName)
addPermissionToRole(roleId, input: PermissionInput!)
```

## Команды

```bash
# Development
yarn dev                  # Запустить dev сервер
yarn build                # Production build
yarn preview              # Предпросмотр production build

# Houdini (GraphQL)
yarn generate             # Генерация TypeScript типов из GraphQL
yarn generate:watch       # Watch режим для автоматической генерации
yarn generate:pull        # Загрузить свежую схему с сервера

# Code Quality
yarn lint                 # Проверить код
yarn format               # Форматировать код
yarn check                # Type checking
yarn check:watch          # Type checking в watch режиме

# Testing
yarn test                 # Все тесты
yarn test:unit            # Unit тесты (Vitest)
yarn test:unit -- --run   # Unit тесты без watch
yarn test:unit -- --coverage  # Unit тесты с coverage
yarn test:e2e             # E2E тесты (Playwright)

# Docker
docker-compose up -d      # Запустить в production режиме
docker-compose --profile dev up frontend-dev  # Dev режим с hot-reload
docker-compose down       # Остановить контейнеры
docker-compose logs -f    # Посмотреть логи
```

## Архитектура системы авторизации

Система авторизации построена по принципам SOLID. Вот основные аспекты:

### Single Responsibility Principle (SRP)
- **TokenStorage** - управление токенами
- **AuthService** - бизнес-логика авторизации
- **PermissionService** - проверка прав доступа
- **AuthStore** - управление состоянием

### Open/Closed Principle (OCP)
Система открыта для расширения через паттерн Strategy:
- **IAuthStrategy** - базовый интерфейс
- **EmailPasswordStrategy** - авторизация через email/password
- **GoogleAuthStrategy** - авторизация через Google
- **TelegramAuthStrategy** - авторизация через Telegram

### Liskov Substitution Principle (LSP)
Все стратегии взаимозаменяемы и реализуют единый интерфейс.

### Interface Segregation Principle (ISP)
Разделенные интерфейсы для разных аспектов:
- **ITokenStorage** - хранение токенов
- **IAuthProvider** - операции авторизации
- **IPermissionChecker** - проверка прав
- **IPasswordManager** - управление паролями
- **IEmailVerification** - верификация email

### Dependency Inversion Principle (DIP)
Все зависимости от абстракций через **AuthContext** (DI Container).

Для более подробной информации о системе авторизации смотрите файлы:
- `src/lib/auth/README.md`
- `src/lib/auth/ARCHITECTURE.md`

## Статус проекта

**Версия:** 0.4.0 | **Статус:** Production-Ready

### Реализованные возможности
- ✅ **Environment Configuration** - разные окружения (dev/staging/production)
- ✅ **Error Handling** - централизованная обработка ошибок с типизацией
- ✅ **Notifications** - система toast уведомлений с auto-dismiss
- ✅ **Type-Safe GraphQL** - Houdini с автогенерацией типов (100% migration)
- ✅ **GraphQL Caching** - оптимизированное кеширование запросов
- ✅ **SOLID Architecture** - auth модуль по принципам SOLID
- ✅ **Multilingual Support** - фильтрация контента по языкам
- ✅ **CI/CD Pipeline** - автоматизированное тестирование и сборка
- ✅ **Docker Infrastructure** - контейнеризация для dev и production
- ✅ **Comprehensive Unit Tests** - 146 passing tests, 80%+ coverage
- ✅ **UX Components Library** - 20+ переиспользуемых UI компонентов
- ✅ **Form Validation** - Zod интеграция с real-time feedback
- ✅ **Utility Functions** - debounce, storage, date formatting и др.

## Troubleshooting

### Backend сервер недоступен (500 ошибка)

**Симптомы:**
- Ошибка "Server error. Please try again later or contact support."
- В консоли: `Failed to load resource: status 500`
- Не удается залогиниться

**Решение:**
1. Убедитесь, что backend запущен на `http://127.0.0.1:8000`
2. Проверьте доступность GraphQL endpoint: http://127.0.0.1:8000/graphql/
3. См. подробную документацию: [BACKEND_CONNECTION.md](./BACKEND_CONNECTION.md)

### Ошибка базы данных: "column user_profiles.avatar_file_id does not exist"

**Симптомы:**
- При входе появляется ошибка "Server database error. Please contact the administrator to fix the database schema."
- В консоли: `psycopg2.errors.UndefinedColumn: column user_profiles.avatar_file_id does not exist`

**Решение:**
- Это проблема на стороне backend - требуется миграция базы данных
- Frontend уже обрабатывает эту ошибку gracefully
- **Для backend администратора:** См. [BACKEND_DATABASE_FIX.md](./BACKEND_DATABASE_FIX.md)