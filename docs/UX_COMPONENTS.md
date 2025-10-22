# UX Components Documentation

Comprehensive guide for UX improvement components implemented in Priority 2.

## Table of Contents

- [Form Components](#form-components)
- [Validation](#validation)
- [Loading States](#loading-states)
- [Modal & Dialogs](#modal--dialogs)
- [Data Management](#data-management)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Quick Wins Components](#quick-wins-components)
- [Utility Functions](#utility-functions)

---

## Form Components

### Input Component

Reusable input field with validation support and error display.

**Location:** `src/lib/components/ui/Input.svelte`

**Props:**
- `id` (string, required): Unique identifier for the input
- `label` (string, required): Label text
- `type` (string, optional): Input type (text, email, password, number, etc.)
- `value` (bindable): Current value
- `onchange` (function, optional): Callback when value changes
- `onblur` (function, optional): Callback when input loses focus
- `errors` (string[], optional): Array of error messages
- `required` (boolean, optional): Whether field is required
- `disabled` (boolean, optional): Whether field is disabled
- `placeholder` (string, optional): Placeholder text
- `min`, `max`, `step` (number, optional): For number inputs

**Example:**
```svelte
<Input
  id="email"
  label="Email Address"
  type="email"
  bind:value={form.data.email}
  onchange={(value) => form.setField('email', value)}
  onblur={() => form.touchField('email')}
  errors={form.errors.email}
  required
/>
```

### Select Component

Dropdown select with validation support.

**Location:** `src/lib/components/ui/Select.svelte`

**Props:**
- `id` (string, required): Unique identifier
- `label` (string, required): Label text
- `value` (bindable): Selected value
- `options` (Option[], required): Array of `{value, label}` objects
- `onchange`, `onblur`, `errors`, `required`, `disabled`, `placeholder`

**Example:**
```svelte
<Select
  id="language"
  label="Language"
  bind:value={form.data.languageId}
  options={languages.map(l => ({ value: l.id, label: l.name }))}
  onchange={(value) => form.setField('languageId', value)}
  errors={form.errors.languageId}
  required
/>
```

### Checkbox Component

Checkbox with label and description support.

**Location:** `src/lib/components/ui/Checkbox.svelte`

**Props:**
- `id`, `label`, `checked` (bindable), `onchange`, `errors`, `disabled`
- `description` (string, optional): Additional help text

**Example:**
```svelte
<Checkbox
  id="isPublic"
  label="Make this public"
  bind:checked={form.data.isPublic}
  description="Public items can be viewed by anyone"
/>
```

### Textarea Component

Multi-line text input with character count.

**Location:** `src/lib/components/ui/Textarea.svelte`

**Props:**
- Similar to Input, plus:
- `rows` (number, optional): Number of visible rows
- `maxlength` (number, optional): Maximum character count

---

## Validation

### Form Validation Utilities

**Location:** `src/lib/utils/form.ts`

#### `createFormStore(schema, initialData)`

Creates a reactive form store with Zod validation.

**Returns:**
- `data`: Current form data (reactive)
- `errors`: Validation errors (reactive)
- `touched`: Set of touched fields
- `isSubmitting`: Whether form is submitting
- `isValid`: Whether form is valid
- `setField(field, value)`: Update a field with validation
- `touchField(field)`: Mark field as touched
- `validate()`: Validate entire form
- `handleSubmit(onSubmit)`: Handle form submission
- `reset(newData)`: Reset form state

**Example:**
```typescript
import { conceptSchema } from '$lib/schemas/concept.schema';
import { createFormStore } from '$lib/utils/form';

const form = createFormStore(conceptSchema, {
  path: '',
  depth: 0,
  parentId: null
});

async function handleSubmit(e: Event) {
  e.preventDefault();
  const success = await form.handleSubmit(async (data) => {
    // Submit data to API
    await createConcept(data);
  });
  if (success) {
    form.reset();
  }
}
```

### Validation Schemas

**Locations:**
- `src/lib/schemas/concept.schema.ts`
- `src/lib/schemas/language.schema.ts`
- `src/lib/schemas/dictionary.schema.ts`

**Example Schema:**
```typescript
import { z } from 'zod';

export const conceptSchema = z.object({
  path: z
    .string()
    .min(1, 'Path is required')
    .max(255, 'Path must be less than 255 characters')
    .regex(/^[a-zA-Z0-9._\-/]+$/, 'Invalid path format'),
  depth: z
    .number()
    .int()
    .min(0, 'Depth cannot be negative')
    .max(10, 'Depth cannot exceed 10 levels'),
  parentId: z.number().int().positive().nullable().optional()
});
```

---

## Loading States

### Skeleton Components

Display placeholder content while data is loading.

#### Skeleton

**Location:** `src/lib/components/ui/Skeleton.svelte`

**Props:**
- `variant`: 'text' | 'circular' | 'rectangular'
- `width`, `height`: Size of skeleton

**Example:**
```svelte
<Skeleton variant="text" width="80%" />
<Skeleton variant="circular" width="48px" height="48px" />
<Skeleton variant="rectangular" height="200px" />
```

#### TableSkeleton

**Location:** `src/lib/components/ui/TableSkeleton.svelte`

**Props:**
- `rows` (number, default: 5): Number of skeleton rows
- `columns` (number, default: 4): Number of columns

#### CardSkeleton

**Location:** `src/lib/components/ui/CardSkeleton.svelte`

**Props:**
- `count` (number, default: 3): Number of cards
- `showAvatar` (boolean, default: false): Show avatar placeholder

### Progress Indicators

#### ProgressBar

**Location:** `src/lib/components/ui/ProgressBar.svelte`

**Props:**
- `value` (number, required): Current progress value
- `max` (number, default: 100): Maximum value
- `label` (string, optional): Progress label
- `showPercentage` (boolean, default: true)
- `size`: 'sm' | 'md' | 'lg'
- `variant`: 'primary' | 'success' | 'warning' | 'danger'

**Example:**
```svelte
<ProgressBar
  value={uploadProgress}
  max={100}
  label="Uploading..."
  variant="primary"
/>
```

#### Spinner

**Location:** `src/lib/components/ui/Spinner.svelte`

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `variant`: 'primary' | 'white' | 'gray'
- `label` (string, default: 'Loading...')

**Example:**
```svelte
{#if isLoading}
  <Spinner size="lg" label="Loading concepts..." />
{/if}
```

---

## Modal & Dialogs

### Modal Component

**Location:** `src/lib/components/ui/Modal.svelte`

Reusable modal dialog with customizable content and footer.

**Props:**
- `isOpen` (bindable): Whether modal is open
- `onClose` (function): Callback when modal closes
- `title` (string): Modal title
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `closeOnEscape` (boolean, default: true)
- `closeOnClickOutside` (boolean, default: true)
- `children`, `footer`: Snippet slots

**Example:**
```svelte
<Modal {isOpen} onClose={() => isOpen = false} title="Add Item">
  {#snippet children()}
    <form><!-- Form content --></form>
  {/snippet}
  {#snippet footer()}
    <button type="submit">Save</button>
    <button type="button" onclick={onClose}>Cancel</button>
  {/snippet}
</Modal>
```

### ConfirmDialog Component

**Location:** `src/lib/components/ui/ConfirmDialog.svelte`

Confirmation dialog for destructive actions.

**Props:**
- `isOpen`, `onClose`: Same as Modal
- `onConfirm` (function): Callback when confirmed
- `title`, `message` (string): Dialog content
- `confirmText`, `cancelText` (string, optional)
- `variant`: 'danger' | 'warning' | 'info'
- `isLoading` (boolean, optional)

**Example:**
```svelte
<ConfirmDialog
  {isOpen}
  onClose={() => isOpen = false}
  onConfirm={handleDelete}
  title="Delete Concept"
  message="Are you sure you want to delete this concept? This action cannot be undone."
  confirmText="Delete"
  variant="danger"
  {isLoading}
/>
```

---

## Data Management

### SearchBar Component

**Location:** `src/lib/components/ui/SearchBar.svelte`

Search input with clear button.

**Props:**
- `value` (bindable): Search query
- `onchange` (function): Callback on search
- `placeholder` (string, optional)

**Example:**
```svelte
<SearchBar
  bind:value={searchQuery}
  onchange={(query) => filterResults(query)}
  placeholder="Search concepts..."
/>
```

### Pagination Component

**Location:** `src/lib/components/ui/Pagination.svelte`

Pagination controls with page numbers.

**Props:**
- `currentPage` (bindable): Current page number
- `totalPages` (number): Total number of pages
- `onPageChange` (function): Callback on page change
- `siblingCount` (number, default: 1): Number of page buttons on each side

**Example:**
```svelte
<Pagination
  bind:currentPage
  {totalPages}
  onPageChange={(page) => loadPage(page)}
/>
```

### Sortable Table

#### SortableTableHeader Component

**Location:** `src/lib/components/ui/SortableTableHeader.svelte`

Clickable table header with sort indicators.

**Props:**
- `field` (string): Field name to sort by
- `label` (string): Display label
- `currentField` (string | null): Currently sorted field
- `currentDirection`: 'asc' | 'desc' | null
- `onSort` (function): Sort callback

#### Sort Utilities

**Location:** `src/lib/utils/sort.ts`

**Functions:**
- `createSortState(initialField)`: Create reactive sort state
- `sortBy(array, field, direction)`: Sort array by field
- `toggleSortDirection(current)`: Toggle between asc/desc/null

**Example:**
```svelte
<script>
  import { createSortState, sortBy } from '$lib/utils/sort';
  import SortableTableHeader from '$lib/components/ui/SortableTableHeader.svelte';

  const sortState = createSortState();

  const sortedData = $derived(
    sortBy(data, sortState.field, sortState.direction)
  );
</script>

<table>
  <thead>
    <tr>
      <SortableTableHeader
        field="name"
        label="Name"
        currentField={sortState.field}
        currentDirection={sortState.direction}
        onSort={(field) => sortState.toggleSort(field)}
      />
    </tr>
  </thead>
  <tbody>
    {#each sortedData as item}
      <tr><!-- ... --></tr>
    {/each}
  </tbody>
</table>
```

---

## Keyboard Shortcuts

### Keyboard Utilities

**Location:** `src/lib/utils/keyboard.ts`

#### `registerShortcuts(shortcuts)`

Register keyboard shortcuts globally.

**Returns:** Cleanup function

**Example:**
```typescript
import { registerShortcuts } from '$lib/utils/keyboard';

const cleanup = registerShortcuts([
  {
    key: 'n',
    ctrl: true,
    handler: () => openNewItemDialog(),
    description: 'Create new item'
  },
  {
    key: 's',
    ctrl: true,
    handler: (e) => {
      e.preventDefault();
      saveForm();
    },
    description: 'Save form'
  },
  {
    key: '?',
    shift: true,
    handler: () => showKeyboardHelp(),
    description: 'Show keyboard shortcuts'
  }
]);

// Later: cleanup();
```

#### `useKeyboardShortcuts(shortcuts)`

Svelte hook to register shortcuts on mount.

**Example:**
```svelte
<script>
  import { useKeyboardShortcuts } from '$lib/utils/keyboard';

  useKeyboardShortcuts([
    { key: 'n', ctrl: true, handler: openDialog, description: 'New' },
    { key: 'Escape', handler: closeDialog, description: 'Close' }
  ]);
</script>
```

#### `formatShortcut(shortcut)`

Format shortcut for display (e.g., "Ctrl+N").

### KeyboardShortcutsHelp Component

**Location:** `src/lib/components/ui/KeyboardShortcutsHelp.svelte`

Modal displaying available keyboard shortcuts.

**Props:**
- `isOpen`, `onClose`: Modal props
- `shortcuts` (KeyboardShortcut[]): List of shortcuts to display
- `title` (string, optional)

**Example:**
```svelte
<KeyboardShortcutsHelp
  {isOpen}
  onClose={() => isOpen = false}
  {shortcuts}
  title="Available Shortcuts"
/>
```

---

## Best Practices

### Form Validation

1. **Always use schemas**: Define Zod schemas for all forms
2. **Real-time feedback**: Validate on blur and on change
3. **Clear error messages**: Use descriptive, user-friendly error messages
4. **Disable submit when invalid**: Prevent submission of invalid forms

### Loading States

1. **Show skeletons during initial load**: Better than spinners for content
2. **Use spinners for actions**: Button clicks, form submissions
3. **Progress bars for uploads**: When progress is measurable
4. **Maintain layout**: Skeletons should match final content dimensions

### Accessibility

1. **ARIA labels**: All interactive elements should have labels
2. **Keyboard navigation**: Ensure all actions are keyboard accessible
3. **Focus management**: Trap focus in modals, return focus on close
4. **Screen reader support**: Use semantic HTML and ARIA attributes

### Keyboard Shortcuts

1. **Standard conventions**: Use common shortcuts (Ctrl+S for save, etc.)
2. **Don't override browser shortcuts**: Avoid conflicts
3. **Provide help**: Always show ? shortcut for help
4. **Context-aware**: Different shortcuts for different views

---

## Migration Guide

### Updating Existing Forms

1. Create a Zod schema for your form
2. Replace manual state management with `createFormStore`
3. Replace native inputs with UI components
4. Add validation error display
5. Update submit handler to use `form.handleSubmit`

**Before:**
```svelte
<script>
  let formData = $state({ name: '', email: '' });

  function handleSubmit() {
    // Manual validation
    if (!formData.name) {
      alert('Name is required');
      return;
    }
    onSubmit(formData);
  }
</script>

<form onsubmit={handleSubmit}>
  <input bind:value={formData.name} />
  <button type="submit">Submit</button>
</form>
```

**After:**
```svelte
<script>
  import { z } from 'zod';
  import { createFormStore } from '$lib/utils/form';
  import Input from '$lib/components/ui/Input.svelte';

  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email')
  });

  const form = createFormStore(schema, { name: '', email: '' });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    await form.handleSubmit(onSubmit);
  }
</script>

<form onsubmit={handleSubmit}>
  <Input
    id="name"
    label="Name"
    bind:value={form.data.name}
    onchange={(v) => form.setField('name', v)}
    onblur={() => form.touchField('name')}
    errors={form.errors.name}
    required
  />
  <button type="submit" disabled={!form.isValid}>
    Submit
  </button>
</form>
```

---

## Quick Wins Components

### Badge Component

**Location:** `src/lib/components/ui/Badge.svelte`

Display status indicators, labels, and categories.

**Props:**
- `variant`: 'default' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `children`: Snippet for badge content

**Example:**
```svelte
<script>
  import { Badge } from '$lib/components/ui';
</script>

<Badge variant="success">Active</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
<Badge variant="danger">Error</Badge>
<Badge variant="info">New</Badge>
```

---

### CopyButton Component

**Location:** `src/lib/components/ui/CopyButton.svelte`

Button for copying text to clipboard with visual feedback.

**Props:**
- `text` (string, required): Text to copy
- `label` (string, optional): Button label
- `successMessage` (string, optional): Success notification message
- `showIcon` (boolean, default: true): Show copy icon

**Example:**
```svelte
<script>
  import { CopyButton } from '$lib/components/ui';
</script>

<CopyButton text="Copy this text" />
<CopyButton
  text={apiKey}
  label="Copy API Key"
  successMessage="API Key copied!"
/>
```

**Features:**
- Automatic clipboard fallback for older browsers
- Visual feedback (checkmark icon)
- Toast notification on success
- SSR-safe

---

### EmptyState Component

**Location:** `src/lib/components/ui/EmptyState.svelte`

Display message when no data is available, with optional action button.

**Props:**
- `title` (string, required): Main message
- `description` (string, optional): Additional description
- `icon` (Snippet, optional): Custom icon
- `action` (object, optional): Action button `{label, onClick}`

**Example:**
```svelte
<script>
  import { EmptyState } from '$lib/components/ui';

  function createFirst() {
    // Handle create action
  }
</script>

<EmptyState
  title="No concepts found"
  description="Get started by creating your first concept"
  action={{
    label: 'Create Concept',
    onClick: createFirst
  }}
/>

<!-- With custom icon -->
<EmptyState title="No results">
  {#snippet icon()}
    <svg><!-- Custom SVG --></svg>
  {/snippet}
</EmptyState>
```

---

## Utility Functions

### Debounce

**Location:** `src/lib/utils/debounce.ts`

Delay function execution until after a wait period.

**Functions:**
- `debounce(func, wait)` - Standard debounce
- `throttle(func, limit)` - Throttle execution
- `debounceAsync(func, wait)` - Debounce async functions

**Example:**
```typescript
import { debounce } from '$lib/utils/debounce';

const debouncedSearch = debounce((query) => {
  performSearch(query);
}, 300);

// Usage in SearchBar
<SearchBar
  bind:value={query}
  onchange={debouncedSearch}
  debounceMs={300}
/>
```

---

### Storage Utilities

**Location:** `src/lib/utils/storage.ts`

Type-safe localStorage and sessionStorage with expiration support.

**API:**
```typescript
import { storage, sessionStorage, createNamespacedStorage } from '$lib/utils/storage';

// Get with default value
const theme = storage.get('theme', 'light');

// Set with expiration (1 hour)
storage.set('temp-data', data, {
  expiresIn: 60 * 60 * 1000
});

// Set with version (for cache invalidation)
storage.set('config', config, {
  version: '1.0.0'
});

// Check existence
if (storage.has('user-prefs')) {
  // ...
}

// Remove
storage.remove('old-key');

// Clear all
storage.clear();

// Namespaced storage
const userStorage = createNamespacedStorage('user');
userStorage.set('preferences', prefs);
userStorage.get('preferences', {});
```

**Features:**
- SSR-safe
- Auto-cleanup of expired items
- Quota exceeded handling
- Version support for cache invalidation
- Namespacing for organization

---

### Date Formatting

**Location:** `src/lib/utils/date.ts`

Comprehensive date formatting and manipulation utilities.

**Functions:**

```typescript
import {
  formatDate,
  formatRelativeTime,
  formatDuration,
  formatDateRange,
  isToday,
  isYesterday,
  addDays,
  addMonths
} from '$lib/utils/date';

// Format dates
formatDate(new Date(), 'short');      // "01/21/25"
formatDate(new Date(), 'medium');     // "Jan 21, 2025"
formatDate(new Date(), 'long');       // "January 21, 2025, 02:30 PM"
formatDate(new Date(), 'relative');   // "2 hours ago"
formatDate(new Date(), 'time');       // "02:30 PM"

// Relative time
formatRelativeTime(someDate);         // "2h ago", "3d ago", "just now"

// Duration
formatDuration(3665000);              // "1h 1m 5s"

// Date range
formatDateRange(start, end);          // "Jan 21-25, 2025"

// Date checks
if (isToday(date)) { /* ... */ }
if (isYesterday(date)) { /* ... */ }

// Date manipulation
const tomorrow = addDays(new Date(), 1);
const nextMonth = addMonths(new Date(), 1);
```

---

### Clipboard Utilities

**Location:** `src/lib/utils/clipboard.ts`

Copy text to clipboard with fallback support.

**API:**
```typescript
import { copyToClipboard, isClipboardSupported } from '$lib/utils/clipboard';

// Copy text
const success = await copyToClipboard('Text to copy');

if (success) {
  notificationStore.success('Copied!');
}

// Check support
if (isClipboardSupported()) {
  // Show copy button
}
```

**Features:**
- Modern clipboard API
- Fallback for older browsers
- SSR-safe
- Promise-based

---

## Testing

All components include comprehensive test coverage. See `TESTING.md` for details.

Run tests:
```bash
npm run test:unit
```

---

## Best Practices Summary

### Component Usage
1. **Always use schema validation** for forms
2. **Show loading states** during data fetching
3. **Provide empty states** when no data
4. **Add confirmation dialogs** for destructive actions
5. **Use debounce** for search and expensive operations

### Accessibility
1. **ARIA labels** on all interactive elements
2. **Keyboard navigation** support
3. **Focus management** in modals
4. **Screen reader** friendly markup

### Performance
1. **Debounce** search inputs
2. **Lazy load** routes and heavy components
3. **Memoize** expensive computations
4. **Virtualize** long lists

---

## Future Enhancements

- [ ] Form field arrays (dynamic lists)
- [ ] File upload with drag & drop
- [ ] Rich text editor integration
- [ ] Multi-step form wizard
- [ ] Advanced filtering with facets
- [ ] Virtualized tables for large datasets
- [ ] Customizable keyboard shortcut bindings
- [ ] Avatar component
- [ ] Tooltip component
- [ ] Breadcrumbs navigation
