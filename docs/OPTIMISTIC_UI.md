# Optimistic UI Updates

Guide for implementing optimistic UI updates with Houdini mutations.

## Overview

Optimistic UI updates immediately reflect changes in the UI before receiving server confirmation, providing instant feedback to users. This improves perceived performance and creates a smoother user experience.

## Basic Pattern

### 1. Define Optimistic Response

When executing a mutation, provide an optimistic response that matches the expected server response:

```typescript
import { graphql } from '$houdini';

const createConcept = graphql(`
  mutation CreateConcept($input: ConceptInput!) {
    createConcept(input: $input) {
      id
      path
      depth
      parentId
      createdAt
      updatedAt
    }
  }
`);

// Execute with optimistic response
await createConcept.mutate(
  { input: conceptData },
  {
    optimisticResponse: {
      createConcept: {
        id: 'temp-id-' + Date.now(), // Temporary ID
        ...conceptData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }
);
```

### 2. Update Cache

Use Houdini's cache update functionality to reflect changes:

```typescript
await createConcept.mutate(
  { input: conceptData },
  {
    optimisticResponse: {
      createConcept: {
        id: 'temp-' + Date.now(),
        ...conceptData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    // Update queries that list concepts
    update: (cache, { data }) => {
      if (data?.createConcept) {
        // Houdini automatically updates the cache
        // based on the mutation result
      }
    }
  }
);
```

## Complete Example: Concept Creation

```svelte
<script lang="ts">
  import { graphql } from '$houdini';
  import { notificationStore } from '$lib/stores/notification.store';
  import { errorHandler } from '$lib/services/errorHandler';
  import Input from '$lib/components/ui/Input.svelte';
  import Spinner from '$lib/components/ui/Spinner.svelte';

  const createConcept = graphql(`
    mutation CreateConceptOptimistic($input: ConceptInput!) {
      createConcept(input: $input) {
        id
        path
        depth
        parentId
        createdAt
        updatedAt
      }
    }
  `);

  let isSubmitting = $state(false);
  let formData = $state({
    path: '',
    depth: 0,
    parentId: null
  });

  async function handleCreate() {
    isSubmitting = true;

    try {
      const result = await createConcept.mutate(
        { input: formData },
        {
          optimisticResponse: {
            createConcept: {
              id: 'temp-' + Date.now(),
              ...formData,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              __typename: 'Concept'
            }
          }
        }
      );

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      notificationStore.success('Concept created successfully');

      // Reset form
      formData = { path: '', depth: 0, parentId: null };
    } catch (error) {
      errorHandler.handle(error);
      // Optimistic update will be rolled back automatically
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form onsubmit={(e) => { e.preventDefault(); handleCreate(); }}>
  <Input
    id="path"
    label="Path"
    bind:value={formData.path}
    required
  />

  <button type="submit" disabled={isSubmitting}>
    {#if isSubmitting}
      <Spinner size="sm" variant="white" />
    {/if}
    Create Concept
  </button>
</form>
```

## Update Operations

For update mutations:

```typescript
const updateConcept = graphql(`
  mutation UpdateConceptOptimistic($id: ID!, $input: ConceptInput!) {
    updateConcept(id: $id, input: $input) {
      id
      path
      depth
      parentId
      updatedAt
    }
  }
`);

await updateConcept.mutate(
  { id: conceptId, input: updatedData },
  {
    optimisticResponse: {
      updateConcept: {
        id: conceptId,
        ...updatedData,
        updatedAt: new Date().toISOString(),
        __typename: 'Concept'
      }
    }
  }
);
```

## Delete Operations

For delete mutations:

```typescript
const deleteConcept = graphql(`
  mutation DeleteConceptOptimistic($id: ID!) {
    deleteConcept(id: $id) {
      success
      id
    }
  }
`);

await deleteConcept.mutate(
  { id: conceptId },
  {
    optimisticResponse: {
      deleteConcept: {
        success: true,
        id: conceptId,
        __typename: 'DeleteConceptResult'
      }
    },
    // Manually remove from cache if needed
    update: (cache) => {
      cache.evict({ id: `Concept:${conceptId}` });
    }
  }
);
```

## Error Handling

Houdini automatically rolls back optimistic updates when mutations fail:

```typescript
async function handleMutation() {
  try {
    const result = await mutation.mutate(
      variables,
      { optimisticResponse }
    );

    if (result.errors) {
      // Optimistic update is rolled back
      throw new Error(result.errors[0].message);
    }

    // Success - optimistic update becomes real
    notificationStore.success('Action completed');
  } catch (error) {
    // Error handling - optimistic update already rolled back
    errorHandler.handle(error);
    notificationStore.error('Action failed - changes reverted');
  }
}
```

## Loading States

Show loading indicators for better UX:

```svelte
<script>
  let isOptimistic = $state(false);
</script>

{#if isOptimistic}
  <div class="opacity-50 pointer-events-none">
    <!-- Content with optimistic update -->
    <Spinner size="sm" class="absolute top-2 right-2" />
  </div>
{:else}
  <!-- Normal content -->
{/if}
```

## Best Practices

### 1. Use Temporary IDs

Generate unique temporary IDs for new entities:

