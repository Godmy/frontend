import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EmailPasswordStrategy } from './EmailPasswordStrategy';
import type { IGraphQLClient } from '../interfaces';
import type { LoginCredentials, User, AuthTokens, AuthResult } from '../types';
import { AUTH_STRATEGIES } from '../constants';

function assertSuccess<T>(result: AuthResult<T>): asserts result is { success: true; data: T } {
	if (!result.success) {
		throw new Error(`Expected success, got error: ${result.error}`);
	}
}

function assertFailure<T>(result: AuthResult<T>): asserts result is { success: false; error: string } {
	if (result.success) {
		throw new Error('Expected failure, got success');
	}
}

describe('EmailPasswordStrategy', () => {
	let strategy: EmailPasswordStrategy;
	let mockGraphQLClient: IGraphQLClient;

	const mockTokens = {
		accessToken: 'test-access-token',
		refreshToken: 'test-refresh-token',
		tokenType: 'Bearer'
	};

	const mockUser: User = {
		id: 1,
		email: 'test@example.com',
		username: 'testuser',
		isActive: true,
		isVerified: true,
		profile: {
			id: 1,
			firstName: 'Test',
			lastName: 'User',
			avatar: undefined,
			language: 'en',
			timezone: 'UTC'
		}
	};

	beforeEach(() => {
		mockGraphQLClient = {
			query: vi.fn(),
			mutate: vi.fn()
		};

		strategy = new EmailPasswordStrategy(mockGraphQLClient);
	});

	describe('getStrategyName', () => {
		it('should return correct strategy name', () => {
			expect(strategy.getStrategyName()).toBe(AUTH_STRATEGIES.EMAIL_PASSWORD);
		});
	});

	describe('authenticate', () => {
		const validCredentials: LoginCredentials = {
			username: 'testuser',
			password: 'password123'
		};

		it('should authenticate successfully with valid credentials', async () => {
			vi.spyOn(mockGraphQLClient, 'mutate').mockResolvedValue({
				login: mockTokens
			});

			vi.spyOn(mockGraphQLClient, 'query').mockResolvedValue({
				me: mockUser
			});

			const result = await strategy.authenticate(validCredentials);

			expect(result.success).toBe(true);
			assertSuccess(result);
			expect(result.data).toEqual({
				user: mockUser,
				tokens: mockTokens
			});

			expect(mockGraphQLClient.mutate).toHaveBeenCalledWith(
				expect.stringContaining('mutation Login'),
				{
					input: {
						username: validCredentials.username,
						password: validCredentials.password
					}
				}
			);

			expect(mockGraphQLClient.query).toHaveBeenCalledWith(
				expect.stringContaining('query Me'),
				undefined,
				mockTokens.accessToken
			);
		});

		it('should handle mutation errors', async () => {
			const errorMessage = 'Invalid credentials';
			vi.spyOn(mockGraphQLClient, 'mutate').mockRejectedValue(new Error(errorMessage));

			const result = await strategy.authenticate(validCredentials);

			expect(result.success).toBe(false);
			assertFailure(result);
			expect(result.error).toBe(errorMessage);
		});

		it('should handle user data fetch errors', async () => {
			vi.spyOn(mockGraphQLClient, 'mutate').mockResolvedValue({
				login: mockTokens
			});

			const errorMessage = 'Failed to fetch user data';
			vi.spyOn(mockGraphQLClient, 'query').mockRejectedValue(new Error(errorMessage));

			const result = await strategy.authenticate(validCredentials);

			expect(result.success).toBe(false);
			assertFailure(result);
			expect(result.error).toBe(errorMessage);
		});

		it('should handle non-Error exceptions', async () => {
			vi.spyOn(mockGraphQLClient, 'mutate').mockRejectedValue('Unknown error');

			const result = await strategy.authenticate(validCredentials);

			expect(result.success).toBe(false);
			assertFailure(result);
			expect(result.error).toBe('Authentication failed');
		});

		it('should work with email instead of username', async () => {
			const emailCredentials = {
				username: 'test@example.com',
				password: 'password123'
			};

			vi.spyOn(mockGraphQLClient, 'mutate').mockResolvedValue({
				login: mockTokens
			});

			vi.spyOn(mockGraphQLClient, 'query').mockResolvedValue({
				me: mockUser
			});

			const result = await strategy.authenticate(emailCredentials);

			expect(result.success).toBe(true);
			assertSuccess(result);
			expect(mockGraphQLClient.mutate).toHaveBeenCalledWith(
				expect.any(String),
				{
					input: {
						username: emailCredentials.username,
						password: emailCredentials.password
					}
				}
			);
		});

		it('should pass access token to user data query', async () => {
			const customAccessToken = 'custom-access-token';
			const customTokens = {
				...mockTokens,
				accessToken: customAccessToken
			};

			vi.spyOn(mockGraphQLClient, 'mutate').mockResolvedValue({
				login: customTokens
			});

			vi.spyOn(mockGraphQLClient, 'query').mockResolvedValue({
				me: mockUser
			});

			await strategy.authenticate(validCredentials);

			expect(mockGraphQLClient.query).toHaveBeenCalledWith(
				expect.any(String),
				undefined,
				customAccessToken
			);
		});

		it('should handle user without profile', async () => {
			const userWithoutProfile = {
				...mockUser,
				profile: undefined
			};

			vi.spyOn(mockGraphQLClient, 'mutate').mockResolvedValue({
				login: mockTokens
			});

			vi.spyOn(mockGraphQLClient, 'query').mockResolvedValue({
				me: userWithoutProfile
			});

			const result = await strategy.authenticate(validCredentials);

			expect(result.success).toBe(true);
			assertSuccess(result);
			expect(result.data.user.profile).toBeUndefined();
		});
	});
});
