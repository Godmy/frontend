# Parent-Child Communication Patterns

## Overview

This document outlines the patterns used for parent-child communication in the frontend application. Svelte provides several mechanisms for component communication, and this document details the approaches currently used and recommended for future development.

## Communication Patterns

### 1. Props (Parent to Child)

The most common form of communication is passing data from parent to child components using props.

**Implementation:**
```svelte
<!-- Parent Component -->
<script>
  import ChildComponent from './ChildComponent.svelte';
  
  let message = 'Hello from parent';
  let count = 0;
</script>

<ChildComponent {message} {count} />
```

```svelte
<!-- Child Component -->
<script>
  type Props = {
    message: string;
    count: number;
  };

  let { message, count }: Props = $props();
</script>

<p>{message}: {count}</p>
```

**Best Practices:**
- Always type props using TypeScript interfaces/types
- Use the `$props()` rune in Svelte 5 for reactivity
- Provide default values where appropriate

### 2. Bindings (Two-Way Communication)

For two-way data flow, Svelte provides binding mechanisms.

**Implementation:**
```svelte
<!-- Parent Component -->
<script>
  import ChildComponent from './ChildComponent.svelte';
  
  let value = 'Initial value';
</script>

<ChildComponent bind:value />
<p>Parent sees value: {value}</p>
```

```svelte
<!-- Child Component -->
<script>
  let { value = $bindable() }: { value?: string } = $props();
</script>

<input type="text" bind:value />
```

### 3. Events (Child to Parent)

Child components can emit events to communicate with parent components using `createEventDispatcher`.

**Implementation:**
```svelte
<!-- Child Component -->
<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher<{ updated: string }>();
  
  function handleClick() {
    dispatch('updated', 'value from child');
  }
</script>

<button on:click={handleClick}>Send to parent</button>
```

```svelte
<!-- Parent Component -->
<script>
  import ChildComponent from './ChildComponent.svelte';
  
  function handleUpdate(event: CustomEvent<string>) {
    console.log('Received from child:', event.detail);
  }
</script>

<ChildComponent on:updated={handleUpdate} />
```

### 4. Snippets (Slots) for Content Distribution

Svelte uses Snippets to allow parent components to pass content to child components.

**Implementation:**
```svelte
<!-- Child Component (Modal.svelte) -->
<script lang="ts">
  type Props = {
    title: string;
    children?: import('svelte').Snippet;
    footer?: import('svelte').Snippet;
  };
  
  let { title, children, footer }: Props = $props();
</script>

<div class="modal">
  <header>{title}</header>
  <main>
    {#if children}
      {@render children()}
    {/if}
  </main>
  <footer>
    {#if footer}
      {@render footer()}
    {/if}
  </footer>
</div>
```

```svelte
<!-- Parent Component -->
<script>
  import Modal from './Modal.svelte';
</script>

<Modal title="My Modal">
  {#snippet children()}
    <p>This content will be rendered in the modal body</p>
  {/snippet}
  {#snippet footer()}
    <button>Close</button>
  {/snippet}
</Modal>
```

### 5. Context API (Cross-Component Communication)

For communication between components that aren't direct parent-child, Svelte provides the Context API using `setContext` and `getContext`.

**Implementation:**
```svelte
<!-- Provider Component -->
<script>
  import { setContext } from 'svelte';
  
  const sharedValue = $state('shared');
  
  setContext('shared-value', $bindable(sharedValue));
</script>
```

```svelte
<!-- Consumer Component -->
<script>
  import { getContext } from 'svelte';
  
  const sharedValue = getContext<string>('shared-value');
</script>

<p>Shared value: {sharedValue}</p>
```

### 6. Stores for Global State

For global state management, the application uses Svelte's reactive stores with the `$state` rune.

**Implementation:**
```typescript
// store.ts
import { writable } from 'svelte/store';

const count = $state(0);

export const counterStore = {
  get count() {
    return count;
  },
  increment() {
    count++;
  }
};
```

```svelte
<!-- Component -->
<script>
  import { counterStore } from './store';
</script>

<p>Count: {counterStore.count}</p>
<button on:click={counterStore.increment}>Increment</button>
```

## Recommended Standardized Approach

### For New Components

1. **Props** - For passing data from parent to child
   - Always use TypeScript types
   - Use the `$props()` rune in Svelte 5

2. **Bindings** - For two-way communication
   - Use `$bindable()` for reactive bindings
   - Document which props support binding

3. **Events** - For child-to-parent communication
   - Use descriptive event names
   - Type event payloads with TypeScript

4. **Snippets** - For content distribution
   - Use named slots for complex content
   - Provide fallback content when appropriate

5. **Stores** - For global state
   - Use class-based approach with `$state` rune
   - Follow naming conventions (e.g., `storeName`)

## Future Enhancements

As the application evolves, consider implementing:

1. A more formalized component communication library
2. Type-safe event systems
3. Better documentation for complex component interactions
4. Standardized interfaces for common component patterns (e.g., form fields)