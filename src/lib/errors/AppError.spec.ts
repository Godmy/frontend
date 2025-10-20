import { describe, it, expect } from 'vitest';
import { AppError } from './AppError';
import { ErrorType, ErrorSeverity } from './types';

describe('AppError', () => {
	it('should create an AppError instance', () => {
		const error = new AppError('Test error', ErrorType.VALIDATION);

		expect(error).toBeInstanceOf(AppError);
		expect(error).toBeInstanceOf(Error);
		expect(error.message).toBe('Test error');
		expect(error.type).toBe(ErrorType.VALIDATION);
	});

	it('should set default error type to UNKNOWN', () => {
		const error = new AppError('Test error');

		expect(error.type).toBe(ErrorType.UNKNOWN);
	});

	it('should store error details', () => {
		const details = { field: 'email', reason: 'invalid format' };
		const error = new AppError(
			'Validation failed',
			ErrorType.VALIDATION,
			ErrorSeverity.WARNING,
			{ details }
		);

		expect(error.details).toEqual(details);
	});

	it('should have correct name property', () => {
		const error = new AppError('Test error');

		expect(error.name).toBe('AppError');
	});

	it('should support all error types', () => {
		const types = [
			ErrorType.VALIDATION,
			ErrorType.AUTHENTICATION,
			ErrorType.AUTHORIZATION,
			ErrorType.NOT_FOUND,
			ErrorType.NETWORK,
			ErrorType.SERVER,
			ErrorType.UNKNOWN
		];

		types.forEach(type => {
			const error = new AppError('Test', type);
			expect(error.type).toBe(type);
		});
	});
});
