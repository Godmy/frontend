import { load_GetLanguages } from '$houdini';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	console.log('[Languages Loader] Loading languages...');
	event.depends('app:languages');
	const result = await load_GetLanguages({ event });
	console.log('[Languages Loader] Result:', result);
	return {
		...result
	};
};
