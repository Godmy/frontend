/**
 * Language Store - управление текущим выбранным языком
 * Использует Svelte 5 Runes для reactivity
 * Автоматически сохраняет выбор в localStorage
 */

const STORAGE_KEY = 'multipult_selected_language_id';

class LanguageStore {
	// По умолчанию русский язык (id=1)
	private _currentLanguageId = $state<number | null>(1);

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
	async setLanguage(languageId: number | null): Promise<void> {
		console.log(`[LanguageStore.setLanguage] Setting language to ${languageId}, current=${this._currentLanguageId}`);

		this._currentLanguageId = languageId;

		console.log(`[LanguageStore.setLanguage] After assignment, _currentLanguageId=${this._currentLanguageId}`);

		// Сохранить в localStorage
		if (typeof window !== 'undefined') {
			if (languageId !== null) {
				localStorage.setItem(STORAGE_KEY, languageId.toString());
			} else {
				localStorage.removeItem(STORAGE_KEY);
			}

			console.log(`[LanguageStore.setLanguage] About to invalidate, currentLanguageId getter returns=${this.currentLanguageId}`);

			// Перезагрузить все load functions для обновления UI
			// Это вызовет +layout.ts, который подхватит переводы из кэша
			try {
				const { invalidate } = await import('$app/navigation');
				// Используем специфичный ключ зависимости вместо invalidateAll
				await invalidate('app:language');
				console.log(`[LanguageStore.setLanguage] Invalidated app:language, new languageId=${languageId}`);
			} catch (error) {
				console.warn('[LanguageStore] Could not invalidate - not in browser context', error);
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
