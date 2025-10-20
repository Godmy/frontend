import { HoudiniClient } from '$houdini';
import { config } from '$lib/config';

export default new HoudiniClient({
	url: config.graphqlEndpoint,

	// Configure the network call (for authentication, headers, etc.)
	// For more information: https://www.houdinigraphql.com/guides/authentication
	fetchParams() {
		return {
			headers: {
				'Content-Type': 'application/json'
				// Add authentication header if needed:
				// 'Authorization': `Bearer ${token}`
			}
		};
	}
})
