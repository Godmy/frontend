# Скрипты проекта

Описание всех доступных npm/yarn команд в проекте.

## Development

### `yarn dev`
Запускает development сервер с hot-reload.

```bash
yarn dev
```

- Запускает Vite dev server
- Автоматически открывает браузер
- Hot Module Replacement (HMR)
- Доступно на http://localhost:5173

**Примечание:** Перед первым запуском выполните `yarn generate`

---

### `yarn generate:watch`
Запускает Houdini в watch режиме для автоматической регенерации типов.

```bash
yarn generate:watch
```

Полезно запускать в отдельном терминале во время разработки:

```bash
# Терминал 1
yarn generate:watch

# Терминал 2
yarn dev
```

---

## Build & Preview

### `yarn build`
Создает production build проекта.

```bash
yarn build
```

- Автоматически запускает `yarn generate` перед сборкой (prebuild hook)
- Оптимизирует код
- Минифицирует файлы
- Создает статические ассеты
- Результат в папке `build/`

### `yarn preview`
Предпросмотр production build локально.

```bash
yarn preview
```

Запускает локальный сервер для preview собранного приложения.

---

## Houdini (GraphQL)

### `yarn generate`
Генерирует TypeScript типы из GraphQL схемы и операций.

```bash
yarn generate
```

**Когда запускать:**
- После создания/изменения `.gql` файлов
- После изменения GraphQL схемы на backend
- После `yarn install`
- Автоматически запускается в `prepare` и `prebuild`

**Что делает:**
- Загружает схему с GraphQL endpoint
- Генерирует TypeScript типы из схемы
- Создает type-safe клиенты для queries/mutations
- Обновляет `.houdini/` директорию

---

### `yarn generate:watch`
Watch режим для автоматической регенерации типов.

```bash
yarn generate:watch
```

Мониторит изменения в:
- `.gql` файлах
- GraphQL схеме (если настроено polling)

Автоматически регенерирует типы при изменениях.

---

### `yarn generate:pull`
Принудительно загружает свежую схему с сервера и генерирует типы.

```bash
yarn generate:pull
```

**Используйте когда:**
- Backend схема изменилась
- Нужна принудительная синхронизация
- Схема устарела

---

### `yarn houdini`
Прямой доступ к CLI Houdini для дополнительных команд.

```bash
yarn houdini --help
```

Доступные команды:
- `houdini generate` - генерация типов
- `houdini pull-schema` - загрузка схемы
- `houdini --help` - справка

---

## Code Quality

### `yarn check`
Проверка TypeScript типов без сборки.

```bash
yarn check
```

Выполняет:
- `svelte-kit sync` - синхронизация типов SvelteKit
- `svelte-check` - проверка Svelte компонентов
- Type checking всего проекта

**Полезно перед коммитом.**

---

### `yarn check:watch`
Watch режим для проверки типов.

```bash
yarn check:watch
```

Мониторит изменения и автоматически проверяет типы.

---

### `yarn lint`
Проверяет код на соответствие стандартам.

```bash
yarn lint
```

Выполняет:
- Prettier check - проверка форматирования
- ESLint - проверка качества кода

**Запускайте перед коммитом!**

---

### `yarn format`
Автоматически форматирует код.

```bash
yarn format
```

Применяет:
- Prettier formatting
- Auto-fix для ESLint (где возможно)

---

## Testing

### `yarn test`
Запускает все тесты (unit + e2e).

```bash
yarn test
```

Последовательно выполняет:
1. Unit тесты (Vitest)
2. E2E тесты (Playwright)

---

### `yarn test:unit`
Запускает только unit тесты в watch режиме.

```bash
yarn test:unit
```

Используется Vitest с hot-reload.

**Для CI/CD используйте:**
```bash
yarn test:unit --run
```

---

### `yarn test:e2e`
Запускает E2E тесты через Playwright.

```bash
yarn test:e2e
```

**Опции:**
```bash
# В headed режиме (с браузером)
yarn test:e2e --headed

# Конкретный браузер
yarn test:e2e --project=chromium

# Debug режим
yarn test:e2e --debug
```

---

## Utility Scripts

### `yarn prepare`
Автоматически выполняется после `yarn install`.

```bash
yarn prepare
```

Выполняет:
1. `svelte-kit sync` - синхронизация SvelteKit
2. `houdini generate` - генерация типов Houdini

**Не нужно запускать вручную** - выполняется автоматически.

---

### `yarn prebuild`
Автоматически выполняется перед `yarn build`.

```bash
# Не запускается вручную
```

Выполняет `houdini generate` для актуальности типов перед сборкой.

---

## Типичные сценарии использования

### Первая настройка проекта

```bash
# 1. Установка зависимостей
yarn install  # автоматически запустит prepare -> generate

# 2. Настройка .env
cp .env.example .env
# Отредактировать .env

# 3. Запуск
yarn dev
```

---

### Ежедневная разработка

```bash
# Терминал 1 - генерация типов в watch режиме
yarn generate:watch

# Терминал 2 - dev сервер
yarn dev

# Перед коммитом
yarn lint
yarn check
yarn test
```

---

### После изменений в GraphQL

```bash
# Если изменились .gql файлы
yarn generate

# Если изменилась backend схема
yarn generate:pull
```

---

### Подготовка к production

```bash
# 1. Проверка кода
yarn lint
yarn check

# 2. Тесты
yarn test

# 3. Build
yarn build

# 4. Preview локально
yarn preview
```

---

### Работа с разными окружениями

```bash
# Development
yarn dev

# Staging preview
cp .env.staging .env
yarn build
yarn preview

# Production build
cp .env.production .env
yarn build
# Деплой dist/
```

---

## Troubleshooting

### "Cannot find module '$houdini'"

**Решение:**
```bash
yarn generate
```

---

### "GraphQL schema not found"

**Решение:**
1. Убедитесь что backend запущен
2. Проверьте `VITE_GRAPHQL_ENDPOINT` в `.env`
3. Запустите:
```bash
yarn generate:pull
```

---

### TypeScript errors после изменений

**Решение:**
```bash
# Регенерировать типы
yarn generate

# Проверить
yarn check
```

---

### Тесты падают

**Решение:**
```bash
# Очистить и переустановить
rm -rf node_modules .svelte-kit .houdini
yarn install
yarn generate
yarn test
```

---

## CI/CD Скрипты

### GitHub Actions пример

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install

      - name: Generate Houdini types
        run: yarn generate

      - name: Lint
        run: yarn lint

      - name: Type check
        run: yarn check

      - name: Unit tests
        run: yarn test:unit --run

      - name: Build
        run: yarn build

      - name: E2E tests
        run: yarn test:e2e
```

---

## Производительность

### Ускорение разработки

1. **Используйте watch режимы:**
   ```bash
   yarn generate:watch  # Терминал 1
   yarn dev             # Терминал 2
   ```

2. **Кешируйте node_modules:**
   - Используйте yarn cache
   - В CI используйте кеширование

3. **Выборочные тесты:**
   ```bash
   # Только измененные
   yarn test:unit --run --changed

   # Конкретный файл
   yarn test:unit src/lib/errors/ErrorHandler.test.ts
   ```

---

## Дополнительные ресурсы

- **Houdini Docs:** https://houdinigraphql.com
- **SvelteKit Docs:** https://kit.svelte.dev
- **Vite Docs:** https://vitejs.dev
- **Vitest Docs:** https://vitest.dev
- **Playwright Docs:** https://playwright.dev
