<script lang="ts">
	import { useAuth } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	const auth = useAuth();
	
	let { data }: { data: { role: string } } = $props();
	const { role } = data;
	
	// Если пользователь не авторизован, перенаправляем на login
	onMount(() => {
		if (!auth.isAuthenticated) {
			goto('/login');
		}
		// Проверяем, имеет ли пользователь право доступа к этой странице
		if (auth.user && auth.user.role !== role) {
			const userRole = auth.user.role || 'user';
			goto(`/${userRole}`);
		}
	});
	
	// Простая форма профиля
	let profileData = $state({
		email: auth.user?.email || '',
		name: auth.user?.name || '',
		phone: auth.user?.phone || ''
	});
	
	let saving = $state(false);
	
	async function saveProfile(event: SubmitEvent) {
		event.preventDefault();
		saving = true;
		// TODO: Реализовать сохранение профиля
		console.log('Saving profile:', profileData);
		// await auth.updateProfile(profileData);
		saving = false;
		alert('Profile updated successfully!');
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header for authenticated users -->
	<header class="bg-white shadow">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center">
					<h1 class="text-xl font-bold text-indigo-600">vibe-management.pro</h1>
					<nav class="ml-10 flex space-x-8">
						<a href={`/${role}`} class="text-gray-500 hover:text-gray-700 px-1 pt-1 text-sm font-medium">Dashboard</a>
						<a href={`/${role}/settings`} class="text-gray-900 border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium">Settings</a>
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

	<main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="bg-white shadow rounded-lg p-6">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
			
			<form onsubmit={saveProfile} class="space-y-6">
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
					<input
						id="name"
						name="name"
						type="text"
						bind:value={profileData.name}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>
				
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
					<input
						id="email"
						name="email"
						type="email"
						bind:value={profileData.email}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>
				
				<div>
					<label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
					<input
						id="phone"
						name="phone"
						type="tel"
						bind:value={profileData.phone}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>
				
				<div class="flex items-center">
					<button
						type="submit"
						disabled={saving}
						class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-50"
					>
						{saving ? 'Saving...' : 'Save Changes'}
					</button>
					
					<button
						type="button"
						onclick={() => goto(`/${role}`)}
						class="ml-3 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition duration-200"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	</main>
</div>
