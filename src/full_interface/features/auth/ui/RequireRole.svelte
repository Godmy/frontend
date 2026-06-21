<script lang="ts">
  import { usePermissions } from '$lib/auth/composables/usePermissions.svelte';

  type Props = {
    role?: string;
    roles?: string[];
    requireAll?: boolean;
  };

  let { role, roles, requireAll = false }: Props = $props();

  const permissions = usePermissions();

  const hasRole = $derived(() => {
    if (role) {
      return permissions.hasRole(role);
    }

    if (roles) {
      return requireAll
        ? permissions.hasAllRoles(roles)
        : permissions.hasAnyRole(roles);
    }

    return false;
  });
</script>

{#if hasRole()}
  <slot />
{:else}
  <slot name="fallback" />
{/if}
