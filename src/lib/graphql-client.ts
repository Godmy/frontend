import { config, logger } from './config';

const GRAPHQL_URL = config.graphqlEndpoint;

export async function graphqlRequest<T = any>(query: string, variables?: any): Promise<T> {
	logger.log('GraphQL Request:', { query, variables });

	try {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		};

		// For SSR requests, add Origin header to satisfy CORS
		if (typeof window === 'undefined') {
			headers['Origin'] = 'http://humansontology_frontend:3000';
		}

		const response = await fetch(GRAPHQL_URL, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				query,
				variables,
			}),
		});

		logger.log('GraphQL Response Status:', response.status);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const json = await response.json();
		logger.log('GraphQL Response Data:', json);

		if (json.errors) {
			logger.error('GraphQL Errors:', json.errors);
			throw new Error(json.errors[0].message);
		}

		return json.data;
	} catch (error) {
		logger.error('GraphQL Request Failed:', error);
		throw error;
	}
}
