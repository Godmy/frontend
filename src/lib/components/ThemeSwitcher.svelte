<script lang="ts">
  import { theme } from '../stores/themeStore';
  import { t } from '$lib/utils/i18n';
  import { page } from '$app/stores';

  const trans = $derived($page.data.translations || {});

  function setTheme(newTheme: 'light' | 'dark' | 'auto') {
    theme.set(newTheme);
  }
</script>

<div class="flex items-center space-x-2">
  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{t(trans, 'ui/theme/theme', 'Theme')}:</span>
  <button
    onclick={() => setTheme('light')}
    class="px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200
           {$theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}"
  >
    {t(trans, 'ui/theme/light', 'Light')}
  </button>
  <button
    onclick={() => setTheme('dark')}
    class="px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200
           {$theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}"
  >
    {t(trans, 'ui/theme/dark', 'Dark')}
  </button>
  <button
    onclick={() => setTheme('auto')}
    class="px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200
           {$theme === 'auto' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}"
  >
    {t(trans, 'ui/theme/auto', 'Auto')}
  </button>
</div>
