<script lang="ts">
  type Props = {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  };

  let { src, alt = '', fallback, size = 'md' }: Props = $props();

  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl'
  };

  let imageError = $state(false);
  const initials = $derived(
    fallback
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  );
</script>

<div class="inline-block {sizeClasses[size]} rounded-full overflow-hidden bg-gray-200">
  {#if src && !imageError}
    <img
      {src}
      {alt}
      class="h-full w-full object-cover"
      onerror={() => (imageError = true)}
    />
  {:else}
    <div class="h-full w-full flex items-center justify-center bg-indigo-600 text-white font-medium">
      {initials}
    </div>
  {/if}
</div>