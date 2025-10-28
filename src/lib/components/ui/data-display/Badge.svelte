<script lang="ts">
  // Компонент Badge теперь находится в новой структуре shared/ui
  // Этот файл обеспечивает обратную совместимость
  
  import OriginalBadge from '$shared/ui/atoms/Badge.svelte';
  
  type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
  type BadgeSize = 'sm' | 'md' | 'lg';

  type Props = {
    variant?: BadgeVariant;
    size?: BadgeSize;
    class?: string;
  };

  let props: Props = $props();
</script>

<OriginalBadge {...props} />