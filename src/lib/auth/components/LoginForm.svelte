<script lang="ts">
	import { useAuth } from '../composables/useAuth.svelte';

	let username = $state('');
	let password = $state('');

	const auth = useAuth();

	async function handleSubmit() {
		const result = await auth.login({ username, password });

		if (result.success) {
			// Успешная авторизация
			window.location.href = '/dashboard';
		}
	}
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
	<div>
		<label for="username" class="block text-sm font-medium">
			Username
		</label>
		<input
			id="username"
			type="text"
			bind:value={username}
			required
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
		/>
	</div>

	<div>
		<label for="password" class="block text-sm font-medium">
			Password
		</label>
		<input
			id="password"
			type="password"
			bind:value={password}
			required
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
		/>
	</div>

	{#if auth.error}
		<div class="text-red-600 text-sm">
			{auth.error}
		</div>
	{/if}

	<button
		type="submit"
		disabled={auth.isLoading}
		class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
	>
		{auth.isLoading ? 'Loading...' : 'Sign In'}
	</button>
</form>
