<script lang="ts">
	import { debounce } from '$lib/utils/debounce';

	type Props = {
		value: string;
		onchange: (value: string) => void;
		placeholder?: string;
		debounceMs?: number;
		class?: string;
	};

	let {
		value = $bindable(),
		onchange,
		placeholder = 'Search...',
		debounceMs = 300,
		class: className = ''
	}: Props = $props();

	// Create debounced version of the onChange handler
	const debouncedOnChange = debounce(onchange, debounceMs);

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;

		// Call debounced handler
		debouncedOnChange(target.value);
	}

	function clearSearch() {
		value = '';
		onchange(''); // Call immediately for clear action
	}
</script>

<div class="relative {className}">
	<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
		<svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
		</svg>
	</div>
	<input
		type="search"
		{value}
		{placeholder}
		class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
		oninput={handleInput}
		aria-label="Search"
	/>
	{#if value}
		<div class="absolute inset-y-0 right-0 pr-3 flex items-center">
			<button
				type="button"
				onclick={clearSearch}
				class="text-gray-400 hover:text-gray-500 focus:outline-none"
				aria-label="Clear search"
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	{/if}
</div>
