/**
 * Application configuration
 * Centralized environment variables management
 */

interface AppConfig {
	graphqlEndpoint: string;
	appEnv: 'development' | 'staging' | 'production';
	appUrl: string;
	isDevelopment: boolean;
	isProduction: boolean;
	isStaging: boolean;
	debugEnabled: boolean;
}

function getEnvVar(key: string, defaultValue?: string): string {
	const value = import.meta.env[key];
	if (value === undefined && defaultValue === undefined) {
		throw new Error(`Environment variable ${key} is not defined`);
	}
	return value ?? defaultValue ?? '';
}

// Helper to determine if we're running on the server
function isServer(): boolean {
	return typeof window === 'undefined';
}

// Get GraphQL endpoint based on environment (server vs client)
function getGraphQLEndpoint(): string {
	// On server (SSR), use internal Docker network endpoint
	if (isServer()) {
		// Try to get server-side API URL from environment
		const serverEndpoint =
			import.meta.env.API_BASE_URL ||
			import.meta.env.BACKEND_URL && `${import.meta.env.BACKEND_URL}/graphql` ||
			'http://backend:8000/graphql';
		return serverEndpoint;
	}

	// On client (browser), use the configured endpoint
	// Note: No trailing slash - matches vite.config.ts proxy setting
	return getEnvVar('VITE_GRAPHQL_ENDPOINT', '/graphql');
}

function getBooleanEnvVar(key: string, defaultValue = false): boolean {
	const value = import.meta.env[key];
	if (value === undefined) return defaultValue;
	return value === 'true' || value === '1';
}

const appEnv = getEnvVar('VITE_APP_ENV', 'development') as AppConfig['appEnv'];

export const config: AppConfig = {
	graphqlEndpoint: getGraphQLEndpoint(),
	appEnv,
	appUrl: getEnvVar('VITE_APP_URL', 'http://localhost:5173'),
	isDevelopment: appEnv === 'development',
	isProduction: appEnv === 'production',
	isStaging: appEnv === 'staging',
	debugEnabled: getBooleanEnvVar('VITE_DEBUG', appEnv === 'development')
};

// Conditional logging helper
export const logger = {
	log: (...args: unknown[]) => {
		if (config.debugEnabled) {
			console.log(...args);
		}
	},
	error: (...args: unknown[]) => {
		console.error(...args);
	},
	warn: (...args: unknown[]) => {
		if (config.debugEnabled) {
			console.warn(...args);
		}
	},
	info: (...args: unknown[]) => {
		if (config.debugEnabled) {
			console.info(...args);
		}
	}
};

export default config;
