<script lang="ts">
  type ProgressBarSize = 'sm' | 'md' | 'lg';
  type ProgressBarVariant = 'primary' | 'success' | 'warning' | 'danger';

  type Props = {
    value: number;
    max?: number;
    label?: string;
    showPercentage?: boolean;
    size?: ProgressBarSize;
    variant?: ProgressBarVariant;
    class?: string;
  };

  let props: Props = $props();

  $: percentage = Math.round((props.value / (props.max || 100)) * 100);
  $: sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }[props.size || 'md'];

  $: colorClasses = {
    primary: 'bg-indigo-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  }[props.variant || 'primary'];
</script>

<div class="w-full" {...$$rest}>
  {#if props.label}
    <div class="flex justify-between mb-1">
      <span class="text-sm font-medium text-gray-700">{props.label}</span>
      {#if props.showPercentage !== false}
        <span class="text-sm font-medium text-gray-700">{percentage}%</span>
      {/if}
    </div>
  {/if}
  <div class="relative pt-1">
    <div class="overflow-hidden h-2 bg-gray-200 rounded-full">
      <div
        class="{sizeClasses} {colorClasses} transition-all duration-300 ease-out"
        style="width: {percentage}%"
      ></div>
    </div>
  </div>
</div>