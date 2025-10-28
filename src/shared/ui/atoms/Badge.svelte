<script lang="ts">
  type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
  type BadgeSize = 'sm' | 'md' | 'lg';

  type Props = {
    variant?: BadgeVariant;
    size?: BadgeSize;
    class?: string;
  };

  let {
    variant = 'default',
    size = 'md',
    class: className = ''
  }: Props = $props();

  let variantClasses = $derived({
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  }[variant]);

  let sizeClasses = $derived({
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  }[size]);

  let classes = $derived(`inline-flex items-center font-semibold rounded-full ${variantClasses} ${sizeClasses} ${className}`);
</script>

<span class={classes}>
  <slot />
</span>