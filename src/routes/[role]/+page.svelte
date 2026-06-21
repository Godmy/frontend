<script lang="ts">
	import { useAuth } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	const auth = useAuth();
	
	// Если пользователь не авторизован, перенаправляем на login
	onMount(() => {
		if (!auth.isAuthenticated) {
			goto('/login');
		}
	});
	
	// Получаем роль из параметров
	let { data }: { data: { role: string } } = $props();
	const { role } = data;
	
	// Убедимся, что пользователь принадлежит к этой роли
	onMount(() => {
		if (auth.user && auth.user.role !== role) {
			// Если доступ запрещен, перенаправляем на свою роль или logout
			const userRole = auth.user.role || 'user';
			goto(`/${userRole}`);
		}
	});
	
	// Здесь будем использовать специфичные компоненты из full_interface
	// в зависимости от роли пользователя
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header for authenticated users -->
	<header class="bg-white shadow">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center">
					<h1 class="text-xl font-bold text-indigo-600">vibe-management.pro</h1>
					<nav class="ml-10 flex space-x-8">
						<a href={`/${role}`} class="text-gray-900 border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium">Dashboard</a>
						<a href={`/${role}/settings`} class="text-gray-500 hover:text-gray-700 px-1 pt-1 text-sm font-medium">Settings</a>
					</nav>
				</div>
				
				<div class="flex items-center space-x-4">
					{#if auth.user}
						<span class="text-sm text-gray-700">Welcome, {auth.user.name}</span>
					{/if}
					<button 
						onclick={() => {
							auth.logout();
							goto('/');
						}}
						class="ml-4 px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="bg-white shadow rounded-lg p-6">
			{#if role === 'admin'}
				<!-- Admin dashboard with full functionality from full_interface -->
				<h2 class="text-2xl font-bold text-gray-900 mb-4">Administrator Dashboard</h2>
				<p class="text-gray-600 mb-4">
					You have administrative privileges. Manage users, settings, and system configurations.
				</p>
				
				<div class="space-y-6">
					<section class="border rounded-lg p-4">
						<h3 class="text-lg font-medium text-gray-900 mb-2">User Management</h3>
						<p class="text-gray-600 mb-4">Manage all users in the system</p>
						<button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
							View Users
						</button>
					</section>
					
					<section class="border rounded-lg p-4">
						<h3 class="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
						<p class="text-gray-600 mb-4">Configure system-wide settings</p>
						<button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
							Manage Settings
						</button>
					</section>
					
					<section class="border rounded-lg p-4">
						<h3 class="text-lg font-medium text-gray-900 mb-2">Analytics</h3>
						<p class="text-gray-600 mb-4">View system analytics and reports</p>
						<button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
							View Reports
						</button>
					</section>
				</div>
			{:else}
				<!-- User dashboard with standard functionality from full_interface -->
				<h2 class="text-2xl font-bold text-gray-900 mb-4">User Dashboard</h2>
				<p class="text-gray-600 mb-4">
					Welcome to your personal workspace. Manage your content and preferences.
				</p>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<section class="border rounded-lg p-4 hover:shadow-md transition-shadow">
						<h3 class="text-lg font-medium text-gray-900 mb-2">My Profile</h3>
						<p class="text-gray-600 mb-4">Manage your personal information</p>
						<button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
							Edit Profile
						</button>
					</section>
					
					<section class="border rounded-lg p-4 hover:shadow-md transition-shadow">
						<h3 class="text-lg font-medium text-gray-900 mb-2">Content Management</h3>
						<p class="text-gray-600 mb-4">Manage your content items</p>
						<button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
							View Content
						</button>
					</section>
					
					<section class="border rounded-lg p-4 hover:shadow-md transition-shadow md:col-span-2">
						<h3 class="text-lg font-medium text-gray-900 mb-2">Preferences</h3>
						<p class="text-gray-600 mb-4">Customize your experience</p>
						<button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
							Manage Preferences
						</button>
					</section>
				</div>
			{/if}
		</div>
	</main>
</div>
