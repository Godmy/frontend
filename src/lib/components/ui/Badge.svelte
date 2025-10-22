<script lang="ts">
	type Props = {
		variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
		size?: 'sm' | 'md' | 'lg';
		children?: import('svelte').Snippet;
		class?: string;
	};

	let {
		variant = 'default',
		size = 'md',
		children,
		class: className = ''
	}: Props = $props();

	const variantClasses = {
		default: 'bg-gray-100 text-gray-800',
		success: 'bg-green-100 text-green-800',
		warning: 'bg-yellow-100 text-yellow-800',
		danger: 'bg-red-100 text-red-800',
		info: 'bg-blue-100 text-blue-800'
	};

	const sizeClasses = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-2.5 py-0.5 text-sm',
		lg: 'px-3 py-1 text-base'
	};
</script>

<span
	class="inline-flex items-center font-medium rounded-full {variantClasses[variant]} {sizeClasses[size]} {className}"
>
	{#if children}
		{@render children()}
	{/if}
</span>
