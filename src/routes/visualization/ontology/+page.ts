import { getRootDomainConcepts, type DomainConcept } from '$lib/api/domain-concepts';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ parent }) => {
  // Получаем данные из родительского layout
  const { translations } = await parent();

  try {
    // Загружаем корневые концепты онтологии человека (7 основных категорий)
    const rootConcepts = await getRootDomainConcepts('ru');

    return {
      translations,
      rootConcepts,
      error: null
    };
  } catch (error) {
    console.error('Failed to load domain concepts:', error);

    return {
      translations,
      rootConcepts: [],
      error: 'Не удалось загрузить онтологию. Проверьте подключение к API.'
    };
  }
};
