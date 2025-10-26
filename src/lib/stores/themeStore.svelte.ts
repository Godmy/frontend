/**
 * Theme Store - управление светлой/тёмной темой
 * Использует Svelte 5 Runes для reactivity
 * Автоматически сохраняет выбор в localStorage и учитывает системные настройки
 */

const STORAGE_KEY = 'multipult_theme';

class ThemeStore {
	private _currentTheme = $state<'light' | 'dark' | 'auto'>('auto');

	/**
	 * Получить текущую тему
	 */
	get currentTheme(): 'light' | 'dark' | 'auto' {
		return this._currentTheme;
	}

	/**
	 * Получить активную тему (light или dark, без 'auto')
	 */
	get activeTheme(): 'light' | 'dark' {
		if (this._currentTheme === 'auto') {
			// Определяем по системной предпочтительной теме
			if (typeof window !== 'undefined') {
				return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			}
			return 'light'; // по умолчанию
		}
		return this._currentTheme;
	}

	/**
	 * Установить текущую тему
	 */
	setTheme(theme: 'light' | 'dark' | 'auto'): void {
		this._currentTheme = theme;

		// Сохранить в localStorage
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, theme);
			
			// Применить тему к документу
			this.applyTheme();
		}
	}

	/**
	 * Применить тему к DOM
	 */
	private applyTheme(): void {
		if (typeof window !== 'undefined') {
			const html = document.documentElement;
			const themeToApply = this.activeTheme;

			// Удаляем старые классы тем
			html.classList.remove('light', 'dark');
			
			// Добавляем текущую тему
			html.classList.add(themeToApply);
			
			// Устанавливаем data-атрибут для tailwind
			html.setAttribute('data-theme', themeToApply);
		}
	}

	/**
	 * Инициализировать store из localStorage
	 */
	init(): void {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem(STORAGE_KEY);
			
			if (saved && ['light', 'dark', 'auto'].includes(saved)) {
				this._currentTheme = saved as 'light' | 'dark' | 'auto';
			} else {
				// Если ничего не сохранено, используем auto по умолчанию
				this._currentTheme = 'auto';
			}
			
			// Применяем тему
			this.applyTheme();
			
			// Настраиваем слушатель на изменение системной темы
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			mediaQuery.addEventListener('change', () => {
				if (this._currentTheme === 'auto') {
					this.applyTheme();
				}
			});
		}
	}

	/**
	 * Переключить тему (light <-> dark, auto остается как auto)
	 */
	toggleTheme(): void {
		if (this._currentTheme === 'light') {
			this.setTheme('dark');
		} else if (this._currentTheme === 'dark') {
			this.setTheme('light');
		} else {
			// Если auto, переключаемся на противоположную системную
			if (typeof window !== 'undefined') {
				const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				this.setTheme(systemDark ? 'light' : 'dark');
			}
		}
	}
}

// Singleton instance
export const themeStore = new ThemeStore();