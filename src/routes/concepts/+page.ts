import { load_GetConcepts } from '$houdini';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	return {
		...load_GetConcepts({ event })
	};
};
