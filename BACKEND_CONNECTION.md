# Backend Connection Guide

## Проблема: Сервер недоступен (500 ошибка)

Если вы видите в консоли браузера ошибки типа:

```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
[GraphQLAdapter] HTTP Error: 500
Login failed: Server error. Please try again later or contact support.
```

Это означает, что **backend GraphQL сервер недоступен или не запущен**.

---

## Решение

### 1. Проверьте, что backend сервер запущен

Backend сервер должен работать на `http://127.0.0.1:8000`.

#### Для Django backend:

```bash
cd ../backend  # Перейдите в папку backend
python manage.py runserver 127.0.0.1:8000
```

#### Для других backend фреймворков:

Убедитесь, что GraphQL endpoint доступен по адресу `http://127.0.0.1:8000/graphql/`

### 2. Проверьте доступность GraphQL API

Откройте браузер и перейдите по адресу:

```
http://127.0.0.1:8000/graphql/
```

Вы должны увидеть GraphQL Playground или GraphiQL интерфейс.

### 3. Проверьте конфигурацию Vite proxy

Убедитесь, что в `vite.config.ts` настроен правильный proxy:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/graphql': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  }
});
```

### 4. Проверьте переменную окружения

В файле `.env`:

```env
VITE_GRAPHQL_ENDPOINT=/graphql/
```

Используется **относительный путь** `/graphql/`, который проксируется через Vite на `http://127.0.0.1:8000/graphql/`.

---

## Альтернативная конфигурация (без proxy)

Если вы хотите использовать прямое подключение без Vite proxy:

### 1. Измените `.env`:

```env
VITE_GRAPHQL_ENDPOINT=http://127.0.0.1:8000/graphql/
```

### 2. Настройте CORS на backend

Django backend должен разрешить запросы с `http://localhost:5173`:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

---

## Улучшенные сообщения об ошибках

Теперь приложение показывает более понятные сообщения пользователям:

### Код ошибки → Сообщение

| HTTP Status | Сообщение для пользователя |
|-------------|----------------------------|
| **500** | "Server error. Please try again later or contact support." |
| **503** | "Service unavailable. The server may be down for maintenance." |
| **404** | "API endpoint not found. Please check your configuration." |
| **401** | "Authentication failed. Please check your credentials." |
| **403** | "Access denied. You do not have permission to perform this action." |
| **Network Error** | "Cannot connect to server. Please check your internet connection or try again later." |

---

## Debugging

### Включите debug режим

В `.env`:

```env
VITE_DEBUG=true
```

Это выведет подробные логи в консоль браузера:

```
[AuthContext] Initializing with endpoint: /graphql/
[useAuth] Login attempt with credentials: { username: "..." }
[GraphQLAdapter] Request: { endpoint: "/graphql/", query: "..." }
[GraphQLAdapter] Response status: 500 Internal Server Error
[GraphQLAdapter] HTTP Error: 500
```

### Проверьте логи backend сервера

Проверьте терминал, где запущен backend, на наличие ошибок:

```bash
# Django
python manage.py runserver 127.0.0.1:8000
# Смотрите на вывод в консоли
```

---

## Частые проблемы

### 1. Backend не запущен
**Симптомы:** `Failed to load resource: net::ERR_CONNECTION_REFUSED`

**Решение:** Запустите backend сервер.

### 2. Неправильный порт
**Симптомы:** `Failed to load resource: 404 Not Found`

**Решение:** Проверьте, что backend работает на порту `8000`, а не на другом.

### 3. CORS ошибки (если без proxy)
**Симптомы:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Решение:**
- Используйте Vite proxy (рекомендуется)
- Или настройте CORS на backend

### 4. GraphQL schema не найдена
**Симптомы:** Ошибка 500 при запросах

**Решение:**
```bash
# Django
python manage.py migrate
python manage.py makemigrations
```

---

## Проверочный checklist

- [ ] Backend сервер запущен на `http://127.0.0.1:8000`
- [ ] GraphQL endpoint доступен по адресу `http://127.0.0.1:8000/graphql/`
- [ ] В `.env` указан правильный `VITE_GRAPHQL_ENDPOINT`
- [ ] Vite dev server запущен (`yarn dev`)
- [ ] В консоли браузера нет CORS ошибок
- [ ] Backend логи не показывают ошибок

---

## Контакты для поддержки

Если проблема не решена:

1. Проверьте логи backend сервера
2. Проверьте консоль браузера (F12 → Console)
3. Проверьте Network tab в DevTools
4. Обратитесь к документации backend API

---

## Дата обновления

2025-10-16