```typescript
const tempId = 'temp-' + Date.now() + '-' + Math.random();
```

### 2. Match Server Response Shape

Ensure optimistic response matches the exact shape of the server response:

```typescript
optimisticResponse: {
  createConcept: {
    id: tempId,
    ...input,
    // Include all fields that the query returns
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __typename: 'Concept' // Important for cache normalization
  }
}
```

### 3. Handle Validation Errors

Show validation errors without rolling back optimistic updates:

```typescript
try {
  const result = await mutation.mutate(variables, { optimisticResponse });

  if (result.errors) {
    // Check if validation error
    const validationError = result.errors.find(
      e => e.extensions?.code === 'VALIDATION_ERROR'
    );

    if (validationError) {
      // Show validation errors but keep optimistic update
      showValidationErrors(validationError.extensions?.fields);
      return;
    }

    // Other errors - will roll back
    throw new Error(result.errors[0].message);
  }
} catch (error) {
  errorHandler.handle(error);
}
```

### 4. Network Indicators

Show network status:

```svelte
<script>
  import { onlineStore } from '$lib/stores/online.store';

  const isOnline = $derived(onlineStore.isOnline);
</script>

{#if !isOnline}
  <div class="bg-yellow-50 p-2 text-sm text-yellow-800">
    You're offline. Changes will be synced when connection is restored.
  </div>
{/if}
```

### 5. Conflict Resolution

Handle conflicts when optimistic update differs from server response:

```typescript
await mutation.mutate(
  variables,
  {
    optimisticResponse,
    update: (cache, { data }) => {
      if (data?.updateConcept) {
        // Server response takes precedence
        // Houdini automatically updates with real data

        // Optional: Show notification if server data differs
        if (data.updateConcept.path !== optimisticResponse.updateConcept.path) {
          notificationStore.info('Your changes were adjusted by the server');
        }
      }
    }
  }
);
```

## Testing

Test optimistic updates:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';

describe('Optimistic Updates', () => {
  it('shows optimistic update immediately', async () => {
    const { getByText, getByRole } = render(ConceptForm);

    const button = getByRole('button', { name: /create/i });
    await fireEvent.click(button);

    // Check that item appears immediately (optimistic)
    expect(getByText('New Concept')).toBeInTheDocument();
  });

  it('rolls back on error', async () => {
    // Mock mutation to fail
    vi.mocked(createConcept.mutate).mockRejectedValue(
      new Error('Network error')
    );

    const { getByText, queryByText, getByRole } = render(ConceptForm);

    const button = getByRole('button', { name: /create/i });
    await fireEvent.click(button);

    // Optimistic update appears
    expect(getByText('New Concept')).toBeInTheDocument();

    // Wait for error
    await vi.waitFor(() => {
      // Optimistic update is rolled back
      expect(queryByText('New Concept')).not.toBeInTheDocument();
    });
  });
});
```

## Performance Considerations

### 1. Debounce Rapid Updates

For fields that update frequently:

```typescript
import { debounce } from '$lib/utils/debounce';

const debouncedUpdate = debounce(async (value) => {
  await updateConcept.mutate(
    { id, input: { path: value } },
    { optimisticResponse: { updateConcept: { id, path: value } } }
  );
}, 500);
```

### 2. Batch Related Updates

Group related mutations:

```typescript
async function updateMultiple(items) {
  const promises = items.map(item =>
    updateItem.mutate(
      { id: item.id, input: item.data },
      { optimisticResponse: { updateItem: item.optimisticData } }
    )
  );

  await Promise.all(promises);
}
```

### 3. Cache Normalization

Ensure proper cache normalization with `__typename`:

```typescript
optimisticResponse: {
  createConcept: {
    __typename: 'Concept', // Required for proper cache updates
    id: tempId,
    ...data
  }
}
```

## Common Pitfalls

### ❌ Missing `__typename`

```typescript
// Wrong - cache won't update correctly
optimisticResponse: {
  createConcept: {
    id: tempId,
    path: 'new.path'
  }
}

// Correct
optimisticResponse: {
  createConcept: {
    __typename: 'Concept',
    id: tempId,
    path: 'new.path'
  }
}
```

### ❌ Incomplete Response Shape

```typescript
// Wrong - missing fields cause issues
optimisticResponse: {
  createConcept: {
    __typename: 'Concept',
    id: tempId,
    path: 'new.path'
    // Missing: depth, parentId, createdAt, updatedAt
  }
}

// Correct - match full query response
optimisticResponse: {
  createConcept: {
    __typename: 'Concept',
    id: tempId,
    path: 'new.path',
    depth: 0,
    parentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}
```

### ❌ Not Handling Errors

```typescript
// Wrong - errors not caught
await mutation.mutate(variables, { optimisticResponse });

// Correct
try {
  const result = await mutation.mutate(variables, { optimisticResponse });
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
} catch (error) {
  errorHandler.handle(error);
}
```

## See Also

- [Houdini Documentation](https://houdinigraphql.com/guides/mutations#optimistic-responses)
- [Form Validation](./UX_COMPONENTS.md#validation)
- [Error Handling](./ERROR_HANDLING.md)
