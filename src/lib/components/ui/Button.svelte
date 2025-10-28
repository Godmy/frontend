<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  
  type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'link';
  type ButtonSize = 'sm' | 'md' | 'lg';

  type Props = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    block?: boolean;
    children?: any;
  } & HTMLButtonAttributes;

  let { children, ...props }: Props = $props();

  let variantClasses = $derived({
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300',
    link: 'bg-transparent hover:bg-gray-100 text-indigo-600 underline'
  }[props.variant || 'primary']);

  let sizeClasses = $derived({
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }[props.size || 'md']);

  let disabledClass = $derived(props.disabled || props.loading
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : '');

  let blockClass = $derived(props.block ? 'w-full' : '');

  let classes = $derived(`inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${variantClasses} ${sizeClasses} ${disabledClass} ${blockClass}`);
</script>

<button {...props} class={classes}>
  {#if props.loading}
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    {#if children}
      {@render children()}
    {:else}
      Loading...
    {/if}
  {:else}
    {@render children()}
  {/if}
</button>