import { HoudiniClient } from '$houdini';
import { config } from '$lib/config';
import { STORAGE_KEYS } from '$lib/auth/constants';

// Resolve GraphQL endpoint in a way that works for both browser and SSR execution paths
function getGraphQLEndpoint(): string {
	if (typeof window === 'undefined') {
		const ssrEndpoint =
			process.env.API_BASE_URL ||
			(process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/graphql` : undefined);

		if (ssrEndpoint) {
			return ssrEndpoint;
		}
	}

	const endpoint = config.graphqlEndpoint;

	if (!endpoint) {
		throw new Error(
			'GraphQL endpoint is not configured. Provide VITE_GRAPHQL_ENDPOINT or BACKEND_URL.'
		);
	}

	return endpoint;
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
		} else {
			// On client-side, add auth token if available
			const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
			if (token) {
				headers['Authorization'] = `Bearer ${token}`;
			}
		}

		return { headers };
	}
});
