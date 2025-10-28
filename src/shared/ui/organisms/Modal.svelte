<script lang="ts">
  import { onMount } from 'svelte';

  type Props = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    closeOnEscape?: boolean;
    closeOnClickOutside?: boolean;
  };

  let {
    isOpen = $bindable(),
    onClose,
    title,
    size = 'md',
    closeOnEscape = true,
    closeOnClickOutside = true
  }: Props = $props();

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl'
  };

  function handleKeydown(e: KeyboardEvent) {
    if (closeOnEscape && e.key === 'Escape' && isOpen) {
      onClose();
    }
  }

  function handleBackdropClick() {
    if (closeOnClickOutside) {
      onClose();
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

{#if isOpen}
  <div class="fixed z-50 inset-0 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <button
        type="button"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity cursor-default z-40"
        onclick={handleBackdropClick}
        aria-label="Close modal"
        tabindex="-1"
      ></button>

      <!-- Spacer element to trick the browser into centering the modal contents -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle {sizeClasses[size]} sm:w-full z-50">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="flex items-start justify-between mb-4">
            <h3 id="modal-title" class="text-lg leading-6 font-medium text-gray-900">
              {title}
            </h3>
            <button
              type="button"
              class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
              onclick={onClose}
              aria-label="Close"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>
            <slot />
          </div>
        </div>
        {#if $$slots.footer}
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <slot name="footer" />
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
