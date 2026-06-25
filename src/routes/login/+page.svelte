<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { useAuth } from '$lib/auth';
	import LoginPage from '$stylist/user/component/organism/login-page/index.svelte';
	import type { LoginCredentials } from '$stylist/user/type/object/login-credentials';

	const auth = useAuth();

	function getRoleRedirect() {
		return `/${auth.roles[0]?.name ?? 'user'}`;
	}

	onMount(() => {
		if (auth.isAuthenticated) goto(getRoleRedirect());
	});

	async function handleLogin(credentials: LoginCredentials) {
		// Адаптер: stylist-компонент отдаёт { email }, auth.login принимает { username }
		await auth.login({ username: credentials.email, password: credentials.password });
		if (auth.isAuthenticated) goto(getRoleRedirect());
	}
</script>

<LoginPage
	formState={{ isLoading: auth.isLoading, error: auth.error ?? undefined }}
	onSubmit={handleLogin}
	forgotPasswordHref="/forgot-password"
	registerHref="/register"
/>
