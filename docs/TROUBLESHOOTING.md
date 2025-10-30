# Troubleshooting Guide

## Common Issues and Solutions

### 1. Houdini Files - 403 Forbidden Error

**Симптомы:**
```
GET http://localhost:5173/.houdini/plugins/houdini-svelte/stores/GetConcepts.js
net::ERR_ABORTED 403 (Forbidden)
```

**Причина:**
Dev сервер был запущен до генерации Houdini типов или после изменения GraphQL queries.

**Решение:**
1. Остановите dev сервер (Ctrl+C в терминале)
2. Регенерируйте Houdini типы:
   ```bash
   npx houdini generate
   ```
3. Перезапустите dev сервер:
   ```bash
   npm run dev
   ```

**Альтернативное решение (Hot reload):**
Просто обновите страницу в браузере (Ctrl+R или F5) - иногда HMR не подхватывает новые файлы.

---

### 2. Infinite Login Loop

**Симптомы:**
```
[Login Page] handleLogin called
[useAuth] Login attempt
[Login Page] handleLogin called  // Повторяется
```

**Причина:**
- Неправильный синтаксис событий в Svelte 5 (`onsubmit` вместо `on:submit`)
- Отсутствие защиты от двойной отправки

**Решение:**
Используйте правильный синтаксис Svelte 5:
```svelte
<!-- ❌ Неправильно -->
<form onsubmit={handleSubmit}>

<!-- ✅ Правильно -->
<form on:submit={handleSubmit}>
```

И добавьте защиту:
```typescript
async function handleSubmit(e?: Event) {
  e?.preventDefault();

  if (isLoading) return; // Защита от двойной отправки

  // ... логика
}
```

---

### 3. TypeScript Errors in Houdini Queries

**Симптомы:**
```
Property 'data' does not exist on type 'Promise<QueryResult<...>>'
```

**Причина:**
Используется старый синтаксис Houdini или неправильный await.

**Решение:**

**Для Svelte 5 (правильно):**
```typescript
// В onMount или с async
onMount(async () => {
  const result = await GetData.fetch();
  if (result.data) {
    // использовать result.data
  }
});

// Или с $state
let data = $state<DataType[]>([]);
onMount(async () => {
  const result = await GetData.fetch();
  if (result.data?.items) {
    data = result.data.items;
  }
});
```

**Не используйте:**
```typescript
// ❌ Это Promise, не распакованный результат
const { data } = GetData.fetch();
```

---

### 4. Svelte 5 Runes - Legacy Reactive Statement

**Симптомы:**
```
`$:` is not allowed in runes mode, use `$derived` or `$effect` instead
```

**Решение:**
```svelte
<!-- ❌ Svelte 4 синтаксис -->
<script>
  $: doubled = count * 2;
</script>

<!-- ✅ Svelte 5 Runes -->
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>
```

---

### 5. Language Switcher Not Working

**Симптомы:**
Выбор языка не сохраняется или не обновляет списки.

**Проверьте:**

1. **Store инициализирован?**
```typescript
// В +layout.svelte должно быть:
onMount(() => {
  languageStore.init();
});
```

2. **Query использует переменную?**
```typescript
const { data } = GetData.fetch({
  variables: {
    languageId: languageStore.currentLanguageId // ✅ Reactive
  }
});

// ❌ Не делайте так:
const langId = languageStore.currentLanguageId;
const { data } = GetData.fetch({
  variables: { languageId: langId } // Не reactive!
});
```

3. **localStorage доступен?**
В приватном режиме браузера localStorage может быть заблокирован.

---

### 6. GraphQL Network Errors

**Симптомы:**
```
Network error: Failed to fetch
```

**Проверьте:**

1. **Backend запущен?**
   ```bash
   # Backend должен быть доступен на http://127.0.0.1:8000
   curl http://127.0.0.1:8000/graphql/
   ```

2. **Правильный endpoint в .env?**
   - Для разработки с использованием proxy: `VITE_GRAPHQL_ENDPOINT=/graphql/`
   - Без proxy: `VITE_GRAPHQL_ENDPOINT=http://127.0.0.1:8000/graphql/`
   
   Proxy настроен в `vite.config.ts`:
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

3. **CORS настроен на backend?**
   Backend должен разрешать запросы с `http://localhost:5173`

---

### 7. Build Errors

**Симптомы:**
```
npm run build
// Errors...
```

**Решение:**

1. **Сначала сгенерируйте Houdini типы:**
   ```bash
   npx houdini generate
   npm run build
   ```

2. **Проверьте TypeScript:**
   ```bash
   npm run check
   ```

3. **Очистите кеш:**
   ```bash
   rm -rf .svelte-kit
   rm -rf build
   rm -rf node_modules/.vite
   npm run build
   ```

---

### 8. Auth Token Expired

**Симптомы:**
Автоматический logout или ошибки авторизации.

**Решение:**

1. **Проверьте refresh token механизм:**
   Он должен автоматически обновлять токены.

2. **Очистите localStorage:**
   ```javascript
   // В браузерной консоли
   localStorage.clear();
   ```

3. **Залогиньтесь заново**

---

### 9. Hot Module Reload (HMR) Issues

**Симптомы:**
Изменения в коде не применяются автоматически.

**Решение:**

1. **Жесткая перезагрузка:** Ctrl+Shift+R (или Cmd+Shift+R на Mac)

2. **Перезапуск dev сервера:**
   ```bash
   # Ctrl+C для остановки
   npm run dev
   ```

3. **Очистка .svelte-kit:**
   ```bash
   rm -rf .svelte-kit
   npm run dev
   ```

---

### 10. Docker Container Issues

**Симптомы:**
Контейнер не запускается или падает.

**Решение:**

1. **Проверьте логи:**
   ```bash
   docker-compose logs -f frontend
   ```

2. **Пересоберите образ:**
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

3. **Проверьте environment variables:**
   ```bash
   docker-compose exec frontend env | grep VITE
   ```

---

## Получение помощи

Если проблема не решается:

1. **Проверьте документацию:**
   - README.md
   - MULTILINGUAL_USAGE.md
   - DOCKER.md

2. **Проверьте логи:**
   ```bash
   # Dev сервер логи
   npm run dev

   # Browser console
   F12 → Console tab

   # Network requests
   F12 → Network tab
   ```

3. **Создайте issue:**
   Включите:
   - Описание проблемы
   - Шаги для воспроизведения
   - Логи ошибок
   - Версию Node.js (`node --version`)
   - Версию npm (`npm --version`)

---

## Полезные команды

```bash
# Очистка и перестройка
npm ci                    # Чистая установка зависимостей
npx houdini generate      # Регенерация Houdini типов
npm run check             # TypeScript проверка
npm run lint              # ESLint
npm run format            # Prettier форматирование

# Тестирование
npm run test:unit         # Unit тесты
npm run test:e2e          # E2E тесты

# Build
npm run build             # Production build
npm run preview           # Preview production build
```

---

**Дата обновления:** 2025-10-14