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
export { authStoreWritable, user, isAuthenticated, isLoading, error, roles } from './stores/authStore';

// Composables
export { useAuth } from './composables/useAuth.svelte';
export { usePermissions } from './composables/usePermissions.svelte';

// Components
export { default as LoginForm } from './components/LoginForm.svelte';
export { default as RegisterForm } from './components/RegisterForm.svelte';
export { default as ProtectedRoute } from './components/ProtectedRoute.svelte';
export { default as RequirePermission } from './components/RequirePermission.svelte';
export { default as RequireRole } from './components/RequireRole.svelte';
