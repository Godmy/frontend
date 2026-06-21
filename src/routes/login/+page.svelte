<script lang="ts">
	import { onMount } from 'svelte';
	import { useAuth } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { invalidate } from '$app/navigation';
	
	const auth = useAuth();
	
	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);
	
	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();
		loading = true;
		error = '';
		
		try {
			await auth.login(email, password);
			
			// После успешной авторизации перенаправляем на страницу пользователя по роли
			if (auth.user) {
				const role = auth.user.role || 'user';
				goto(`/${role}`);
			} else {
				goto('/user'); // по умолчанию
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Invalid credentials';
			console.error('Login error:', err);
		} finally {
			loading = false;
		}
	}
	
	// Если уже авторизован, перенаправляем
	onMount(() => {
		if (auth.isAuthenticated) {
			const role = auth.user?.role || 'user';
			goto(`/${role}`);
		}
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
	<div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
		<h2 class="text-2xl font-bold text-center text-gray-900 mb-6">Sign in to your account</h2>
		
		{#if error}
			<div class="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
				{error}
			</div>
		{/if}
		
		<form onsubmit={handleLogin} class="space-y-6">
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					placeholder="you@example.com"
					bind:value={email}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				/>
			</div>
			
			<div>
				<div class="flex items-center justify-between mb-1">
					<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
					<a href="/forgot-password" class="text-sm text-indigo-600 hover:text-indigo-500">Forgot password?</a>
				</div>
				<input
					id="password"
					name="password"
					type="password"
					required
					placeholder="••••••••"
					bind:value={password}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				/>
			</div>
			
			<button
				type="submit"
				disabled={loading}
				class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50"
			>
				{loading ? 'Signing in...' : 'Sign in'}
			</button>
		</form>
		
		<div class="mt-6 text-center">
			<p class="text-sm text-gray-600">
				Don't have an account? 
				<a href="/register" class="font-medium text-indigo-600 hover:text-indigo-500">Sign up</a>
			</p>
		</div>
	</div>
</div>