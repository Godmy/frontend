<script lang="ts">
  import { createPopper } from '@popperjs/core';

  type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

  type Props = {
    text: string;
    placement?: TooltipPlacement;
    class?: string;
  };

  let props: Props = $props();

  let triggerRef: HTMLElement;
  let tooltipRef: HTMLElement;
  let popperInstance: any;

  function setupPopper() {
    if (triggerRef && tooltipRef) {
      popperInstance = createPopper(triggerRef, tooltipRef, {
        placement: props.placement || 'top',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
        ],
      });
    }
  }

  function showTooltip() {
    if (tooltipRef) {
      tooltipRef.setAttribute('data-show', '');
      popperInstance.update();
    }
  }

  function hideTooltip() {
    if (tooltipRef) {
      tooltipRef.removeAttribute('data-show');
    }
  }

  $effect(() => {
    if (triggerRef && tooltipRef) {
      setupPopper();
    }

    return () => {
      if (popperInstance) {
        popperInstance.destroy();
      }
    };
  });
</script>

<span class="relative {props.class || ''}" {...$$rest}>
  <span
    bind:this={triggerRef}
    class="inline-block"
    on:mouseenter={showTooltip}
    on:mouseleave={hideTooltip}
    on:focus={showTooltip}
    on:blur={hideTooltip}
  >
    {@render $$slots.default?.()}
  </span>
  <span
    bind:this={tooltipRef}
    class="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-200"
    style="transform: translate3d(0, 0, 0);"
  >
    {props.text}
    <span class="absolute triangle" style="border-width: 4px;"></span>
  </span>
</span>

<style>
  [data-show] {
    opacity: 1;
    visibility: visible;
  }
  
  /* Треугольник для подсказки */
  .triangle {
    position: absolute;
    content: "";
  }
  
  /* Позиционирование треугольника в зависимости от направления */
  [data-popper-placement^="top"] > .triangle {
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-top: 4px solid #111827;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
  }
  
  [data-popper-placement^="bottom"] > .triangle {
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-bottom: 4px solid #111827;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
  }
  
  [data-popper-placement^="left"] > .triangle {
    right: -4px;
    top: 50%;
    transform: translateY(-50%);
    border-left: 4px solid #111827;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
  }
  
  [data-popper-placement^="right"] > .triangle {
    left: -4px;
    top: 50%;
    transform: translateY(-50%);
    border-right: 4px solid #111827;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
  }
</style>