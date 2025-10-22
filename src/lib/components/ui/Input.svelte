<script lang="ts">
	type Props = {
		id: string;
		label: string;
		type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel' | 'search';
		value: string | number | null;
		onchange?: (value: string | number) => void;
		onblur?: () => void;
		errors?: string[];
		required?: boolean;
		disabled?: boolean;
		placeholder?: string;
		autocomplete?: string;
		min?: number;
		max?: number;
		step?: number;
		class?: string;
	};

	let {
		id,
		label,
		type = 'text',
		value = $bindable(),
		onchange,
		onblur,
		errors = [],
		required = false,
		disabled = false,
		placeholder = '',
		autocomplete,
		min,
		max,
		step,
		class: className = ''
	}: Props = $props();

	let hasError = $derived(errors.length > 0);
	let inputClasses = $derived(
		`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm ${
			hasError
				? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
				: 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
		} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`
	);

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const newValue = type === 'number' ? Number(target.value) : target.value;
		value = newValue;
		onchange?.(newValue);
	}

	function handleBlur() {
		onblur?.();
	}
</script>

<div>
	<label for={id} class="block text-sm font-medium text-gray-700">
		{label}
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</label>
	<input
		{id}
		{type}
		{value}
		{required}
		{disabled}
		{placeholder}
		{autocomplete}
		{min}
		{max}
		{step}
		class={inputClasses}
		oninput={handleInput}
		onblur={handleBlur}
		aria-invalid={hasError}
		aria-describedby={hasError ? `${id}-error` : undefined}
	/>
	{#if hasError}
		<div id="{id}-error" class="mt-1 text-sm text-red-600" role="alert">
			{#each errors as error}
				<p>{error}</p>
			{/each}
		</div>
	{/if}
</div>
