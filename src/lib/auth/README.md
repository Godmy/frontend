# Auth Module - Система авторизации по SOLID принципам

Полнофункциональная система авторизации для SvelteKit, построенная с использованием принципов SOLID.

## Архитектура

### SOLID Принципы

#### 1. Single Responsibility Principle (SRP)
Каждый класс/модуль отвечает за одну задачу:
- **TokenStorage** - управление токенами
- **AuthService** - бизнес-логика авторизации
- **PermissionService** - проверка прав доступа
- **AuthStore** - управление состоянием

#### 2. Open/Closed Principle (OCP)
Система открыта для расширения через паттерн Strategy:
- **IAuthStrategy** - базовый интерфейс
- **EmailPasswordStrategy** - авторизация через email/password
- **GoogleAuthStrategy** - авторизация через Google
- **TelegramAuthStrategy** - авторизация через Telegram

#### 3. Liskov Substitution Principle (LSP)
Все стратегии взаимозаменяемы и реализуют единый интерфейс.

#### 4. Interface Segregation Principle (ISP)
Разделенные интерфейсы для разных аспектов:
- **ITokenStorage** - хранение токенов
- **IAuthProvider** - операции авторизации
- **IPermissionChecker** - проверка прав
- **IPasswordManager** - управление паролями
- **IEmailVerification** - верификация email

#### 5. Dependency Inversion Principle (DIP)
Все зависимости от абстракций через **AuthContext** (DI Container).

## Структура проекта

```
src/lib/auth/
├── types.ts                    # Типы данных
├── interfaces.ts               # Интерфейсы
├── constants.ts                # Константы
├── AuthContext.ts              # DI Container
├── index.ts                    # Публичный API
├── adapters/
│   └── GraphQLAdapter.ts       # Адаптер для GraphQL
├── storage/
│   └── TokenStorage.ts         # Хранение токенов
├── strategies/
│   ├── EmailPasswordStrategy.ts
│   ├── GoogleAuthStrategy.ts
│   └── TelegramAuthStrategy.ts
├── services/
│   ├── AuthService.ts          # Основной сервис
│   └── PermissionService.ts    # Сервис прав доступа
├── stores/
│   ├── authStore.svelte.ts     # Store (Svelte 5 Runes)
│   └── authStore.ts            # Store (Writable)
├── composables/
│   ├── useAuth.svelte.ts       # Хук авторизации
│   └── usePermissions.svelte.ts # Хук прав доступа
└── components/
    ├── LoginForm.svelte
    ├── RegisterForm.svelte
    ├── ProtectedRoute.svelte
    ├── RequirePermission.svelte
    └── RequireRole.svelte
```

## Быстрый старт

### 1. Базовое использование

```svelte
<script lang="ts">
  import { useAuth } from '$lib/auth';

  const auth = useAuth();

  async function handleLogin() {
    const result = await auth.login({
      username: 'user@example.com',
      password: 'password123'
    });

    if (result.success) {
      // Успешная авторизация
    }
  }
</script>

<button onclick={handleLogin}>Login</button>
```

### 2. Использование готовых компонентов

```svelte
<script lang="ts">
  import { LoginForm } from '$lib/auth';
</script>

<LoginForm />
```

### 3. Защита маршрутов

```svelte
<script lang="ts">
  import { ProtectedRoute } from '$lib/auth';
</script>

<ProtectedRoute>
  <h1>Protected Content</h1>
</ProtectedRoute>
```

### 4. Проверка прав доступа

```svelte
<script lang="ts">
  import { RequirePermission, RequireRole } from '$lib/auth';
</script>

<RequirePermission resource="articles" action="create">
  <button>Create Article</button>
</RequirePermission>

<RequireRole role="admin">
  <button>Admin Panel</button>
</RequireRole>
```

## Примеры использования

### Авторизация через Google

```svelte
<script lang="ts">
  import { useAuth } from '$lib/auth';

  const auth = useAuth();

  async function handleGoogleLogin(idToken: string) {
    const result = await auth.loginWithGoogle({ idToken });
    if (result.success) {
      console.log('Google login successful');
    }
  }
</script>
```

### Авторизация через Telegram

```svelte
<script lang="ts">
  import { useAuth } from '$lib/auth';

  const auth = useAuth();

  async function handleTelegramLogin(telegramData) {
    const result = await auth.loginWithTelegram(telegramData);
    if (result.success) {
      console.log('Telegram login successful');
    }
  }
</script>
```

### Регистрация

```svelte
<script lang="ts">
  import { useAuth } from '$lib/auth';

  const auth = useAuth();

  async function handleRegister() {
    const result = await auth.register({
      username: 'newuser',
      email: 'user@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    });
  }
</script>
```

### Восстановление пароля

