<script lang="ts">
	import { ProtectedRoute, RequireRole } from '$lib/auth';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Reactive stats
	let stats = $derived([
		{
			name: 'Total Users',
			value: data.GetAdminStats?.users?.length?.toString() || '0',
			icon: '👥',
			color: 'bg-blue-500'
		},
		{
			name: 'Total Roles',
			value: data.GetAdminStats?.roles?.length?.toString() || '0',
			icon: '🔐',
			color: 'bg-purple-500'
		},
		{
			name: 'Active Users',
			value: data.GetAdminStats?.users?.filter(u => u.isActive)?.length?.toString() || '0',
			icon: '✅',
			color: 'bg-green-500'
		},
		{
			name: 'Inactive Users',
			value: data.GetAdminStats?.users?.filter(u => !u.isActive)?.length?.toString() || '0',
			icon: '⛔',
			color: 'bg-red-500'
		}
	]);
</script>

<svelte:head>
	<title>Admin Panel - Multipult</title>
</svelte:head>

<ProtectedRoute>
	<RequireRole role="admin">
		<div class="min-h-screen bg-gray-50">
			<div class="py-10">
				<!-- Header -->
				<header class="mb-8">
					<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div class="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 text-white">
							<div class="flex items-center space-x-4">
								<div class="text-5xl">🔑</div>
								<div>
									<h1 class="text-4xl font-bold">Admin Panel</h1>
									<p class="text-orange-100 mt-2">Manage users, roles, and permissions</p>
								</div>
							</div>
						</div>
					</div>
				</header>

				<!-- Stats Grid -->
				<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{#each stats as stat}
							<div class="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-shadow">
								<div class="p-6">
									<div class="flex items-center">
										<div class="flex-shrink-0 p-3 rounded-lg {stat.color} text-white text-3xl">
											{stat.icon}
										</div>
										<div class="ml-5 w-0 flex-1">
											<dl>
												<dt class="text-sm font-medium text-gray-500 truncate">
													{stat.name}
												</dt>
												<dd class="text-3xl font-bold text-gray-900">
													{stat.value}
												</dd>
											</dl>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Main Content -->
				<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<!-- Users List -->
						<div class="bg-white shadow-lg rounded-xl p-6">
							<div class="flex justify-between items-center mb-6">
								<h2 class="text-2xl font-bold text-gray-900">Users</h2>
								<button
									class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
								>
									<svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
									</svg>
									Add User
								</button>
							</div>

							<div class="space-y-3 max-h-96 overflow-y-auto">
								{#if data.GetAdminStats?.users && data.GetAdminStats.users.length > 0}
									{#each data.GetAdminStats.users as user}
										<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
											<div class="flex items-center space-x-3">
												<div class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
													{user.username?.charAt(0).toUpperCase()}
												</div>
												<div>
													<p class="font-medium text-gray-900">{user.username}</p>
													<p class="text-sm text-gray-500">{user.email}</p>
												</div>
											</div>
											<div class="flex items-center space-x-2">
												<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
													{user.isActive ? 'Active' : 'Inactive'}
												</span>
												<button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
													<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
													</svg>
												</button>
											</div>
										</div>
									{/each}
								{:else}
									<div class="text-center py-8 text-gray-500">
										<p>No users found</p>
									</div>
								{/if}
							</div>
						</div>

						<!-- Roles List -->
						<div class="bg-white shadow-lg rounded-xl p-6">
							<div class="flex justify-between items-center mb-6">
								<h2 class="text-2xl font-bold text-gray-900">Roles</h2>
								<button
									class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
								>
									<svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
									</svg>
									Add Role
								</button>
							</div>

							<div class="space-y-3 max-h-96 overflow-y-auto">
								{#if data.GetAdminStats?.roles && data.GetAdminStats.roles.length > 0}
									{#each data.GetAdminStats.roles as role}
										<div class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
											<div class="flex justify-between items-start mb-2">
												<div>
													<h3 class="font-medium text-gray-900">{role.name}</h3>
													{#if role.description}
														<p class="text-sm text-gray-500 mt-1">{role.description}</p>
													{/if}
												</div>
												<button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
													<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
													</svg>
												</button>
											</div>
											<div class="flex items-center justify-between">
												<span class="text-xs text-gray-500">
													{role.permissions?.length || 0} permissions
												</span>
												<div class="flex flex-wrap gap-1">
													{#if role.permissions && role.permissions.length > 0}
														{#each role.permissions.slice(0, 3) as permission}
															<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
																{permission.resource}:{permission.action}
															</span>
														{/each}
														{#if role.permissions.length > 3}
															<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
																+{role.permissions.length - 3}
															</span>
														{/if}
													{/if}
												</div>
											</div>
										</div>
									{/each}
								{:else}
									<div class="text-center py-8 text-gray-500">
										<p>No roles found</p>
									</div>
								{/if}
							</div>
						</div>
					</div>

					<!-- Recent Activity -->
					<div class="mt-8 bg-white shadow-lg rounded-xl p-6">
						<h2 class="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
						<div class="text-center py-8 text-gray-500">
							<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<p class="mt-2">Activity tracking coming soon</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</RequireRole>
</ProtectedRoute>
