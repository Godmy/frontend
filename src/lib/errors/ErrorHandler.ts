/**
 * Centralized Error Handler
 * Handles all application errors and provides consistent error handling
 */

import { AppError } from './AppError';
import { ErrorType, ErrorSeverity, type ErrorHandlerOptions } from './types';
import { logger } from '$lib/config';

export type ErrorCallback = (error: AppError) => void;

class ErrorHandlerService {
	private errorCallbacks: ErrorCallback[] = [];

	/**
	 * Register a callback to be called when an error occurs
	 */
	onError(callback: ErrorCallback): () => void {
		this.errorCallbacks.push(callback);

		// Return unsubscribe function
		return () => {
			const index = this.errorCallbacks.indexOf(callback);
			if (index > -1) {
				this.errorCallbacks.splice(index, 1);
			}
		};
	}

	/**
	 * Notify all registered callbacks
	 */
	private notifyCallbacks(error: AppError): void {
		this.errorCallbacks.forEach(callback => {
			try {
				callback(error);
			} catch (err) {
				logger.error('Error in error callback:', err);
			}
		});
	}

	/**
	 * Handle any error
	 */
	handle(error: unknown, options: ErrorHandlerOptions = {}): AppError {
		const {
			showNotification = true,
			logError = true,
			rethrow = false
		} = options;

		// Convert to AppError
		const appError = this.normalizeError(error);

		// Log error
		if (logError) {
			this.logError(appError);
		}

		// Notify callbacks (for notifications, analytics, etc.)
		if (showNotification) {
			this.notifyCallbacks(appError);
		}

		// Rethrow if needed
		if (rethrow) {
			throw appError;
		}

		return appError;
	}

	/**
	 * Handle async operation with error handling
	 */
	async handleAsync<T>(
		operation: () => Promise<T>,
		options: ErrorHandlerOptions = {}
	): Promise<T> {
		try {
			return await operation();
		} catch (error) {
			this.handle(error, options);
			throw error;
		}
	}

	/**
	 * Convert any error to AppError
	 */
	private normalizeError(error: unknown): AppError {
		// Already an AppError
		if (AppError.isAppError(error)) {
			return error;
		}

		// Standard Error
		if (error instanceof Error) {
			return new AppError(
				error.message,
				ErrorType.UNKNOWN,
				ErrorSeverity.ERROR,
				{ originalError: error }
			);
		}

		// Response error
		if (error instanceof Response) {
			return AppError.fromResponse(error);
		}

		// GraphQL errors
		if (this.isGraphQLError(error)) {
			return AppError.fromGraphQLErrors(error.errors);
		}

		// Network error
		if (this.isNetworkError(error)) {
			return AppError.networkError('Network request failed');
		}

		// Unknown error
		return new AppError(
			'An unexpected error occurred',
			ErrorType.UNKNOWN,
			ErrorSeverity.ERROR,
			{ details: { originalError: error } }
		);
	}

	/**
	 * Log error based on severity
	 */
	private logError(error: AppError): void {
		const logData = {
			message: error.message,
			type: error.type,
			severity: error.severity,
			code: error.code,
			statusCode: error.statusCode,
			details: error.details,
			stack: error.stack
		};

		switch (error.severity) {
			case ErrorSeverity.INFO:
				logger.info('Error:', logData);
				break;
			case ErrorSeverity.WARNING:
				logger.warn('Error:', logData);
				break;
			case ErrorSeverity.ERROR:
			case ErrorSeverity.CRITICAL:
				logger.error('Error:', logData);
				break;
		}
	}

	/**
	 * Check if error is a GraphQL error
	 */
	private isGraphQLError(error: unknown): error is { errors: Array<{ message: string }> } {
		return (
			typeof error === 'object' &&
			error !== null &&
			'errors' in error &&
			Array.isArray((error as { errors: unknown }).errors)
		);
	}

	/**
	 * Check if error is a network error
	 */
	private isNetworkError(error: unknown): boolean {
		if (error instanceof TypeError) {
			return error.message.includes('fetch') || error.message.includes('network');
		}
		return false;
	}

	/**
	 * Create specific error types
	 */
	createError = {
		validation: (message: string, details?: Record<string, unknown>) =>
			new AppError(message, ErrorType.VALIDATION, ErrorSeverity.WARNING, { details }),

		authentication: (message = 'Authentication required') =>
			new AppError(message, ErrorType.AUTHENTICATION, ErrorSeverity.ERROR),

		authorization: (message = 'Permission denied') =>
			new AppError(message, ErrorType.AUTHORIZATION, ErrorSeverity.ERROR),

		notFound: (resource: string) =>
			new AppError(`${resource} not found`, ErrorType.NOT_FOUND, ErrorSeverity.WARNING),

		network: (message = 'Network error occurred') =>
			AppError.networkError(message),

		server: (message = 'Server error occurred') =>
			new AppError(message, ErrorType.SERVER, ErrorSeverity.CRITICAL)
	};
}

// Export singleton instance
export const errorHandler = new ErrorHandlerService();

// Export class for testing
export { ErrorHandlerService };
