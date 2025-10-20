import { load_GetDictionariesData } from '$houdini';
import type { PageLoad } from './$types';
import { languageStore } from '$lib/stores/languageStore.svelte';

export const load: PageLoad = async (event) => {
	return {
		...(await load_GetDictionariesData({
			event,
			variables: {
				languageId: languageStore.currentLanguageId
			}
		}))
	};
};
