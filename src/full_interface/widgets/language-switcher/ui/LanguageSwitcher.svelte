<script lang="ts">
	import { page } from '$app/stores';
	import { languageStore } from '$lib/stores/languageStore.svelte';
	import { t } from '$lib/utils/i18n';

	/**
	 * Language Switcher Component
	 * Dropdown for switching between UI languages.
	 * Uses the local language store and keeps the available list static
	 * until the full legacy Houdini pipeline is restored.
	 */

	const trans = $derived($page.data.translations || {});

	$effect(() => {
		const transKeys = Object.keys(trans);
		console.log('[LanguageSwitcher] Translations updated, keys count:', transKeys.length);
		console.log('[LanguageSwitcher] Sample translation:', trans['ui/label/language']);
	});

	let languages = $state<Array<{ id: number; name: string; code: string }>>([
		{ id: 1, name: 'Russian', code: 'ru' },
		{ id: 2, name: 'English', code: 'en' }
	]);
	let isLoading = $state(false);
	let isSwitching = $state(false);

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
				<option value={language.id.toString()}>
					{language.name} ({language.code})
				</option>
			{/each}
		{/if}
	</select>
</div>
