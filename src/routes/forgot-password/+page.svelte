<script lang="ts">
	import { useAuth } from '$lib/auth';

	let email = $state('');
	let submitted = $state(false);

	const auth = useAuth();

	async function handleSubmit() {
		const result = await auth.requestPasswordReset({ email });

		if (result.success) {
			submitted = true;
		}
	}
</script>

<svelte:head>
	<title>Forgot Password - Multipult</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
	<div class="flex items-center justify-center">
	<div class="max-w-md w-full space-y-8">
		{#if !submitted}
			<!-- Header -->
			<div class="text-center">
				<h2 class="text-4xl font-extrabold text-gray-900">
					Forgot password?
				</h2>
				<p class="mt-2 text-sm text-gray-600">
					No worries, we'll send you reset instructions
				</p>
			</div>

			<!-- Form Card -->
			<div class="bg-white rounded-2xl shadow-xl p-8">
				<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
					<div>
						<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
							Email address
						</label>
						<input
							id="email"
							type="email"
							required
							bind:value={email}
							disabled={auth.isLoading}
							class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
							placeholder="Enter your email"
						/>
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
							Sending...
						{:else}
							Reset password
						{/if}
					</button>
				</form>
			</div>

			<!-- Back to Login -->
			<div class="text-center">
				<a href="/login" class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
					</svg>
					Back to login
				</a>
			</div>
		{:else}
			<!-- Success Message -->
			<div class="text-center">
				<div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
					<svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"/>
					</svg>
				</div>

				<h2 class="text-3xl font-extrabold text-gray-900 mb-2">
					Check your email
				</h2>
				<p class="text-sm text-gray-600 mb-6">
					We've sent password reset instructions to<br/>
					<span class="font-medium text-gray-900">{email}</span>
				</p>

				<div class="bg-white rounded-2xl shadow-xl p-8">
					<div class="space-y-4">
						<div class="flex items-start">
							<svg class="h-5 w-5 text-indigo-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
							</svg>
							<p class="text-sm text-gray-600">Check your inbox and spam folder</p>
						</div>

						<div class="flex items-start">
							<svg class="h-5 w-5 text-indigo-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
							</svg>
							<p class="text-sm text-gray-600">Click the reset link in the email</p>
						</div>

						<div class="flex items-start">
							<svg class="h-5 w-5 text-indigo-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
							</svg>
							<p class="text-sm text-gray-600">Create a new password</p>
						</div>
					</div>

					<div class="mt-6 pt-6 border-t border-gray-200">
						<p class="text-xs text-gray-500 text-center">
							Didn't receive the email?
							<button
								onclick={() => { submitted = false; }}
								class="font-medium text-indigo-600 hover:text-indigo-500"
							>
								Try again
							</button>
						</p>
					</div>
				</div>

				<div class="mt-6">
					<a href="/login" class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
						</svg>
						Back to login
					</a>
				</div>
			</div>
		{/if}
	</div>
	</div>
</div>
