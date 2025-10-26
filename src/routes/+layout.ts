import { languageStore } from '$lib/stores/languageStore.svelte';
import { dictionariesToMap } from '$lib/utils/i18n';
import type { LayoutLoad } from './$types';
import { GetUITranslationsStore } from '$houdini';
import { browser } from '$app/environment';

/**
 * In-memory cache для переводов
 * Key: languageId, Value: translations object
 */
const translationsCache = new Map<number, Record<string, string>>();

/**
 * Layout Load Function
 * Загружает все UI-переводы для текущего выбранного языка
 * Переводы будут доступны во всех дочерних страницах через $page.data.translations
 *
 * Использует in-memory кэш для быстрого переключения языков
 */
export const load: LayoutLoad = async (event) => {
	// Указать зависимость от language_id - это заставит SvelteKit перезапускать load при invalidate
	event.depends('app:language');

	// Получить текущий выбранный язык (или fallback на Русский = 1)
	const languageId = languageStore.currentLanguageId || 1;

	console.log(`[+layout.ts load] Called with languageId=${languageId}, browser=${browser}`);

	// Проверить кэш
	const cached = translationsCache.get(languageId);
	if (cached) {
		console.log(`[i18n] Using cached translations for language ${languageId}, keys:`, Object.keys(cached).length);
		return {
			translations: cached,
			languageId
		};
	}

	// Кэша нет - загрузить с сервера
	console.log(`[i18n] Loading translations for language ${languageId} from server...`);
	const store = new GetUITranslationsStore();

	const result = await store.fetch({
		event,
		variables: {
			languageId
		}
	});

	// Преобразовать массив Dictionary в Map объект
	const translationsArray = result.data?.dictionaries || [];
	const translations = dictionariesToMap(translationsArray);

	// Сохранить в кэш
	translationsCache.set(languageId, translations);
	console.log(`[i18n] Cached ${Object.keys(translations).length} translations for language ${languageId}`);

	return {
		translations,
		languageId
	};
};
