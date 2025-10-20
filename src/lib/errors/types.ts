/**
 * Error types and interfaces
 */

export enum ErrorType {
	NETWORK = 'network',
	VALIDATION = 'validation',
	AUTHENTICATION = 'authentication',
	AUTHORIZATION = 'authorization',
	NOT_FOUND = 'not_found',
	SERVER = 'server',
	UNKNOWN = 'unknown'
}

export enum ErrorSeverity {
	INFO = 'info',
	WARNING = 'warning',
	ERROR = 'error',
	CRITICAL = 'critical'
}

export interface AppError extends Error {
	type: ErrorType;
	severity: ErrorSeverity;
	code?: string;
	statusCode?: number;
	details?: Record<string, unknown>;
	originalError?: Error;
}

export interface ErrorHandlerOptions {
	showNotification?: boolean;
	logError?: boolean;
	rethrow?: boolean;
}
