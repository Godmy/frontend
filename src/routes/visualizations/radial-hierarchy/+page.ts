import { load_GetConceptHierarchy } from '$houdini';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	event.depends('app:concept-hierarchy');
	return {
		...(await load_GetConceptHierarchy({ event }))
	};
};