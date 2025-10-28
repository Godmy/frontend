<script lang="ts">
	type Props = {
		id: string;
		label: string;
		checked: boolean;
		onchange?: (checked: boolean) => void;
		errors?: string[];
		disabled?: boolean;
		description?: string;
		class?: string;
	};

	let {
		id,
		label,
		checked = $bindable(),
		onchange,
		errors = [],
		disabled = false,
		description,
		class: className = ''
	}: Props = $props();

	$: hasError = errors.length > 0;

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		checked = target.checked;
		if (onchange) onchange(target.checked);
	}
</script>

<div class={className}>
	<div class="flex items-start">
		<div class="flex items-center h-5">
			<input
				{id}
				type="checkbox"
				{checked}
				{disabled}
				class={"h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded " + (disabled
					? "bg-gray-100 cursor-not-allowed"
					: "")}
				onchange={handleChange}
				aria-invalid={hasError}
				aria-describedby={description || hasError ? (id + "-description") : undefined}
			/>
		</div>
		<div class="ml-3 text-sm">
			<label for={id} class="font-medium text-gray-700">
				{label}
			</label>
			{#if description}
				<p id={id + "-description"} class="text-gray-500">
					{description}
				</p>
			{/if}
			{#if hasError}
				<div id={id + "-error"} class="mt-1 text-sm text-red-600" role="alert">
					{#each errors as error}
						<p>{error}</p>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
