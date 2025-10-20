import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Config Module', () => {
	beforeEach(() => {
		// Reset modules before each test
		vi.resetModules();
	});

	it('should export config object', async () => {
		const { config } = await import('./config');

		expect(config).toBeDefined();
		expect(config).toHaveProperty('graphqlEndpoint');
		expect(config).toHaveProperty('appEnv');
		expect(config).toHaveProperty('appUrl');
		expect(config).toHaveProperty('debugEnabled');
		expect(config).toHaveProperty('isDevelopment');
		expect(config).toHaveProperty('isProduction');
		expect(config).toHaveProperty('isStaging');
	});

	it('should have valid environment values', async () => {
		const { config } = await import('./config');

		expect(typeof config.graphqlEndpoint).toBe('string');
		expect(typeof config.appEnv).toBe('string');
		expect(typeof config.appUrl).toBe('string');
		expect(typeof config.debugEnabled).toBe('boolean');
	});

	it('should determine production environment correctly', async () => {
		const { config } = await import('./config');

		expect(typeof config.isProduction).toBe('boolean');
		expect(typeof config.isDevelopment).toBe('boolean');
		expect(config.isProduction).toBe(!config.isDevelopment);
	});

	it('should export logger object', async () => {
		const { logger } = await import('./config');

		expect(logger).toBeDefined();
		expect(logger).toHaveProperty('log');
		expect(logger).toHaveProperty('error');
		expect(logger).toHaveProperty('warn');
		expect(logger).toHaveProperty('info');
	});

	it('logger methods should be functions', async () => {
		const { logger } = await import('./config');

		expect(typeof logger.log).toBe('function');
		expect(typeof logger.error).toBe('function');
		expect(typeof logger.warn).toBe('function');
		expect(typeof logger.info).toBe('function');
	});
});
