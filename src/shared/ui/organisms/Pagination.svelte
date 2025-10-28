<script lang="ts">
  type Props = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    class?: string;
  };

  let {
    currentPage = $bindable(),
    totalPages,
    onPageChange,
    siblingCount = 1,
    class: className = ''
  }: Props = $props();

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => start + idx);
  };

  const DOTS = '...';

  const paginationRange = $derived(() => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return [];
  });

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      currentPage = page;
      onPageChange(page);
    }
  }

  function previousPage() {
    goToPage(currentPage - 1);
  }

  function nextPage() {
    goToPage(currentPage + 1);
  }
</script>

<nav class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 {className}" aria-label="Pagination">
  <div class="-mt-px flex w-0 flex-1">
    <button
      type="button"
      onclick={previousPage}
      disabled={currentPage === 1}
      class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Previous page"
    >
      <svg class="mr-3 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z" clip-rule="evenodd" />
      </svg>
      Previous
    </button>
  </div>
  <div class="hidden md:-mt-px md:flex">
    {#each paginationRange() as pageNumber}
      {#if pageNumber === DOTS}
        <span class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
          {DOTS}
        </span>
      {:else}
        <button
          type="button"
          onclick={() => goToPage(Number(pageNumber))}
          class="inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium {pageNumber === currentPage
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
          aria-label="Go to page {pageNumber}"
          aria-current={pageNumber === currentPage ? 'page' : undefined}
        >
          {pageNumber}
        </button>
      {/if}
    {/each}
  </div>
  <div class="-mt-px flex w-0 flex-1 justify-end">
    <button
      type="button"
      onclick={nextPage}
      disabled={currentPage === totalPages}
      class="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Next page"
    >
      Next
      <svg class="ml-3 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</nav>

<!-- Mobile view -->
<div class="md:hidden flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
  <div class="flex-1 flex justify-between">
    <button
      type="button"
      onclick={previousPage}
      disabled={currentPage === 1}
      class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>
    <span class="text-sm text-gray-700 self-center">
      Page {currentPage} of {totalPages}
    </span>
    <button
      type="button"
      onclick={nextPage}
      disabled={currentPage === totalPages}
      class="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
</div>
