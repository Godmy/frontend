import { load_GetDictionariesData } from '$houdini';
import type { PageLoad } from './$types';
import { languageStore } from '$lib/stores/languageStore.svelte';

export const load: PageLoad = async (event) => {
	// React to language changes
	event.depends('app:language');
	event.depends('app:dictionaries');

	// Get current language (default to Russian = 1)
	const languageId = languageStore.currentLanguageId || 1;

	return {
		...(await load_GetDictionariesData({
			event,
			variables: {
				languageId
			}
		}))
	};
};
