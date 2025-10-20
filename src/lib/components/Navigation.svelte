<script lang="ts">
	import { page } from '$app/stores';
	import LanguageSwitcher from './LanguageSwitcher.svelte';

	let currentPath = $derived($page.url.pathname);
</script>

<nav class="bg-white shadow-sm">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<div class="flex">
				<div class="flex-shrink-0 flex items-center">
					<a href="/" class="text-xl font-bold text-gray-900">Multipult Admin</a>
				</div>
				<div class="hidden sm:ml-6 sm:flex sm:space-x-8">
					<a
						href="/languages"
						class="{currentPath === '/languages' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
					>
						Languages
					</a>
					<a
						href="/concepts"
						class="{currentPath === '/concepts' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
					>
						Concepts
					</a>
					<a
						href="/dictionaries"
						class="{currentPath === '/dictionaries' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
					>
						Dictionaries
					</a>
				</div>
			</div>

			<!-- Language Switcher -->
			<div class="flex items-center">
				<LanguageSwitcher />
			</div>
		</div>
	</div>
</nav>
