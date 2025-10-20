<script lang="ts">
	import { useAuth } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let username = $state('');
	let password = $state('');
	let rememberMe = $state(false);

	const auth = useAuth();

	// Debug: отслеживание изменения auth.error
	$effect(() => {
		console.log('[Login Page] auth.error changed:', auth.error);
		console.log('[Login Page] auth.isLoading:', auth.isLoading);
		console.log('[Login Page] auth.isAuthenticated:', auth.isAuthenticated);
	});

	async function handleLogin(e?: Event) {
		e?.preventDefault();

		// Prevent double submission
		if (auth.isLoading) {
			console.log('[Login Page] Login already in progress, ignoring');
			return;
		}

		console.log('[Login Page] handleLogin called', { username, password });

		try {
			const result = await auth.login({ username, password });

			console.log('[Login Page] Login result:', result);

			if (result.success) {
				goto('/dashboard');
			} else {
				console.error('Login failed:', result.error);
			}
		} catch (error) {
			console.error('Login error:', error);
		}
	}

	async function handleGoogleLogin() {
		// Интеграция с Google OAuth будет здесь
		console.log('Google login');
	}

	async function handleTelegramLogin() {
		// Интеграция с Telegram будет здесь
		console.log('Telegram login');
	}
</script>

<svelte:head>
	<title>Login - Multipult</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<!-- Header -->
		<div class="text-center">
			<h2 class="text-4xl font-extrabold text-gray-900">
				Welcome back
			</h2>
			<p class="mt-2 text-sm text-gray-600">
				Sign in to your account to continue
			</p>
		</div>

		<!-- Main Form Card -->
		<div class="bg-white rounded-2xl shadow-xl p-8">
			<!-- Email/Password Login -->
			<form on:submit={handleLogin} class="space-y-6">
				<div>
					<label for="username" class="block text-sm font-medium text-gray-700 mb-2">
						Username or Email
					</label>
					<input
						id="username"
						type="text"
						required
						bind:value={username}
						disabled={auth.isLoading}
						class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
						placeholder="Enter your username"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
						Password
					</label>
					<input
						id="password"
						type="password"
						required
						bind:value={password}
						disabled={auth.isLoading}
						class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
						placeholder="Enter your password"
					/>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember-me"
							type="checkbox"
							bind:checked={rememberMe}
							class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
						/>
						<label for="remember-me" class="ml-2 block text-sm text-gray-700">
							Remember me
						</label>
					</div>

					<div class="text-sm">
						<a href="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
							Forgot password?
						</a>
					</div>
				</div>

				{#if auth.error}
					<div class="rounded-lg bg-red-50 border border-red-200 p-4">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm font-medium text-red-800">
									{auth.error}
								</p>
							</div>
						</div>
					</div>
				{/if}

				<button
					type="submit"
					disabled={auth.isLoading}
					class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
				>
					{#if auth.isLoading}
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Signing in...
					{:else}
						Sign in
					{/if}
				</button>
			</form>

			<!-- Divider -->
			<div class="mt-6">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-gray-300"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="px-2 bg-white text-gray-500">Or continue with</span>
					</div>
				</div>
			</div>

			<!-- Social Login Buttons -->
			<div class="mt-6 grid grid-cols-2 gap-3">
				<button
					type="button"
					on:click={handleGoogleLogin}
					class="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
				>
					<svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
						<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
					</svg>
					Google
				</button>

				<button
					type="button"
					on:click={handleTelegramLogin}
					class="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
				>
					<svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#0088cc">
						<path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.122.098.155.23.171.324.016.093.036.306.02.472z"/>
					</svg>
					Telegram
				</button>
			</div>
		</div>

		<!-- Sign Up Link -->
		<div class="text-center">
			<p class="text-sm text-gray-600">
				Don't have an account?
				<a href="/register" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
					Sign up for free
				</a>
			</p>
		</div>
	</div>
</div>
