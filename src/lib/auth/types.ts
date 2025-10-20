/**
 * Auth Types & Interfaces
 * Следует принципу Interface Segregation Principle (ISP)
 */

// ============= Core Types =============

export type User = {
	id: number;
	email: string;
	username: string;
	isActive: boolean;
	isVerified: boolean;
	profile?: UserProfile;
};

export type UserProfile = {
	id: number;
	firstName?: string;
	lastName?: string;
	avatar?: string;
	language: string;
	timezone: string;
};

export type AuthTokens = {
	accessToken: string;
	refreshToken: string;
	tokenType: string;
};

export type Role = {
	id: number;
	name: string;
	description?: string;
	permissions: Permission[];
};

export type Permission = {
	id: number;
	resource: string;
	action: string;
	scope: string;
	roleId: number;
};

// ============= Input Types =============

export type LoginCredentials = {
	username: string;
	password: string;
};

export type RegistrationData = {
	username: string;
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
};

export type GoogleAuthData = {
	idToken: string;
};

export type TelegramAuthData = {
	id: string;
	hash: string;
	authDate: string;
	firstName?: string;
	lastName?: string;
	username?: string;
	photoUrl?: string;
};

export type PasswordResetRequest = {
	email: string;
};

export type PasswordReset = {
	token: string;
	newPassword: string;
};

export type EmailVerification = {
	token: string;
};

// ============= Response Types =============

export type AuthResponse = {
	user: User;
	tokens: AuthTokens;
};

export type MessageResponse = {
	success: boolean;
	message: string;
};

// ============= Auth State =============

export type AuthState = {
	user: User | null;
	tokens: AuthTokens | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	roles: Role[];
};

// ============= Auth Result =============

export type AuthResult<T = AuthResponse> =
	| { success: true; data: T }
	| { success: false; error: string };
