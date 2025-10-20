<script lang="ts">
	import { usePermissions } from '../composables/usePermissions.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		role?: string;
		roles?: string[];
		requireAll?: boolean;
		children: Snippet;
		fallback?: Snippet;
	}

	let { role, roles, requireAll = false, children, fallback }: Props = $props();

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
	{@render children()}
{:else if fallback}
	{@render fallback()}
{/if}
