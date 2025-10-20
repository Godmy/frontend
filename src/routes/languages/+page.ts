import { load_GetLanguages } from '$houdini';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	return {
		...(await load_GetLanguages({ event }))
	};
};