```svelte
<script lang="ts">
  import { useAuth } from '$lib/auth';

  const auth = useAuth();

  async function requestReset() {
    const result = await auth.requestPasswordReset({
      email: 'user@example.com'
    });
  }

  async function resetPassword(token: string, newPassword: string) {
    const result = await auth.resetPassword({
      token,
      newPassword
    });
  }
</script>
```

### Проверка прав программно

```svelte
<script lang="ts">
  import { usePermissions } from '$lib/auth';

  const permissions = usePermissions();

  const canEdit = permissions.hasPermission('articles', 'edit');
  const isAdmin = permissions.hasRole('admin');
  const canDelete = permissions.canAccess('articles', 'delete', 'all');
</script>

{#if canEdit}
  <button>Edit</button>
{/if}
```

### Использование Store напрямую

```svelte
<script lang="ts">
  import { authStore } from '$lib/auth';

  // Svelte 5 Runes
  const user = $derived(authStore.user);
  const isAuthenticated = $derived(authStore.isAuthenticated);
</script>

{#if isAuthenticated}
  <p>Welcome, {user?.username}!</p>
{/if}
```

### Использование Writable Store

```svelte
<script lang="ts">
  import { user, isAuthenticated } from '$lib/auth';
</script>

{#if $isAuthenticated}
  <p>Welcome, {$user?.username}!</p>
{/if}
```

## API Reference

### useAuth()

Основной хук для работы с авторизацией.

**State:**
- `user` - текущий пользователь
- `isAuthenticated` - статус авторизации
- `isLoading` - статус загрузки
- `error` - ошибка
- `roles` - роли пользователя

**Methods:**
- `login(credentials)` - вход
- `loginWithGoogle(data)` - вход через Google
- `loginWithTelegram(data)` - вход через Telegram
- `register(data)` - регистрация
- `logout()` - выход
- `refreshToken()` - обновление токена
- `requestPasswordReset(data)` - запрос восстановления пароля
- `resetPassword(data)` - сброс пароля
- `verifyEmail(data)` - верификация email
- `resendVerificationEmail(email)` - повторная отправка письма
- `checkAuth()` - проверка авторизации

### usePermissions()

Хук для работы с правами доступа.

**Methods:**
- `hasPermission(resource, action)` - проверка прав
- `canAccess(resource, action, scope?)` - проверка доступа
- `hasRole(roleName)` - проверка роли
- `hasAnyRole(roleNames)` - проверка любой из ролей
- `hasAllRoles(roleNames)` - проверка всех ролей
- `getRoles()` - получение ролей
- `getPermissions()` - получение прав

## Расширение функциональности

### Добавление новой стратегии авторизации

1. Создайте класс, реализующий `IAuthStrategy`:

```typescript
import type { IAuthStrategy, IGraphQLClient } from '../interfaces';
import type { AuthResponse, AuthResult } from '../types';

export class CustomAuthStrategy implements IAuthStrategy {
  private graphqlClient: IGraphQLClient;

  constructor(graphqlClient: IGraphQLClient) {
    this.graphqlClient = graphqlClient;
  }

  async authenticate(credentials: unknown): Promise<AuthResult<AuthResponse>> {
    // Ваша логика авторизации
  }

  getStrategyName(): string {
    return 'custom';
  }
}
```

2. Добавьте стратегию в `AuthService`:

```typescript
import { CustomAuthStrategy } from '../strategies/CustomAuthStrategy';

export class AuthService {
  private customAuthStrategy: CustomAuthStrategy;

  constructor(tokenStorage: ITokenStorage, graphqlClient: IGraphQLClient) {
    // ...
    this.customAuthStrategy = new CustomAuthStrategy(graphqlClient);
  }

  async loginWithCustom(data: CustomAuthData): Promise<AuthResult<AuthResponse>> {
    const result = await this.customAuthStrategy.authenticate(data);
    if (result.success) {
      await this.tokenStorage.saveTokens(result.data.tokens);
    }
    return result;
  }
}
```

## Тестирование

Все сервисы реализуют интерфейсы, что упрощает создание моков для тестирования:

```typescript
import { AuthService } from '$lib/auth';
import type { ITokenStorage, IGraphQLClient } from '$lib/auth';

// Mock dependencies
const mockTokenStorage: ITokenStorage = {
  saveTokens: vi.fn(),
  getTokens: vi.fn(),
  clearTokens: vi.fn(),
  getAccessToken: vi.fn(),
  getRefreshToken: vi.fn()
};

const mockGraphQLClient: IGraphQLClient = {
  query: vi.fn(),
  mutate: vi.fn()
};

const authService = new AuthService(mockTokenStorage, mockGraphQLClient);
```

## Лицензия

MIT
