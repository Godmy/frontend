/**
 * Search Store - управление состоянием поиска по онтологиям
 * Использует Svelte 5 Runes для reactivity
 */

type SearchResult = {
  id: string;
  type: 'concept' | 'dictionary' | 'language';
  title: string;
  description?: string;
  path?: string;
  url: string;
};

class SearchStore {
  private _query = $state<string>('');
  private _results = $state<SearchResult[]>([]);
  private _isLoading = $state<boolean>(false);
  private _isOpen = $state<boolean>(false);

  /**
   * Получить текущий поисковый запрос
   */
  get query(): string {
    return this._query;
  }

  /**
   * Получить результаты поиска
   */
  get results(): SearchResult[] {
    return this._results;
  }

  /**
   * Получить статус загрузки
   */
  get isLoading(): boolean {
    return this._isLoading;
  }

  /**
   * Получить статус видимости модального окна поиска
   */
  get isOpen(): boolean {
    return this._isOpen;
  }

  /**
   * Установить поисковый запрос и выполнить поиск
   */
  async setQuery(query: string): Promise<void> {
    this._query = query;

    if (query.trim() === '') {
      this._results = [];
      return;
    }

    this._isLoading = true;

    try {
      // Имитация поиска - в реальном приложении здесь будет вызов API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Возвращаем фиктивные результаты поиска
      // В реальном приложении здесь будет GraphQL запрос
      this._results = [
        {
          id: '1',
          type: 'concept',
          title: `Поиск: ${query}`,
          description: 'Описание результата поиска',
          path: '/concepts/1',
          url: '/concepts/1'
        },
        {
          id: '2',
          type: 'dictionary',
          title: `Словарь: ${query}`,
          description: 'Словарная запись',
          path: '/dictionaries/1',
          url: '/dictionaries/1'
        },
        {
          id: '3',
          type: 'language',
          title: `Язык: ${query}`,
          description: 'Языковая информация',
          path: '/languages/1',
          url: '/languages/1'
        }
      ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
    } catch (error) {
      console.error('Search error:', error);
      this._results = [];
    } finally {
      this._isLoading = false;
    }
  }

  /**
   * Открыть модальное окно поиска
   */
  open(): void {
    this._isOpen = true;
  }

  /**
   * Закрыть модальное окно поиска
   */
  close(): void {
    this._isOpen = false;
    this._query = '';
    this._results = [];
  }

  /**
   * Переключить видимость модального окна поиска
   */
  toggle(): void {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Выполнить поиск
   */
  async search(query: string): Promise<void> {
    await this.setQuery(query);
  }
}

// Singleton instance
export const searchStore = new SearchStore();