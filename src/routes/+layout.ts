import { languageStore } from '$lib/stores/languageStore.svelte';
import { dictionariesToMap } from '$lib/utils/i18n';
import type { LayoutLoad } from './$types';
import { GetUITranslationsStore } from '$houdini';

/**
 * Layout Load Function
 * Загружает все UI-переводы для текущего выбранного языка
 * Переводы будут доступны во всех дочерних страницах через $page.data.translations
 */
export const load: LayoutLoad = async (event) => {
	// Получить текущий выбранный язык (или fallback на English = 2)
	const languageId = languageStore.currentLanguageId || 2;

	// Создать Houdini store
	const store = new GetUITranslationsStore();

	// Загрузить UI-переводы
	const result = await store.fetch({
		event,
		variables: {
			languageId
		}
	});

	// Преобразовать массив Dictionary в Map объект
	const translationsArray = result.data?.dictionaries || [];
	const translations = dictionariesToMap(translationsArray);

	return {
		translations,
		languageId
	};
};
