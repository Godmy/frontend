<script lang="ts">
	type Option = {
		value: string | number;
		label: string;
	};

	type Props = {
		id: string;
		label: string;
		value: string | number | null;
		onchange?: (value: string | number) => void;
		onblur?: () => void;
		options: Option[];
		errors?: string[];
		required?: boolean;
		disabled?: boolean;
		placeholder?: string;
		class?: string;
	};

	let {
		id,
		label,
		value = $bindable(),
		onchange,
		onblur,
		options,
		errors = [],
		required = false,
		disabled = false,
		placeholder = 'Select an option',
		class: className = ''
	}: Props = $props();

	let hasError = $derived(errors.length > 0);
	let selectClasses = $derived(
		`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm ${
			hasError
				? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
				: 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
		} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`
	);

	function handleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const newValue = target.value;
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
	<select
		{id}
		{value}
		{required}
		{disabled}
		class={selectClasses}
		onchange={handleChange}
		onblur={handleBlur}
		aria-invalid={hasError}
		aria-describedby={hasError ? `${id}-error` : undefined}
	>
		{#if placeholder}
			<option value="" disabled selected={value === null || value === ''}>
				{placeholder}
			</option>
		{/if}
		{#each options as option}
			<option value={option.value}>
				{option.label}
			</option>
		{/each}
	</select>
	{#if hasError}
		<div id="{id}-error" class="mt-1 text-sm text-red-600" role="alert">
			{#each errors as error}
				<p>{error}</p>
			{/each}
		</div>
	{/if}
</div>
