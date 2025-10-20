<script lang="ts">
	import { useAuth } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const auth = useAuth();

	onMount(() => {
		// Если пользователь уже авторизован, перенаправляем на dashboard
		if (auth.isAuthenticated) {
			goto('/dashboard');
		}
	});
</script>

<svelte:head>
	<title>Multipult - Multilingual Content Management</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
	<!-- Navigation -->
	<nav class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex items-center">
					<h1 class="text-2xl font-bold text-indigo-600">Multipult</h1>
				</div>

				<div class="flex items-center space-x-4">
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
				</div>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
		<div class="text-center">
			<h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
				Multilingual Content
				<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
					Management
				</span>
			</h1>

			<p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
				Organize concepts, manage dictionaries, and handle multilingual content with ease.
				Built with GraphQL and modern web technologies.
			</p>

			<div class="flex justify-center space-x-4">
				<a
					href="/register"
					class="inline-flex items-center px-8 py-4 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
				>
					Start Free Trial
					<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
					</svg>
				</a>

				<a
					href="/login"
					class="inline-flex items-center px-8 py-4 text-base font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-300 transition-all"
				>
					Sign In
				</a>
			</div>
		</div>

		<!-- Features Grid -->
		<div class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
			<div class="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
				<div class="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-3xl mb-4">
					📚
				</div>
				<h3 class="text-xl font-bold text-gray-900 mb-2">Concept Management</h3>
				<p class="text-gray-600">
					Organize and structure your content concepts with hierarchical relationships.
				</p>
			</div>

			<div class="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
				<div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-3xl mb-4">
					🌍
				</div>
				<h3 class="text-xl font-bold text-gray-900 mb-2">Multi-Language Support</h3>
				<p class="text-gray-600">
					Support unlimited languages and easily manage translations.
				</p>
			</div>

			<div class="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
				<div class="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center text-3xl mb-4">
					🔐
				</div>
				<h3 class="text-xl font-bold text-gray-900 mb-2">Role-Based Access</h3>
				<p class="text-gray-600">
					Control access with fine-grained permissions and role-based authorization.
				</p>
			</div>
		</div>

		<!-- CTA Section -->
		<div class="mt-24 text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-white">
			<h2 class="text-3xl font-bold mb-4">
				Ready to get started?
			</h2>
			<p class="text-indigo-100 mb-8 text-lg">
				Join users managing their multilingual content efficiently
			</p>
			<a
				href="/register"
				class="inline-flex items-center px-8 py-4 text-base font-medium text-indigo-600 bg-white rounded-lg hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
			>
				Create Free Account
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
				<p>&copy; 2025 Multipult. All rights reserved.</p>
			</div>
		</div>
	</footer>
</div>
