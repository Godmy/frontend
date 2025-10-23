<script lang="ts">
	import { page } from '$app/stores';
	import { ProtectedRoute, useAuth, usePermissions, RequirePermission, RequireRole } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { t } from '$lib/utils/i18n';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const auth = useAuth();
	const permissions = usePermissions();

	// Получить переводы из layout
	const trans = $derived($page.data.translations || {});

	async function handleLogout() {
		await auth.logout();
		goto('/login');
	}

	// Реактивная статистика на основе загруженных данных
	let stats = $derived([
		{
			name: t(trans, 'ui/dashboard/stats/concepts', 'Total Concepts'),
			value: data.GetDashboardStats?.concepts?.length?.toString() || '0',
			icon: '📚'
		},
		{
			name: t(trans, 'ui/dashboard/stats/languages', 'Supported Languages'),
			value: data.GetDashboardStats?.languages?.length?.toString() || '0',
			icon: '🌍'
		},
		{
			name: t(trans, 'ui/dictionaries/title', 'Dictionaries'),
			value: data.GetDashboardStats?.dictionaries?.length?.toString() || '0',
			icon: '📖'
		},
		{
			name: 'Your Role',
			value: auth.roles.length > 0 ? auth.roles[0].name : 'User',
			icon: '👤'
		}
	]);
</script>

<svelte:head>
	<title>{t(trans, 'ui/dashboard/title', 'Dashboard')} - Multipult</title>
</svelte:head>

<ProtectedRoute>
	<div class="min-h-screen bg-gray-50">
		<!-- Main Content -->
		<main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
			<!-- Welcome Section -->
			<div class="px-4 py-6 sm:px-0">
				<div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white mb-8">
					<h2 class="text-3xl font-bold mb-2">
						{t(trans, 'ui/dashboard/welcome', 'Welcome back')}, {auth.user?.profile?.firstName || auth.user?.username}! 👋
					</h2>
					<p class="text-indigo-100">
						Here's what's happening with your content today.
					</p>
				</div>

				<!-- Stats Grid -->
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
					{#each stats as stat}
						<div class="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-shadow">
							<div class="p-6">
								<div class="flex items-center">
									<div class="flex-shrink-0 text-3xl">
										{stat.icon}
									</div>
									<div class="ml-5 w-0 flex-1">
										<dl>
											<dt class="text-sm font-medium text-gray-500 truncate">
												{stat.name}
											</dt>
											<dd class="text-2xl font-bold text-gray-900">
												{stat.value}
											</dd>
										</dl>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Quick Actions -->
				<div class="bg-white shadow-lg rounded-xl p-6 mb-8">
					<h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<RequirePermission resource="concepts" action="create">
							<a
								href="/concepts/new"
								class="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
							>
								<div class="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
									📚
								</div>
								<div class="ml-4">
									<p class="text-sm font-medium text-gray-900">Create Concept</p>
									<p class="text-xs text-gray-500">Add a new concept</p>
								</div>
							</a>
						</RequirePermission>

						<RequirePermission resource="languages" action="create">
							<a
								href="/languages/new"
								class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
							>
								<div class="flex-shrink-0 w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl">
									🌍
								</div>
								<div class="ml-4">
									<p class="text-sm font-medium text-gray-900">Add Language</p>
									<p class="text-xs text-gray-500">Support new language</p>
								</div>
							</a>
						</RequirePermission>

						<RequirePermission resource="dictionaries" action="create">
							<a
								href="/dictionaries/new"
								class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
							>
								<div class="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
									📖
								</div>
								<div class="ml-4">
									<p class="text-sm font-medium text-gray-900">New Dictionary</p>
									<p class="text-xs text-gray-500">Create dictionary entry</p>
								</div>
							</a>
						</RequirePermission>
					</div>
				</div>

				<!-- Roles & Permissions -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<!-- Your Roles -->
					<div class="bg-white shadow-lg rounded-xl p-6">
						<h3 class="text-lg font-semibold text-gray-900 mb-4">Your Roles</h3>
						{#if auth.roles.length > 0}
							<div class="space-y-3">
								{#each auth.roles as role}
									<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<div>
											<p class="font-medium text-gray-900">{role.name}</p>
											{#if role.description}
												<p class="text-sm text-gray-500">{role.description}</p>
											{/if}
										</div>
										<span class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
											{role.permissions.length} permissions
										</span>
									</div>
								{/each}
							</div>
						{:else}
							<p class="text-gray-500 text-sm">No roles assigned yet.</p>
						{/if}
					</div>

					<!-- Account Info -->
					<div class="bg-white shadow-lg rounded-xl p-6">
						<h3 class="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
						<div class="space-y-3">
							<div class="flex justify-between py-2 border-b border-gray-100">
								<span class="text-sm text-gray-500">Username</span>
								<span class="text-sm font-medium text-gray-900">{auth.user?.username}</span>
							</div>
							<div class="flex justify-between py-2 border-b border-gray-100">
								<span class="text-sm text-gray-500">Email</span>
								<span class="text-sm font-medium text-gray-900">{auth.user?.email}</span>
							</div>
							<div class="flex justify-between py-2 border-b border-gray-100">
								<span class="text-sm text-gray-500">Status</span>
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {auth.user?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
									{auth.user?.isActive ? 'Active' : 'Inactive'}
								</span>
							</div>
							<div class="flex justify-between py-2 border-b border-gray-100">
								<span class="text-sm text-gray-500">Email Verified</span>
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {auth.user?.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
									{auth.user?.isVerified ? 'Verified' : 'Not verified'}
								</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Admin Panel (Only for Admins) -->
				<RequireRole role="admin">
					<div class="mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-xl p-8 text-white">
						<h3 class="text-2xl font-bold mb-2">🔑 Admin Panel</h3>
						<p class="mb-4 text-yellow-50">You have administrative access to manage the system.</p>
						<a
							href="/admin"
							class="inline-flex items-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-yellow-50 transition-colors"
						>
							Go to Admin Panel
							<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
							</svg>
						</a>
					</div>
				</RequireRole>
			</div>
		</main>
	</div>
</ProtectedRoute>
