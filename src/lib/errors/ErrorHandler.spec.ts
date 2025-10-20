import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ErrorHandlerService, errorHandler } from './ErrorHandler';
import { AppError } from './AppError';
import { ErrorType, ErrorSeverity } from './types';

describe('ErrorHandler', () => {
	let handler: ErrorHandlerService;

	beforeEach(() => {
		handler = new ErrorHandlerService();
	});

	it('should create ErrorHandler instance', () => {
		expect(handler).toBeInstanceOf(ErrorHandlerService);
	});

	it('should handle AppError', () => {
		const appError = new AppError('Test error', ErrorType.VALIDATION);
		const result = handler.handle(appError, { showNotification: false, logError: false });

		expect(result).toBeInstanceOf(AppError);
		expect(result.message).toBe('Test error');
		expect(result.type).toBe(ErrorType.VALIDATION);
	});

	it('should normalize generic Error to AppError', () => {
		const genericError = new Error('Generic error');
		const result = handler.handle(genericError, { showNotification: false, logError: false });

		expect(result).toBeInstanceOf(AppError);
		expect(result.message).toBe('Generic error');
		expect(result.type).toBe(ErrorType.UNKNOWN);
	});

	it('should handle unknown value as AppError', () => {
		const result = handler.handle({ foo: 'bar' }, { showNotification: false, logError: false });

		expect(result).toBeInstanceOf(AppError);
		expect(result.message).toBe('An unexpected error occurred');
		expect(result.type).toBe(ErrorType.UNKNOWN);
	});

	it('should register and notify error callbacks', () => {
		const callback = vi.fn();
		const unsubscribe = handler.onError(callback);

		const error = new AppError('Test', ErrorType.VALIDATION);
		handler.handle(error, { logError: false });

		expect(callback).toHaveBeenCalledWith(error);

		// Test unsubscribe
		unsubscribe();
		callback.mockClear();
		handler.handle(error, { logError: false });
		expect(callback).not.toHaveBeenCalled();
	});

	it('should have createError helper methods', () => {
		expect(handler.createError.validation).toBeDefined();
		expect(handler.createError.authentication).toBeDefined();
		expect(handler.createError.authorization).toBeDefined();
		expect(handler.createError.notFound).toBeDefined();
		expect(handler.createError.network).toBeDefined();
		expect(handler.createError.server).toBeDefined();
	});

	it('should create validation error', () => {
		const error = handler.createError.validation('Invalid input');

		expect(error).toBeInstanceOf(AppError);
		expect(error.type).toBe(ErrorType.VALIDATION);
		expect(error.message).toBe('Invalid input');
	});

	it('should create authentication error', () => {
		const error = handler.createError.authentication('Not authenticated');

		expect(error).toBeInstanceOf(AppError);
		expect(error.type).toBe(ErrorType.AUTHENTICATION);
		expect(error.message).toBe('Not authenticated');
	});

	it('should create not found error', () => {
		const error = handler.createError.notFound('User');

		expect(error).toBeInstanceOf(AppError);
		expect(error.type).toBe(ErrorType.NOT_FOUND);
		expect(error.message).toBe('User not found');
	});

	it('should handle async operations', async () => {
		const operation = vi.fn().mockResolvedValue('success');
		const result = await handler.handleAsync(operation, { showNotification: false, logError: false });

		expect(result).toBe('success');
		expect(operation).toHaveBeenCalled();
	});

	it('should handle async operation errors', async () => {
		const error = new Error('Async error');
		const operation = vi.fn().mockRejectedValue(error);

		await expect(
			handler.handleAsync(operation, { showNotification: false, logError: false })
		).rejects.toThrow('Async error');
	});

	it('should use singleton instance', () => {
		expect(errorHandler).toBeInstanceOf(ErrorHandlerService);
	});
});
