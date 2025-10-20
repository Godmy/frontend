/**
 * Custom Application Error class
 */

import { ErrorType, ErrorSeverity, type AppError as IAppError } from './types';

export class AppError extends Error implements IAppError {
	type: ErrorType;
	severity: ErrorSeverity;
	code?: string;
	statusCode?: number;
	details?: Record<string, unknown>;
	originalError?: Error;

	constructor(
		message: string,
		type: ErrorType = ErrorType.UNKNOWN,
		severity: ErrorSeverity = ErrorSeverity.ERROR,
		options?: {
			code?: string;
			statusCode?: number;
			details?: Record<string, unknown>;
			originalError?: Error;
		}
	) {
		super(message);
		this.name = 'AppError';
		this.type = type;
		this.severity = severity;
		this.code = options?.code;
		this.statusCode = options?.statusCode;
		this.details = options?.details;
		this.originalError = options?.originalError;

		// Maintain proper stack trace (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, AppError);
		}
	}

	/**
	 * Create error from HTTP response
	 */
	static fromResponse(response: Response, message?: string): AppError {
		const statusCode = response.status;
		let type = ErrorType.SERVER;
		let severity = ErrorSeverity.ERROR;

		if (statusCode === 401) {
			type = ErrorType.AUTHENTICATION;
		} else if (statusCode === 403) {
			type = ErrorType.AUTHORIZATION;
		} else if (statusCode === 404) {
			type = ErrorType.NOT_FOUND;
		} else if (statusCode >= 400 && statusCode < 500) {
			type = ErrorType.VALIDATION;
		} else if (statusCode >= 500) {
			severity = ErrorSeverity.CRITICAL;
		}

		return new AppError(
			message || `HTTP Error: ${statusCode} ${response.statusText}`,
			type,
			severity,
			{ statusCode }
		);
	}

	/**
	 * Create error from GraphQL errors
	 */
	static fromGraphQLErrors(errors: Array<{ message: string; extensions?: Record<string, unknown> }>): AppError {
		const firstError = errors[0];
		const code = firstError.extensions?.code as string | undefined;

		let type = ErrorType.SERVER;
		if (code === 'UNAUTHENTICATED') {
			type = ErrorType.AUTHENTICATION;
		} else if (code === 'FORBIDDEN') {
			type = ErrorType.AUTHORIZATION;
		} else if (code === 'BAD_USER_INPUT') {
			type = ErrorType.VALIDATION;
		}

		return new AppError(
			firstError.message,
			type,
			ErrorSeverity.ERROR,
			{ code, details: { errors } }
		);
	}

	/**
	 * Create network error
	 */
	static networkError(message = 'Network error occurred', originalError?: Error): AppError {
		return new AppError(
			message,
			ErrorType.NETWORK,
			ErrorSeverity.ERROR,
			{ originalError }
		);
	}

	/**
	 * Check if error is an AppError
	 */
	static isAppError(error: unknown): error is AppError {
		return error instanceof AppError;
	}

	/**
	 * Get user-friendly message
	 */
	getUserMessage(): string {
		switch (this.type) {
			case ErrorType.NETWORK:
				return 'Network connection error. Please check your internet connection and try again.';
			case ErrorType.AUTHENTICATION:
				return 'Authentication required. Please log in and try again.';
			case ErrorType.AUTHORIZATION:
				return 'You do not have permission to perform this action.';
			case ErrorType.NOT_FOUND:
				return 'The requested resource was not found.';
			case ErrorType.VALIDATION:
				return this.message || 'Invalid input. Please check your data and try again.';
			case ErrorType.SERVER:
				return 'A server error occurred. Please try again later.';
			default:
				return this.message || 'An unexpected error occurred.';
		}
	}
}
