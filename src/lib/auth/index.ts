/**
 * Auth Module - Main Export
 * Экспортирует все публичные API модуля авторизации
 */

// Types
export * from './types';

// Constants
export * from './constants';

// Services
export { AuthService } from './services/AuthService';
export { PermissionService } from './services/PermissionService';

// Context
export { authContext, getAuthService, getPermissionService, getTokenStorage } from './AuthContext';

// Stores
export { authStore } from './stores/authStore.svelte';

// Composables
export { useAuth } from './composables/useAuth.svelte';
export { usePermissions } from './composables/usePermissions.svelte';

// UI компоненты авторизации перенесены в $stylist/user/component/organism/auth-guard
