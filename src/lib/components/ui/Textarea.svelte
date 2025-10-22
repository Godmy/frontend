<script lang="ts">
	type Props = {
		id: string;
		label: string;
		value: string;
		onchange?: (value: string) => void;
		onblur?: () => void;
		errors?: string[];
		required?: boolean;
		disabled?: boolean;
		placeholder?: string;
		rows?: number;
		maxlength?: number;
		class?: string;
	};

	let {
		id,
		label,
		value = $bindable(),
		onchange,
		onblur,
		errors = [],
		required = false,
		disabled = false,
		placeholder = '',
		rows = 3,
		maxlength,
		class: className = ''
	}: Props = $props();

	let hasError = $derived(errors.length > 0);
	let textareaClasses = $derived(
		`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm ${
			hasError
				? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
				: 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
		} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`
	);

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		value = target.value;
		onchange?.(target.value);
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
	<textarea
		{id}
		{value}
		{required}
		{disabled}
		{placeholder}
		{rows}
		{maxlength}
		class={textareaClasses}
		oninput={handleInput}
		onblur={handleBlur}
		aria-invalid={hasError}
		aria-describedby={hasError ? `${id}-error` : undefined}
	></textarea>
	{#if hasError}
		<div id="{id}-error" class="mt-1 text-sm text-red-600" role="alert">
			{#each errors as error}
				<p>{error}</p>
			{/each}
		</div>
	{/if}
	{#if maxlength}
		<p class="mt-1 text-xs text-gray-500">
			{value.length}/{maxlength} characters
		</p>
	{/if}
</div>
