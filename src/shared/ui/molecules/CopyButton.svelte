<script lang="ts">
  import { copyToClipboard } from '$lib/utils/clipboard';
  import { notificationStore } from '$lib/notifications/notificationStore.svelte';

  type Props = {
    text: string;
    label?: string;
    successMessage?: string;
    showIcon?: boolean;
    class?: string;
  };

  let {
    text,
    label = 'Copy',
    successMessage = 'Copied to clipboard',
    showIcon = true,
    class: className = ''
  }: Props = $props();

  let copied = $state(false);

  async function handleCopy() {
    const success = await copyToClipboard(text);

    if (success) {
      copied = true;
      notificationStore.success(successMessage);
      setTimeout(() => {
        copied = false;
      }, 2000);
    } else {
      notificationStore.error('Failed to copy to clipboard');
    }
  }
</script>

<button
  type="button"
  onclick={handleCopy}
  class="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors {className}"
  aria-label={copied ? 'Copied' : label}
>
  {#if showIcon}
    {#if copied}
      <svg class="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    {:else}
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    {/if}
  {/if}
  <span>{copied ? 'Copied!' : label}</span>
</button>
