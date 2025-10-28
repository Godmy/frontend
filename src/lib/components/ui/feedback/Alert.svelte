<script lang="ts">
  type AlertType = 'success' | 'error' | 'warning' | 'info';

  type Props = {
    type?: AlertType;
    title?: string;
    class?: string;
  };

  let props: Props = $props();

  $: icon = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  }[props.type || 'info'];

  $: colorClasses = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  }[props.type || 'info'];
</script>

<div class="{colorClasses} border rounded-md p-4 {props.class || ''}" role="alert" {...$$rest}>
  <div class="flex">
    <div class="flex-shrink-0">
      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      {#if props.title}
        <h3 class="text-sm font-medium">
          {props.title}
        </h3>
      {/if}
      <div class="mt-2 text-sm">
        <p>{@render $$slots.default?.()}</p>
      </div>
    </div>
  </div>
</div>