import { load_GetConcepts } from '$houdini';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	event.depends('app:concepts');
	return {
		...(await load_GetConcepts({ event }))
	};
};
