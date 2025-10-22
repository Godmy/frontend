<script lang="ts">
	type Props = {
		title: string;
		description?: string;
		icon?: import('svelte').Snippet;
		action?: {
			label: string;
			onClick: () => void;
		};
		class?: string;
	};

	let { title, description, icon, action, class: className = '' }: Props = $props();
</script>

<div class="text-center py-12 {className}">
	{#if icon}
		<div class="mx-auto h-12 w-12 text-gray-400 mb-4">
			{@render icon()}
		</div>
	{:else}
		<svg
			class="mx-auto h-12 w-12 text-gray-400"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
			/>
		</svg>
	{/if}
	<h3 class="mt-2 text-sm font-medium text-gray-900">{title}</h3>
	{#if description}
		<p class="mt-1 text-sm text-gray-500 max-w-md mx-auto">{description}</p>
	{/if}
	{#if action}
		<div class="mt-6">
			<button
				type="button"
				onclick={action.onClick}
				class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				<svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				{action.label}
			</button>
		</div>
	{/if}
</div>
