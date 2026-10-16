/**
 * Auth Module - Main Export
 * Экспортирует все публичные API модуля авторизации
 */

export * from '$module/auth';

// Типы, которых нет в модуле отдельными именами (выведены из его контрактов)
export type { GoogleAuthData } from './type/object/google-auth-data';
export type { TelegramAuthData } from './type/object/telegram-auth-data';
export type { PasswordReset } from './type/object/password-reset';
export type { EmailVerification } from './type/object/email-verification';

// Services
export { AuthService } from './class/service/auth';
export { PermissionService } from './class/service/permission';

// Context
export { authContext, getAuthService, getPermissionService, getTokenStorage } from './class/context/auth';

// Stores
export { authStore } from './function/store/auth/index.svelte';

// Composables
export { useAuth } from './function/state/auth/index.svelte';
export { usePermissions } from './function/state/permissions/index.svelte';

// UI компоненты авторизации — в приватном модуле $module/auth (src/module/auth)


