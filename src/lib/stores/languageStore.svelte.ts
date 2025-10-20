/**
 * Language Store - управление текущим выбранным языком
 * Использует Svelte 5 Runes для reactivity
 * Автоматически сохраняет выбор в localStorage
 */

const STORAGE_KEY = 'multipult_selected_language_id';

class LanguageStore {
	private _currentLanguageId = $state<number | null>(null);

	/**
	 * Получить ID текущего выбранного языка
	 * null означает "все языки"
	 */
	get currentLanguageId(): number | null {
		return this._currentLanguageId;
	}

	/**
	 * Установить текущий язык
	 * @param languageId - ID языка или null для "все языки"
	 */
	setLanguage(languageId: number | null): void {
		this._currentLanguageId = languageId;

		// Сохранить в localStorage
		if (typeof window !== 'undefined') {
			if (languageId !== null) {
				localStorage.setItem(STORAGE_KEY, languageId.toString());
			} else {
				localStorage.removeItem(STORAGE_KEY);
			}
		}
	}

	/**
	 * Инициализировать store из localStorage
	 * Вызывается при загрузке приложения
	 */
	init(): void {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = parseInt(saved, 10);
				if (!isNaN(parsed)) {
					this._currentLanguageId = parsed;
				}
			}
		}
	}

	/**
	 * Сбросить выбор языка (показать все)
	 */
	reset(): void {
		this.setLanguage(null);
	}
}

// Singleton instance
export const languageStore = new LanguageStore();
