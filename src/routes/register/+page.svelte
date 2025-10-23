<script lang="ts">
	import { useAuth } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { t } from '$lib/utils/i18n';

	let username = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let agreeToTerms = $state(false);

	const auth = useAuth();
	let localError = $state<string | null>(null);

	// Get translations from layout
	const trans = $derived($page.data.translations || {});

	async function handleRegister() {
		localError = null;

		// Валидация
		if (password !== confirmPassword) {
			localError = t(trans, 'ui/auth/register/passwordMismatch', 'Passwords do not match');
			return;
		}

		if (!agreeToTerms) {
			localError = t(trans, 'ui/auth/register/agreeTerms', 'Please agree to the Terms and Conditions');
			return;
		}

		if (password.length < 8) {
			localError = t(trans, 'ui/auth/register/passwordLength', 'Password must be at least 8 characters');
			return;
		}

		const result = await auth.register({
			username,
			email,
			password,
			firstName: firstName || undefined,
			lastName: lastName || undefined
		});

		if (result.success) {
			goto('/dashboard');
		}
	}

	// Password strength indicator
	const passwordStrength = $derived(() => {
		if (!password) return { score: 0, label: '', color: '' };

		let score = 0;
		if (password.length >= 8) score++;
		if (password.length >= 12) score++;
		if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
		if (/\d/.test(password)) score++;
		if (/[^a-zA-Z\d]/.test(password)) score++;

		if (score <= 2) return { score, label: t(trans, 'ui/auth/register/passwordWeak', 'Weak'), color: 'bg-red-500' };
		if (score <= 3) return { score, label: t(trans, 'ui/auth/register/passwordFair', 'Fair'), color: 'bg-yellow-500' };
		if (score <= 4) return { score, label: t(trans, 'ui/auth/register/passwordGood', 'Good'), color: 'bg-blue-500' };
		return { score, label: t(trans, 'ui/auth/register/passwordStrong', 'Strong'), color: 'bg-green-500' };
	});
</script>

<svelte:head>
	<title>{t(trans, 'ui/auth/register/title', 'Create your account')} - Multipult</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
	<div class="flex items-center justify-center">
	<div class="max-w-2xl w-full space-y-8">
		<!-- Header -->
		<div class="text-center">
			<h2 class="text-4xl font-extrabold text-gray-900">
				{t(trans, 'ui/auth/register/title', 'Create your account')}
			</h2>
			<p class="mt-2 text-sm text-gray-600">
				{t(trans, 'ui/auth/register/subtitle', 'Join us and start managing your content')}
			</p>
		</div>

		<!-- Main Form Card -->
		<div class="bg-white rounded-2xl shadow-xl p-8">
			<form onsubmit={(e) => { e.preventDefault(); handleRegister(); }} class="space-y-6">
				<!-- Username & Email -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label for="username" class="block text-sm font-medium text-gray-700 mb-2">
							{t(trans, 'ui/auth/username', 'Username')} *
						</label>
						<input
							id="username"
							type="text"
							required
							bind:value={username}
							disabled={auth.isLoading}
							class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
							placeholder={t(trans, 'ui/auth/register/usernamePlaceholder', 'johndoe')}
						/>
					</div>

					<div>
						<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
							{t(trans, 'ui/auth/email', 'Email address')} *
						</label>
						<input
							id="email"
							type="email"
							required
							bind:value={email}
							disabled={auth.isLoading}
							class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
							placeholder={t(trans, 'ui/auth/register/emailPlaceholder', 'john@example.com')}
						/>
					</div>
				</div>

				<!-- First Name & Last Name -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
							{t(trans, 'ui/auth/firstName', 'First Name')}
						</label>
						<input
							id="firstName"
							type="text"
							bind:value={firstName}
							disabled={auth.isLoading}
							class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
							placeholder={t(trans, 'ui/auth/register/firstNamePlaceholder', 'John')}
						/>
					</div>

					<div>
						<label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
							{t(trans, 'ui/auth/lastName', 'Last Name')}
						</label>
						<input
							id="lastName"
							type="text"
							bind:value={lastName}
							disabled={auth.isLoading}
							class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
							placeholder={t(trans, 'ui/auth/register/lastNamePlaceholder', 'Doe')}
						/>
					</div>
				</div>

				<!-- Password -->
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
						{t(trans, 'ui/auth/password', 'Password')} *
					</label>
					<input
						id="password"
						type="password"
						required
						bind:value={password}
						disabled={auth.isLoading}
						class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
						placeholder={t(trans, 'ui/auth/register/passwordPlaceholder', 'At least 8 characters')}
					/>

					{#if password}
						<div class="mt-2">
							<div class="flex items-center justify-between mb-1">
								<span class="text-xs text-gray-600">{t(trans, 'ui/auth/register/passwordStrengthLabel', 'Password strength:')}</span>
								<span class="text-xs font-medium {passwordStrength().color.replace('bg-', 'text-')}">
									{passwordStrength().label}
								</span>
							</div>
							<div class="w-full bg-gray-200 rounded-full h-2">
								<div
									class="{passwordStrength().color} h-2 rounded-full transition-all duration-300"
									style="width: {passwordStrength().score * 20}%"
								></div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Confirm Password -->
				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
						{t(trans, 'ui/auth/confirmPassword', 'Confirm Password')} *
					</label>
					<input
						id="confirmPassword"
						type="password"
						required
						bind:value={confirmPassword}
						disabled={auth.isLoading}
						class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
						placeholder={t(trans, 'ui/auth/register/confirmPasswordPlaceholder', 'Re-enter your password')}
					/>
					{#if confirmPassword && password !== confirmPassword}
						<p class="mt-1 text-sm text-red-600">{t(trans, 'ui/auth/register/passwordMismatch', 'Passwords do not match')}</p>
					{/if}
				</div>

				<!-- Terms and Conditions -->
				<div class="flex items-start">
					<input
						id="terms"
						type="checkbox"
						bind:checked={agreeToTerms}
						class="h-4 w-4 mt-1 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
					/>
					<label for="terms" class="ml-2 block text-sm text-gray-700">
						{t(trans, 'ui/auth/register/agreePrefix', 'I agree to the')}
						<a href="/terms" class="text-indigo-600 hover:text-indigo-500 font-medium">{t(trans, 'ui/auth/register/terms', 'Terms and Conditions')}</a>
						{t(trans, 'ui/auth/register/and', 'and')}
						<a href="/privacy" class="text-indigo-600 hover:text-indigo-500 font-medium">{t(trans, 'ui/auth/register/privacy', 'Privacy Policy')}</a>
					</label>
				</div>

				<!-- Error Message -->
				{#if localError || auth.error}
					<div class="rounded-lg bg-red-50 border border-red-200 p-4">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm font-medium text-red-800">
									{localError || auth.error}
								</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={auth.isLoading || !agreeToTerms}
					class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
				>
					{#if auth.isLoading}
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						{t(trans, 'ui/auth/register/creatingAccount', 'Creating account...')}
					{:else}
						{t(trans, 'ui/button/register', 'Create account')}
					{/if}
				</button>
			</form>
		</div>

		<!-- Sign In Link -->
		<div class="text-center">
			<p class="text-sm text-gray-600">
				{t(trans, 'ui/auth/register/haveAccount', 'Already have an account?')}
				<a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
					{t(trans, 'ui/auth/register/signInHere', 'Sign in here')}
				</a>
			</p>
		</div>
	</div>
	</div>
</div>
