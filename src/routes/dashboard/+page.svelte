<script lang="ts">
	import { page } from '$app/stores';
	import { useAuth } from '$lib/auth';
	import { ProtectedRoute, RequirePermission, RequireRole } from '$features/auth';
	import { t } from '$lib/utils/i18n';
	import type { PageData } from './$types';
	import {
		ArrowRight,
		BookOpen,
		Globe2,
		Key,
		Languages as LanguagesIcon,
		Library,
		NotebookPen,
		Plus,
		Shield
	} from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	const auth = useAuth();

	const trans = $derived($page.data.translations || {});
	const dashboardStatsStore = data.GetDashboardStats;
	const welcomeMessage = $derived(() => {
		const raw = t(trans, 'ui/dashboard/welcome', 'Welcome back').trim();
		const base = raw.replace(/[\s!.,]+$/u, '');
		const userName = auth.user?.profile?.firstName || auth.user?.username;
		return userName ? `${base}, ${userName}!` : `${base}!`;
	});

	$effect(() => {
		console.log('[Dashboard] Houdini snapshot:', $dashboardStatsStore);
	});

	const stats = $derived(() => [
		{
			name: t(trans, 'ui/dashboard/stats/concepts', 'Total Concepts'),
			value: String($dashboardStatsStore?.data?.counts?.concepts ?? 0),
			icon: BookOpen,
			iconBg: 'bg-indigo-100',
			iconColor: 'text-indigo-600'
		},
		{
			name: t(trans, 'ui/dashboard/stats/languages', 'Supported Languages'),
			value: String($dashboardStatsStore?.data?.counts?.languages ?? 0),
			icon: LanguagesIcon,
			iconBg: 'bg-emerald-100',
			iconColor: 'text-emerald-600'
		},
		{
			name: t(trans, 'ui/dictionaries/title', 'Dictionaries'),
			value: String($dashboardStatsStore?.data?.counts?.dictionaries ?? 0),
			icon: Library,
			iconBg: 'bg-purple-100',
			iconColor: 'text-purple-600'
		},
		{
			name: 'Your Role',
			value: auth.roles.length > 0 ? auth.roles[0].name : 'User',
			icon: Shield,
			iconBg: 'bg-orange-100',
			iconColor: 'text-orange-600'
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
					<h2 class="text-3xl font-bold mb-2">{welcomeMessage}</h2>
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
									<div class="flex-shrink-0 p-3 rounded-lg {stat.iconBg}">
										<svelte:component this={stat.icon} class={`h-6 w-6 ${stat.iconColor}`} />
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
								<div class="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
									<Plus class="h-5 w-5" />
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
								<div class="flex-shrink-0 w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
									<Globe2 class="h-5 w-5" />
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
								<div class="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
									<NotebookPen class="h-5 w-5" />
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
						<div class="flex items-center space-x-4 mb-4">
							<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
								<Key class="h-7 w-7 text-white" />
							</div>
							<h3 class="text-2xl font-bold">Admin Panel</h3>
						</div>
						<p class="mb-6 text-yellow-50">You have administrative access to manage the system.</p>
						<a
							href="/admin"
							class="inline-flex items-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-yellow-50 transition-colors"
						>
							<span>Go to Admin Panel</span>
							<ArrowRight class="ml-2 w-5 h-5" />
						</a>
					</div>
				</RequireRole>
			</div>
		</main>
	</div>
</ProtectedRoute>










