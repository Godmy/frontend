import type { Handle } from '@sveltejs/kit';

/**
 * Server-side hooks
 * Настраивает GraphQL endpoint для SSR запросов
 */
export const handle: Handle = async ({ event, resolve }) => {
	// Установить правильный GraphQL endpoint для server-side запросов
	// В Docker контейнере используем internal network endpoint, иначе локальный
	const isDocker = process.env.BACKEND_URL || process.env.API_BASE_URL;
	const isDev = process.env.NODE_ENV !== 'production';
	
	if (isDocker) {
		// Сохраняем server-side GraphQL endpoint в event.locals для использования в load функциях
		event.locals.graphqlEndpoint =
			process.env.API_BASE_URL ||
			`${process.env.BACKEND_URL}/graphql/` ||
			'http://backend:8000/graphql/';
	} else {
		// Для локальной разработки используем локальный адрес
		event.locals.graphqlEndpoint = process.env.VITE_GRAPHQL_ENDPOINT || 'http://127.0.0.1:8000/graphql/';
	}

	const response = await resolve(event);
	return response;
};
