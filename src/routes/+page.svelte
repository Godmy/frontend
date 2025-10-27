<script lang="ts">
	import { page } from '$app/stores';
	import { useAuth } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { t } from '$lib/utils/i18n';
	import { onMount } from 'svelte';

	const auth = useAuth();

	// Получить переводы из layout
	const trans = $derived($page.data.translations || {});

	onMount(() => {
		// Если пользователь уже авторизован, перенаправляем на dashboard
		if (auth.isAuthenticated) {
			goto('/dashboard');
		}
	});
</script>

<svelte:head>
	<title>{t(trans, 'ui/home/title', 'Multilingual Content')} - {t(trans, 'ui/home/subtitle', 'Management')}</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

	<!-- Hero Section -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
		<div class="text-center">
			<h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
				{t(trans, 'ui/home/title', 'Multilingual Content')}
				<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
					{t(trans, 'ui/home/subtitle', 'Management')}
				</span>
			</h1>

			<p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
				{t(trans, 'ui/home/description', 'Organize concepts, manage dictionaries, and handle multilingual content with ease. Built with GraphQL and modern web technologies.')}
			</p>

			<div class="flex justify-center space-x-4">
				<a
					href="/register"
					class="inline-flex items-center px-8 py-4 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
				>
					{t(trans, 'ui/home/cta/startTrial', 'Start Free Trial')}
					<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
					</svg>
				</a>

				<a
					href="/login"
					class="inline-flex items-center px-8 py-4 text-base font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-300 transition-all"
				>
					{t(trans, 'ui/button/signIn', 'Sign In')}
				</a>
			</div>
		</div>

		<!-- Human Ontology Featured Section -->
		<div class="mt-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Left: Content -->
				<div class="p-12 text-white">
					<div class="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
						</svg>
						Новинка
					</div>

					<h2 class="text-4xl font-extrabold mb-4">
						Онтология аттракторов человека
					</h2>

					<p class="text-indigo-100 text-lg mb-8 leading-relaxed">
						Исследуйте уникальную иерархическую структуру из <strong>11,000-15,000 концептов</strong> физиологических аттракторов человеческого организма. 7 основных категорий, 10+ уровней глубины.
					</p>

					<div class="grid grid-cols-2 gap-4 mb-8">
						<div class="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
							<div class="text-3xl font-bold mb-1">11k-15k</div>
							<div class="text-indigo-100 text-sm">Концептов</div>
						</div>
						<div class="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
							<div class="text-3xl font-bold mb-1">7</div>
							<div class="text-indigo-100 text-sm">Категорий</div>
						</div>
						<div class="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
							<div class="text-3xl font-bold mb-1">10+</div>
							<div class="text-indigo-100 text-sm">Уровней</div>
						</div>
						<div class="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
							<div class="text-3xl font-bold mb-1">100%</div>
							<div class="text-indigo-100 text-sm">Бесплатно</div>
						</div>
					</div>

					<a
						href="/visualization/ontology"
						class="inline-flex items-center px-8 py-4 text-base font-medium text-indigo-600 bg-white rounded-lg hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
					>
						Открыть онтологию
						<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
						</svg>
					</a>
				</div>

				<!-- Right: Visual -->
				<div class="relative p-12 hidden lg:flex items-center justify-center">
					<div class="relative">
						<!-- Decorative tree visualization -->
						<div class="absolute inset-0 bg-white/10 rounded-full blur-3xl"></div>
						<svg class="w-64 h-64 relative z-10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
							<!-- Central node -->
							<circle cx="100" cy="100" r="20" fill="white" opacity="0.9"/>
							<text x="100" y="105" text-anchor="middle" fill="#4F46E5" font-size="12" font-weight="bold">Root</text>

							<!-- Level 1 nodes -->
							<circle cx="50" cy="60" r="12" fill="white" opacity="0.8"/>
							<line x1="100" y1="100" x2="50" y2="60" stroke="white" stroke-width="2" opacity="0.6"/>

							<circle cx="150" cy="60" r="12" fill="white" opacity="0.8"/>
							<line x1="100" y1="100" x2="150" y2="60" stroke="white" stroke-width="2" opacity="0.6"/>

							<circle cx="50" cy="140" r="12" fill="white" opacity="0.8"/>
							<line x1="100" y1="100" x2="50" y2="140" stroke="white" stroke-width="2" opacity="0.6"/>

							<circle cx="150" cy="140" r="12" fill="white" opacity="0.8"/>
							<line x1="100" y1="100" x2="150" y2="140" stroke="white" stroke-width="2" opacity="0.6"/>

							<!-- Level 2 nodes -->
							<circle cx="30" cy="30" r="8" fill="white" opacity="0.6"/>
							<line x1="50" y1="60" x2="30" y2="30" stroke="white" stroke-width="1" opacity="0.4"/>

							<circle cx="70" cy="30" r="8" fill="white" opacity="0.6"/>
							<line x1="50" y1="60" x2="70" y2="30" stroke="white" stroke-width="1" opacity="0.4"/>

							<circle cx="130" cy="30" r="8" fill="white" opacity="0.6"/>
							<line x1="150" y1="60" x2="130" y2="30" stroke="white" stroke-width="1" opacity="0.4"/>

							<circle cx="170" cy="30" r="8" fill="white" opacity="0.6"/>
							<line x1="150" y1="60" x2="170" y2="30" stroke="white" stroke-width="1" opacity="0.4"/>

							<circle cx="30" cy="170" r="8" fill="white" opacity="0.6"/>
							<line x1="50" y1="140" x2="30" y2="170" stroke="white" stroke-width="1" opacity="0.4"/>

							<circle cx="70" cy="170" r="8" fill="white" opacity="0.6"/>
							<line x1="50" y1="140" x2="70" y2="170" stroke="white" stroke-width="1" opacity="0.4"/>

							<circle cx="130" cy="170" r="8" fill="white" opacity="0.6"/>
							<line x1="150" y1="140" x2="130" y2="170" stroke="white" stroke-width="1" opacity="0.4"/>

							<circle cx="170" cy="170" r="8" fill="white" opacity="0.6"/>
							<line x1="150" y1="140" x2="170" y2="170" stroke="white" stroke-width="1" opacity="0.4"/>
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- Features Grid -->
		<div class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
			<div class="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
				<div class="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-3xl mb-4">
					📚
				</div>
				<h3 class="text-xl font-bold text-gray-900 mb-2">
					{t(trans, 'ui/home/feature/concepts/title', 'Concept Management')}
				</h3>
				<p class="text-gray-600">
					{t(trans, 'ui/home/feature/concepts/description', 'Organize and structure your content concepts with hierarchical relationships.')}
				</p>
			</div>

			<div class="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
				<div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-3xl mb-4">
					🌍
				</div>
				<h3 class="text-xl font-bold text-gray-900 mb-2">
					{t(trans, 'ui/home/feature/multilang/title', 'Multi-Language Support')}
				</h3>
				<p class="text-gray-600">
					{t(trans, 'ui/home/feature/multilang/description', 'Support unlimited languages and easily manage translations.')}
				</p>
			</div>

			<div class="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
				<div class="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center text-3xl mb-4">
					🔐
				</div>
				<h3 class="text-xl font-bold text-gray-900 mb-2">
					{t(trans, 'ui/home/feature/roles/title', 'Role-Based Access')}
				</h3>
				<p class="text-gray-600">
					{t(trans, 'ui/home/feature/roles/description', 'Control access with fine-grained permissions and role-based authorization.')}
				</p>
			</div>
		</div>

		<!-- CTA Section -->
		<div class="mt-24 text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-white">
			<h2 class="text-3xl font-bold mb-4">
				{t(trans, 'ui/home/cta/title', 'Ready to get started?')}
			</h2>
			<p class="text-indigo-100 mb-8 text-lg">
				{t(trans, 'ui/home/cta/description', 'Join users managing their multilingual content efficiently')}
			</p>
			<a
				href="/register"
				class="inline-flex items-center px-8 py-4 text-base font-medium text-indigo-600 bg-white rounded-lg hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
			>
				{t(trans, 'ui/home/cta/button', 'Create Free Account')}
				<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
				</svg>
			</a>
		</div>
	</div>

	<!-- Footer -->
	<footer class="border-t border-gray-200 mt-20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div class="text-center text-gray-600">
				<p>{t(trans, 'ui/home/footer/copyright', '© 2025 Multipult. All rights reserved.')}</p>
			</div>
		</div>
	</footer>
</div>
