<script lang="ts">
	import { usePermissions } from '../composables/usePermissions.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		resource: string;
		action: string;
		scope?: string;
		children: Snippet;
		fallback?: Snippet;
	}

	let { resource, action, scope, children, fallback }: Props = $props();

	const permissions = usePermissions();

	const hasAccess = $derived(
		scope
			? permissions.canAccess(resource, action, scope)
			: permissions.hasPermission(resource, action)
	);
</script>

{#if hasAccess}
	{@render children()}
{:else if fallback}
	{@render fallback()}
{/if}
