import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		fs: {
			allow: ['.', '.houdini', 'src', 'node_modules', '.svelte-kit']
		},
		proxy: {
			'/graphql': {
				target: 'http://127.0.0.1:8000',
				changeOrigin: true,
			}
		}
	},
	test: {
		expect: { requireAssertions: true },
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			exclude: [
				'**/node_modules/**',
				'**/dist/**',
				'**/build/**',
				'**/.svelte-kit/**',
				'**/coverage/**',
				'**/*.config.*',
				'**/demo.spec.ts',
				'**/*.spec.ts',
				'**/*.test.ts',
				'**/types.ts',
				'**/constants.ts',
				'**/$houdini/**',
				'**/houdini.config.js',
				'**/playwright.config.ts',
				'**/svelte.config.js'
			],
			// Coverage thresholds (80%+ goal)
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 75,
				statements: 80
			},
			// Include all source files in coverage report
			all: true,
			include: ['src/**/*.{js,ts,svelte}']
		},
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					environment: 'browser',
					browser: {
						enabled: true,
						provider: 'playwright',
						instances: [{ browser: 'chromium' }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
