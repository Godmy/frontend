<script lang="ts">
  import { useAuth } from '$lib/auth/composables/useAuth.svelte';

  let username = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let firstName = $state('');
  let lastName = $state('');

  const auth = useAuth();
  let localError = $state<string | null>(null);

  async function handleSubmit() {
    localError = null;

    if (password !== confirmPassword) {
      localError = 'Passwords do not match';
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
      // Успешная регистрация
      window.location.href = '/dashboard';
    }
  }
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
  <div>
    <label for="username" class="block text-sm font-medium">
      Username *
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
    <label for="email" class="block text-sm font-medium">
      Email *
    </label>
    <input
      id="email"
      type="email"
      bind:value={email}
      required
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    />
  </div>

  <div class="grid grid-cols-2 gap-4">
    <div>
      <label for="firstName" class="block text-sm font-medium">
        First Name
      </label>
      <input
        id="firstName"
        type="text"
        bind:value={firstName}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label for="lastName" class="block text-sm font-medium">
        Last Name
      </label>
      <input
        id="lastName"
        type="text"
        bind:value={lastName}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
  </div>

  <div>
    <label for="password" class="block text-sm font-medium">
      Password *
    </label>
    <input
      id="password"
      type="password"
      bind:value={password}
      required
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    />
  </div>

  <div>
    <label for="confirmPassword" class="block text-sm font-medium">
      Confirm Password *
    </label>
    <input
      id="confirmPassword"
      type="password"
      bind:value={confirmPassword}
      required
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    />
  </div>

  {#if localError || auth.error}
    <div class="text-red-600 text-sm">
      {localError || auth.error}
    </div>
  {/if}

  <button
    type="submit"
    disabled={auth.isLoading}
    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
  >
    {auth.isLoading ? 'Creating account...' : 'Sign Up'}
  </button>
</form>
