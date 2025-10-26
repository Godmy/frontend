<script lang="ts">
	import { page } from '$app/stores';
	import { graphql } from '$houdini';
	import { languageStore } from '$lib/stores/languageStore.svelte';
	import { t } from '$lib/utils/i18n';
	import { onMount } from 'svelte';

	/**
	 * Language Switcher Component
	 * Dropdown для переключения между языками
	 * Автоматически обновляет все queries через languageStore
	 */

	// Получить переводы из layout
	const trans = $derived($page.data.translations || {});

	// Debug: отслеживать изменения переводов
	$effect(() => {
		const transKeys = Object.keys(trans);
		console.log('[LanguageSwitcher] Translations updated, keys count:', transKeys.length);
		console.log('[LanguageSwitcher] Sample translation:', trans['ui/label/language']);
	});

	// Загрузить все доступные языки
	const GetLanguagesForSwitcher = graphql(`
		query GetLanguagesForSwitcher {
			languages {
				id
				name
				code
			}
		}
	`);

	let languages = $state<Array<{ id: number; name: string; code: string }>>([]);
	let isLoading = $state(true);
	let isSwitching = $state(false);

	onMount(async () => {
		const result = await GetLanguagesForSwitcher.fetch();
		if (result.data?.languages) {
			languages = result.data.languages;
		}
		isLoading = false;
	});

	async function handleLanguageChange(event: Event) {
		const target = event.currentTarget as HTMLSelectElement;
		const value = target.value;

		isSwitching = true;
		try {
			if (value === '' || value === 'all') {
				await languageStore.setLanguage(null);
			} else {
				const languageId = parseInt(value, 10);
				if (!isNaN(languageId)) {
					await languageStore.setLanguage(languageId);
				}
			}
		} catch (error) {
			console.error('[LanguageSwitcher] Error switching language:', error);
		} finally {
			isSwitching = false;
		}
	}

	// Reactive value для select (Svelte 5 Runes)
	let selectedValue = $derived(languageStore.currentLanguageId?.toString() ?? '');
</script>

<div class="flex items-center space-x-2">
	<label for="language-select" class="text-sm font-medium text-gray-700">
		{t(trans, 'ui/label/language', 'Language:')}
	</label>
	<select
		id="language-select"
		value={selectedValue}
		onchange={handleLanguageChange}
		disabled={isLoading || isSwitching}
		class="block rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm disabled:opacity-50 transition-opacity"
	>
		<option value="">{t(trans, 'ui/common/allLanguages', 'All Languages')}</option>
		{#if !isLoading}
			{#each languages as language}
				<option value={language.id}>
					{language.name} ({language.code})
				</option>
			{/each}
		{/if}
	</select>
</div>
