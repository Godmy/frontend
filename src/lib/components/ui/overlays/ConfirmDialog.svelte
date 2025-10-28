<script lang="ts">
  import { Modal } from './Modal.svelte';

  type ConfirmDialogVariant = 'danger' | 'warning' | 'info';

  type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmDialogVariant;
    isLoading?: boolean;
  };

  let props: Props = $props();

  $: confirmButtonVariant = props.variant === 'danger' ? 'danger' : 
                           props.variant === 'warning' ? 'warning' : 'primary';
                           
  $: confirmButtonClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
  }[confirmButtonVariant];
</script>

<Modal isOpen={props.isOpen} onClose={props.onClose} title={props.title} size="sm">
  {#snippet children()}
    <div class="sm:flex sm:items-start">
      <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        <!-- Иконка в зависимости от типа -->
        {#if props.variant === 'danger'}
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        {:else if props.variant === 'warning'}
          <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        {:else}
          <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        {/if}
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {props.title}
        </h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500">
            {props.message}
          </p>
        </div>
      </div>
    </div>
  {/snippet}
  {#snippet footer()}
    <button
      type="button"
      class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
      on:click={props.onClose}
    >
      {props.cancelText || 'Отмена'}
    </button>
    <button
      type="button"
      disabled={props.isLoading}
      class="{confirmButtonClasses} w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
      on:click={props.onConfirm}
    >
      {#if props.isLoading}
        Загрузка...
      {:else}
        {props.confirmText || 'Подтвердить'}
      {/if}
    </button>
  {/snippet}
</Modal>