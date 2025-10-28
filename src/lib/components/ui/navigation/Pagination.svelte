<script lang="ts">
  type Props = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    class?: string;
  };

  let props: Props = $props();

  const siblingCount = props.siblingCount || 1;
  const showPrev = props.currentPage > 1;
  const showNext = props.currentPage < props.totalPages;

  // Определяем диапазон страниц для отображения
  $: paginationRange = (() => {
    const totalPageNumbers = siblingCount + 5; // 2 siblings + first + last + current + 2*3 dots

    if (props.totalPages <= totalPageNumbers) {
      return Array.from({ length: props.totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(props.currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(props.currentPage + siblingCount, props.totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < props.totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);

      return [...leftRange, '...', props.totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + siblingCount;
      const rightRange = Array.from({ length: rightItemCount }, (_, i) => props.totalPages - rightItemCount + i + 1);

      return [1, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: 2 * siblingCount + 1 },
        (_, i) => leftSiblingIndex + i
      );

      return [1, '...', ...middleRange, '...', props.totalPages];
    }
  })();
</script>

<div class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 {props.class || ''}" {...$$rest}>
  <div class="flex flex-1 sm:justify-start">
    <button
      type="button"
      disabled={!showPrev}
      class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      on:click={() => props.onPageChange(props.currentPage - 1)}
    >
      Предыдущая
    </button>
  </div>
  <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
    <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
      {#each paginationRange as page}
        {#if page === '...'}
          <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-500">...</span>
        {:else}
          <button
            type="button"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold
              {props.currentPage === page 
                ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' 
                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'}"
            on:click={() => props.onPageChange(page as number)}
          >
            {page}
          </button>
        {/if}
      {/each}
    </nav>
  </div>
  <div class="flex flex-1 justify-end sm:justify-end">
    <button
      type="button"
      disabled={!showNext}
      class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      on:click={() => props.onPageChange(props.currentPage + 1)}
    >
      Следующая
    </button>
  </div>
</div>