import { HoudiniClient } from '$houdini';
import { config } from '$lib/config';

// Определить правильный GraphQL endpoint
function getGraphQLEndpoint(): string {
	// На сервере (SSR) - используем internal Docker network или process.env
	if (typeof window === 'undefined') {
		// Server-side (SSR)
		return (
			process.env.API_BASE_URL ||
			(process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/graphql` : null) ||
			'http://backend:8000/graphql'
		);
	}

	// На клиенте - используем config
	return config.graphqlEndpoint;
}

export default new HoudiniClient({
	url: getGraphQLEndpoint(),

	// Configure the network call (for authentication, headers, etc.)
	// For more information: https://www.houdinigraphql.com/guides/authentication
	fetchParams() {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		};

		// For SSR requests, add Origin header to satisfy CORS
		if (typeof window === 'undefined') {
			headers['Origin'] = 'http://humansontology_frontend:3000';
		}

		return { headers };
	}
})
