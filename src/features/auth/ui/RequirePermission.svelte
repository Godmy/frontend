<script lang="ts">
  import { usePermissions } from '$lib/auth/composables/usePermissions.svelte';

  type Props = {
    resource: string;
    action: string;
    scope?: string;
  };

  let { resource, action, scope }: Props = $props();

  const permissions = usePermissions();

  const hasAccess = $derived(
    scope
      ? permissions.canAccess(resource, action, scope)
      : permissions.hasPermission(resource, action)
  );
</script>

{#if hasAccess}
  <slot />
{:else}
  <slot name="fallback" />
{/if}
