<script lang="ts">
  import { useAuth } from '$lib/auth/composables/useAuth.svelte';
  import { onMount } from 'svelte';

  type Props = {
    redirectTo?: string;
  };

  let { redirectTo = '/login' }: Props = $props();

  const auth = useAuth();

  onMount(async () => {
    if (!auth.isAuthenticated) {
      await auth.checkAuth();
    }

    if (!auth.isAuthenticated && !auth.isLoading) {
      window.location.href = redirectTo;
    }
  });
</script>

{#if auth.isLoading}
  <div class="flex items-center justify-center min-h-screen">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
{:else if auth.isAuthenticated}
  <slot />
{:else}
  <slot name="fallback">
    <div class="flex items-center justify-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  </slot>
{/if}
