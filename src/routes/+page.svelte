<script lang="ts">
	import { useAuth } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	const auth = useAuth();

	onMount(() => {
		// Если пользователь уже авторизован, перенаправляем на его роль
		if (auth.isAuthenticated && auth.user) {
			const role = auth.user.role || 'user';
			goto(`/${role}`);
		}
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
	<div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome to vibe-management.pro</h1>
		<p class="text-gray-600 mb-8">Simple and efficient interface</p>
		
		<div class="space-y-4">
			<a 
				href="/login" 
				class="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
			>
				Sign In
			</a>
			
			<a 
				href="/register" 
				class="block w-full py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium rounded-lg transition duration-200"
			>
				Create Account
			</a>
		</div>
	</div>
</div>
