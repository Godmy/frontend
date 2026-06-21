<script lang="ts">
  type Props = {
    value: number;
    max?: number;
    label?: string;
    showPercentage?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'success' | 'warning' | 'danger';
    class?: string;
  };

  let {
    value,
    max = 100,
    label,
    showPercentage = true,
    size = 'md',
    variant = 'primary',
    class: className = ''
  }: Props = $props();

  const percentage = $derived(Math.min(Math.max((value / max) * 100, 0), 100));

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    primary: 'bg-indigo-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  };
</script>

<div class={className}>
  {#if label || showPercentage}
    <div class="flex justify-between items-center mb-1">
      {#if label}
        <span class="text-sm font-medium text-gray-700">{label}</span>
      {/if}
      {#if showPercentage}
        <span class="text-sm font-medium text-gray-700">{percentage.toFixed(0)}%</span>
      {/if}
    </div>
  {/if}
  <div class="w-full bg-gray-200 rounded-full {sizeClasses[size]} overflow-hidden">
    <div
      class="{sizeClasses[size]} {variantClasses[variant]} rounded-full transition-all duration-300 ease-in-out"
      style="width: {percentage}%"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    ></div>
  </div>
</div>
