# Store Implementation Patterns

## Overview

This document outlines the patterns used in the store implementations across the frontend application. All stores follow the Svelte 5 Runes pattern with a class-based approach for maintaining state.

## Common Store Patterns

### 1. State Management with $state

All stores use Svelte 5's `$state` rune to maintain reactive state:

```typescript
class ExampleStore {
  private state = $state<StateType>({
    // Initial state values
  });
}
```

### 2. Getter Properties

Stores expose state values through getter properties rather than direct access:

```typescript
class ExampleStore {
  // ... state definition

  get currentValue() {
    return this.state.value;
  }
}
```

### 3. Named Setter Methods

Stores use descriptive method names for state updates rather than direct property assignment:

```typescript
class ExampleStore {
  // ... state definition

  setValue(newValue: string) {
    this.state.value = newValue;
  }
}
```

## Individual Store Documentation

### AuthStore

Location: `src/lib/auth/stores/authStore.svelte.ts`

**State Structure:**
- `user: User | null` - Current authenticated user
- `tokens: AuthTokens | null` - Authentication tokens
- `isAuthenticated: boolean` - Authentication status
- `isLoading: boolean` - Loading state for auth operations
- `error: string | null` - Error messages
- `roles: Role[]` - User roles

**Public Methods:**
- `setAuthenticated(user: User, tokens: AuthTokens, roles: Role[] = [])` - Set authenticated state
- `setUnauthenticated()` - Clear authentication state
- `setLoading(isLoading: boolean)` - Set loading state
- `setError(error: string | null)` - Set error state
- `setRoles(roles: Role[])` - Update user roles
- `updateUser(user: Partial<User>)` - Update user properties
- `reset()` - Reset to initial state

**Usage Example:**
```typescript
import { authStore } from '$lib/auth/stores/authStore';

// Check authentication
if (authStore.isAuthenticated) {
  console.log('User is authenticated', authStore.user);
}

// Update authentication state
authStore.setAuthenticated(user, tokens, roles);
```

### ThemeStore

Location: `src/lib/stores/themeStore.svelte.ts`

**State Structure:**
- `_currentTheme: 'light' | 'dark' | 'auto'` - Current theme setting

**Public Methods:**
- `get currentTheme()` - Get the stored theme value
- `get activeTheme()` - Get the effective theme ('light' or 'dark')
- `setTheme(theme: 'light' | 'dark' | 'auto')` - Set the theme
- `init()` - Initialize from localStorage
- `toggleTheme()` - Toggle between light/dark themes
- `applyTheme()` - Apply theme to DOM (private)

**Usage Example:**
```typescript
import { themeStore } from '$lib/stores/themeStore';

// Get active theme
const active = themeStore.activeTheme;

// Set theme
themeStore.setTheme('dark');
```

### LanguageStore

Location: `src/lib/stores/languageStore.svelte.ts`

**State Structure:**
- `_currentLanguageId: number | null` - Current language ID (null for all languages)

**Public Methods:**
- `get currentLanguageId()` - Get current language ID
- `setLanguage(languageId: number | null)` - Set language
- `init()` - Initialize from localStorage
- `reset()` - Reset to default language

**Usage Example:**
```typescript
import { languageStore } from '$lib/stores/languageStore';

// Get current language
const currentLang = languageStore.currentLanguageId;

// Set language
languageStore.setLanguage(1); // Set to Russian
```

### NotificationStore

Location: `src/lib/notifications/notificationStore.svelte.ts`

**State Structure:**
- `notifications: Notification[]` - Array of active notifications
- `idCounter: number` - Counter for generating unique IDs

**Public Methods:**
- `get items()` - Get all notifications
- `success(message: string, options?: NotificationOptions)` - Show success notification
- `error(message: string, options?: NotificationOptions)` - Show error notification
- `warning(message: string, options?: NotificationOptions)` - Show warning notification
- `info(message: string, options?: NotificationOptions)` - Show info notification
- `dismiss(id: string)` - Dismiss a notification
- `dismissAll()` - Dismiss all notifications
- `clearType(type: NotificationType)` - Clear notifications of a specific type

**Usage Example:**
```typescript
import { notificationStore } from '$lib/notifications';

// Show a notification
notificationStore.success('Operation completed successfully');

// Dismiss a notification
notificationStore.dismiss('notification-1');
```

## Standardization Guidelines

### 1. Naming Convention
- Getter methods should return descriptive values
- Setter methods should be prefixed with `set` (e.g., `setTheme`, `setUser`)
- Update methods should be descriptive (e.g., `updateUser`, `toggleTheme`)

### 2. Type Safety
- All state properties should have explicit TypeScript types
- Method parameters should be typed
- Return types should be specified where possible

### 3. Error Handling
- Implement basic validation where appropriate
- Use descriptive error messages
- Avoid throwing errors in getters, prefer them in setters

### 4. Initialization
- Include an `init()` method for stores that require initialization from localStorage or other sources
- This method should be called when the application starts

### 5. Lifecycle Management
- Include a `reset()` method where appropriate to restore initial state
- Handle cleanup for any resources or event listeners