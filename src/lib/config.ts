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

function getBooleanEnvVar(key: string, defaultValue = false): boolean {
	const value = import.meta.env[key];
	if (value === undefined) return defaultValue;
	return value === 'true' || value === '1';
}

const appEnv = getEnvVar('VITE_APP_ENV', 'development') as AppConfig['appEnv'];

export const config: AppConfig = {
	graphqlEndpoint: getEnvVar('VITE_GRAPHQL_ENDPOINT'),
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
