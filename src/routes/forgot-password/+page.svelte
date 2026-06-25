<script lang="ts">
	import { useAuth } from '$lib/auth';
	import ForgotPasswordPage from '$stylist/user/component/organism/forgot-password-page/index.svelte';
	import type { PasswordResetRequest } from '$stylist/user/type/object/password-reset-request';

	const auth = useAuth();

	async function handleReset(data: PasswordResetRequest) {
		await auth.requestPasswordReset({ email: data.email });
	}
</script>

<ForgotPasswordPage
	formState={{
		isLoading: auth.isLoading,
		error: auth.error ?? undefined,
		success: false
	}}
	onSubmit={handleReset}
	loginHref="/login"
/>
