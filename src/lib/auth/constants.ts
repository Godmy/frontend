/**
 * Auth Constants
 */

// Storage keys
export const STORAGE_KEYS = {
	ACCESS_TOKEN: 'auth_access_token',
	REFRESH_TOKEN: 'auth_refresh_token',
	TOKEN_TYPE: 'auth_token_type',
	USER_DATA: 'auth_user_data'
} as const;

// Auth strategy names
export const AUTH_STRATEGIES = {
	EMAIL_PASSWORD: 'email_password',
	GOOGLE: 'google',
	TELEGRAM: 'telegram'
} as const;

// Permission scopes
export const PERMISSION_SCOPES = {
	OWN: 'own',
	ALL: 'all',
	TEAM: 'team'
} as const;

// Token type
export const TOKEN_TYPE = 'Bearer' as const;
