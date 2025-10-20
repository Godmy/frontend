/**
 * Auth Interfaces
 * Следует принципам Interface Segregation (ISP) и Dependency Inversion (DIP)
 * Разделяем интерфейсы по ответственности
 */

import type {
	AuthTokens,
	AuthResponse,
	LoginCredentials,
	RegistrationData,
	GoogleAuthData,
	TelegramAuthData,
	PasswordResetRequest,
	PasswordReset,
	EmailVerification,
	MessageResponse,
	AuthResult,
	Permission,
	Role
} from './types';

// ============= Token Storage Interface =============
// SRP: Отвечает только за хранение токенов

export interface ITokenStorage {
	saveTokens(tokens: AuthTokens): Promise<void>;
	getTokens(): Promise<AuthTokens | null>;
	clearTokens(): Promise<void>;
	getAccessToken(): Promise<string | null>;
	getRefreshToken(): Promise<string | null>;
}

// ============= Auth Strategy Interface =============
// OCP: Открыт для расширения через новые стратегии, закрыт для модификации

export interface IAuthStrategy {
	authenticate(credentials: unknown): Promise<AuthResult<AuthResponse>>;
	getStrategyName(): string;
}

// ============= Auth Provider Interface =============
// SRP: Отвечает за все операции авторизации

export interface IAuthProvider {
	login(credentials: LoginCredentials): Promise<AuthResult<AuthResponse>>;
	register(data: RegistrationData): Promise<AuthResult<AuthResponse>>;
	loginWithGoogle(data: GoogleAuthData): Promise<AuthResult<AuthResponse>>;
	loginWithTelegram(data: TelegramAuthData): Promise<AuthResult<AuthResponse>>;
	logout(): Promise<void>;
	refreshToken(): Promise<AuthResult<AuthTokens>>;
	getCurrentUser(): Promise<AuthResult<AuthResponse>>;
}

// ============= Password Management Interface =============
// ISP: Разделяем управление паролями в отдельный интерфейс

export interface IPasswordManager {
	requestPasswordReset(data: PasswordResetRequest): Promise<AuthResult<MessageResponse>>;
	resetPassword(data: PasswordReset): Promise<AuthResult<MessageResponse>>;
}

// ============= Email Verification Interface =============
// ISP: Разделяем верификацию email в отдельный интерфейс

export interface IEmailVerification {
	verifyEmail(data: EmailVerification): Promise<AuthResult<MessageResponse>>;
	resendVerificationEmail(email: string): Promise<AuthResult<MessageResponse>>;
}

// ============= Permission Checker Interface =============
// SRP: Отвечает только за проверку прав доступа

export interface IPermissionChecker {
	hasPermission(resource: string, action: string): boolean;
	hasRole(roleName: string): boolean;
	hasAnyRole(roleNames: string[]): boolean;
	hasAllRoles(roleNames: string[]): boolean;
	canAccess(resource: string, action: string, scope?: string): boolean;
	getRoles(): Role[];
	getPermissions(): Permission[];
}

// ============= Auth State Manager Interface =============
// SRP: Управление состоянием авторизации

export interface IAuthStateManager {
	setAuthenticated(user: AuthResponse): void;
	setUnauthenticated(): void;
	setLoading(isLoading: boolean): void;
	setError(error: string | null): void;
	setRoles(roles: Role[]): void;
	getState(): {
		user: AuthResponse['user'] | null;
		isAuthenticated: boolean;
		isLoading: boolean;
		error: string | null;
		roles: Role[];
	};
}

// ============= GraphQL Client Interface =============
// DIP: Зависимость от абстракции, а не от конкретной реализации GraphQL клиента

export interface IGraphQLClient {
	query<T>(query: string, variables?: Record<string, unknown>, accessToken?: string): Promise<T>;
	mutate<T>(mutation: string, variables?: Record<string, unknown>, accessToken?: string): Promise<T>;
}
