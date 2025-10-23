<script lang="ts">
	import { page } from '$app/stores';
	import { useAuth } from '$lib/auth';
	import { goto } from '$app/navigation';
	import LanguageSwitcher from './LanguageSwitcher.svelte';

	const auth = useAuth();
	let currentPath = $derived($page.url.pathname);

	// Определяем тип страницы на основе пути
	let isPublicPage = $derived(currentPath === '/' || currentPath === '/login' || currentPath === '/register' || currentPath === '/forgot-password');
	let isDashboard = $derived(currentPath === '/dashboard');

	async function handleLogout() {
		await auth.logout();
		goto('/login');
	}

	// Helper для активной ссылки
	function isActive(path: string): boolean {
		return currentPath === path;
	}
</script>

<nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<!-- Левая часть: Логотип + Навигация -->
			<div class="flex items-center space-x-8">
				<!-- Логотип -->
				<a href={auth.isAuthenticated ? '/dashboard' : '/'} class="text-2xl font-bold text-indigo-600">
					Multipult
				</a>

				<!-- Навигация для авторизованных пользователей -->
				{#if auth.isAuthenticated}
					<div class="hidden md:flex space-x-1">
						<a
							href="/dashboard"
							class="{isActive('/dashboard') ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'} px-3 py-2 text-sm font-medium border-b-2 transition-colors"
						>
							Dashboard
						</a>
						<a
							href="/concepts"
							class="{isActive('/concepts') ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'} px-3 py-2 text-sm font-medium border-b-2 transition-colors"
						>
							Concepts
						</a>
						<a
							href="/languages"
							class="{isActive('/languages') ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'} px-3 py-2 text-sm font-medium border-b-2 transition-colors"
						>
							Languages
						</a>
						<a
							href="/dictionaries"
							class="{isActive('/dictionaries') ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'} px-3 py-2 text-sm font-medium border-b-2 transition-colors"
						>
							Dictionaries
						</a>
					</div>
				{/if}
			</div>

			<!-- Правая часть: LanguageSwitcher + User info / Auth buttons -->
			<div class="flex items-center space-x-4">
				<!-- Language Switcher - всегда видим -->
				<LanguageSwitcher />

				{#if auth.isAuthenticated}
					<!-- User Info для авторизованных -->
					<div class="flex items-center space-x-3">
						<div class="text-right hidden sm:block">
							<p class="text-sm font-medium text-gray-900">{auth.user?.username}</p>
							<p class="text-xs text-gray-500">{auth.user?.email}</p>
						</div>

						<div class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
							{auth.user?.username?.charAt(0).toUpperCase()}
						</div>
					</div>

					<button
						onclick={handleLogout}
						class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
					>
						Logout
					</button>
				{:else}
					<!-- Auth buttons для неавторизованных -->
					<a
						href="/login"
						class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
					>
						Sign in
					</a>
					<a
						href="/register"
						class="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all"
					>
						Get Started
					</a>
				{/if}
			</div>
		</div>
	</div>
</nav>
