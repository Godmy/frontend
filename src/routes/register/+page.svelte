<script lang="ts">
	import { onMount } from 'svelte';
	import { useAuth } from '$lib/auth';
	import { goto } from '$app/navigation';
	
	const auth = useAuth();
	
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let error = $state('');
	let loading = $state(false);
	
	async function handleRegister(event: SubmitEvent) {
		event.preventDefault();
		loading = true;
		error = '';
		
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			loading = false;
			return;
		}
		
		try {
			await auth.register({ username: name, email, password });

			// После успешной регистрации сразу логинимся и перенаправляем
			const loginEmail = email;
			const loginPassword = password;
			await auth.login({ username: loginEmail, password: loginPassword });
			
			if (auth.user) {
				const role = auth.user.role || 'user';
				goto(`/${role}`);
			} else {
				goto('/user');
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Registration failed';
			console.error('Registration error:', err);
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
		<h2 class="text-2xl font-bold text-center text-gray-900 mb-6">Create account</h2>
		
		{#if error}
			<div class="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
				{error}
			</div>
		{/if}
		
		<form onsubmit={handleRegister} class="space-y-6">
			<div>
				<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
				<input
					id="name"
					name="name"
					type="text"
					required
					placeholder="John Doe"
					bind:value={name}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				/>
			</div>
			
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
				<label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
			
			<div>
				<label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
				<input
					id="confirm-password"
					name="confirm-password"
					type="password"
					required
					placeholder="••••••••"
					bind:value={confirmPassword}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				/>
			</div>
			
			<button
				type="submit"
				disabled={loading}
				class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50"
			>
				{loading ? 'Creating account...' : 'Create account'}
			</button>
		</form>
		
		<div class="mt-6 text-center">
			<p class="text-sm text-gray-600">
				Already have an account? 
				<a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Sign in</a>
			</p>
		</div>
	</div>
</div>