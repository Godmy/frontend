# Исправление: Проблема с повторным входом после logout

## Проблема

После выхода из системы (logout) пользователь не мог повторно войти (login), и редирект на `/dashboard` не происходил.

## Причина

Проблема была в файле `src/lib/auth/composables/useAuth.svelte.ts` в функциях `login`, `register`, `loginWithGoogle`, `loginWithTelegram` и `checkAuth`.

**Цепочка событий, вызывающих баг:**

1. Пользователь успешно логинится → токены сохраняются → `result.success = true`
2. Вызывается `permissionService.initialize()` для загрузки ролей пользователя
3. Если запрос `myRoles` GraphQL падает (например, из-за проблем на бэкенде, сетевой ошибки или старых токенов в кеше), выбрасывается исключение
4. **`authStore.setAuthenticated()` НИКОГДА НЕ ВЫЗЫВАЕТСЯ** из-за исключения
5. **`authStore.setLoading(false)` тоже не вызывается**, т.к. выполнение функции прерывается
6. В `login/+page.svelte` исключение ловится в `catch`, но `result.success` был `true`, поэтому `goto('/dashboard')` не выполняется
7. **Результат:** пользователь "залогинен" (токены сохранены), но `isAuthenticated = false` в store, редирект не происходит

## Решение

Добавлены вложенные try-catch блоки для обработки ошибок загрузки ролей:

```typescript
async function login(credentials: LoginCredentials) {
    authStore.setLoading(true);
    authStore.setError(null);

    try {
        const result = await authService.login(credentials);

        if (result.success) {
            // Пытаемся загрузить роли, но не блокируем login если это не удалось
            let userRoles: Role[] = [];
            try {
                await permissionService.initialize();
                userRoles = permissionService.getRoles();
            } catch (permError) {
                console.warn('[useAuth] Failed to load user roles, continuing with empty roles:', permError);
            }

            authStore.setAuthenticated(result.data.user, result.data.tokens, userRoles);
        } else {
            authStore.setError(result.error);
        }

        authStore.setLoading(false);
        return result;
    } catch (error) {
        authStore.setLoading(false);
        authStore.setError(error instanceof Error ? error.message : 'Login failed');
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Login failed'
        };
    }
}
```

## Что изменилось

### ✅ Исправленные функции:

1. **`login(credentials)`** - Email/Password login
2. **`loginWithGoogle(data)`** - Google OAuth login
3. **`loginWithTelegram(data)`** - Telegram auth login
4. **`register(data)`** - Регистрация новых пользователей
5. **`checkAuth()`** - Проверка текущей авторизации

### ✅ Добавленная защита:

1. **Внешний try-catch** - ловит все неожиданные ошибки
2. **Внутренний try-catch** - ловит ошибки загрузки ролей без блокировки login
3. **Гарантированный вызов `authStore.setLoading(false)`** - предотвращает зависание UI
4. **Fallback на пустые роли** - пользователь может войти даже если роли не загрузились

## Преимущества решения

✅ **Resilience** - Пользователь может войти даже при сбое загрузки ролей
✅ **Better UX** - Нет зависания на экране загрузки
✅ **Graceful degradation** - Система работает с ограниченными правами вместо полного отказа
✅ **Proper error handling** - Все ошибки логируются и обрабатываются
✅ **Type safety** - Используется `Role[]` вместо `any[]`

## Тестирование

Для проверки исправления:

1. Войдите в систему
2. Выйдите из системы (logout)
3. Войдите снова с теми же credentials
4. Должен произойти редирект на `/dashboard`

**Если загрузка ролей не удалась:**
- В консоли появится предупреждение: `[useAuth] Failed to load user roles, continuing with empty roles`
- Пользователь будет залогинен с пустым массивом ролей
- Редирект на `/dashboard` произойдет успешно

## Связанные файлы

- `src/lib/auth/composables/useAuth.svelte.ts` - основной файл с исправлениями
- `src/lib/auth/services/PermissionService.ts` - сервис загрузки ролей
- `src/lib/auth/stores/authStore.svelte.ts` - store состояния авторизации
- `src/routes/login/+page.svelte` - страница входа
- `src/routes/dashboard/+page.svelte` - dashboard с кнопкой logout

## Дата исправления

2025-10-16
