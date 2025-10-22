import { onMount } from 'svelte';

export interface KeyboardShortcut {
	key: string;
	ctrl?: boolean;
	shift?: boolean;
	alt?: boolean;
	meta?: boolean;
	handler: (event: KeyboardEvent) => void;
	description?: string;
}

/**
 * Check if a keyboard event matches a shortcut definition
 */
function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
	const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
	const ctrlMatches = !!shortcut.ctrl === (event.ctrlKey || event.metaKey);
	const shiftMatches = !!shortcut.shift === event.shiftKey;
	const altMatches = !!shortcut.alt === event.altKey;

	return keyMatches && ctrlMatches && shiftMatches && altMatches;
}

/**
 * Register keyboard shortcuts
 * Returns a cleanup function to unregister the shortcuts
 */
export function registerShortcuts(shortcuts: KeyboardShortcut[]): () => void {
	const handleKeyDown = (event: KeyboardEvent) => {
		// Don't trigger shortcuts when typing in inputs
		const target = event.target as HTMLElement;
		if (
			target.tagName === 'INPUT' ||
			target.tagName === 'TEXTAREA' ||
			target.isContentEditable
		) {
			return;
		}

		for (const shortcut of shortcuts) {
			if (matchesShortcut(event, shortcut)) {
				event.preventDefault();
				shortcut.handler(event);
				break;
			}
		}
	};

	document.addEventListener('keydown', handleKeyDown);

	return () => {
		document.removeEventListener('keydown', handleKeyDown);
	};
}

/**
 * Svelte action to register keyboard shortcuts on mount
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
	let cleanup: (() => void) | null = null;

	onMount(() => {
		cleanup = registerShortcuts(shortcuts);

		return () => {
			cleanup?.();
		};
	});
}

/**
 * Format shortcut for display
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
	const parts: string[] = [];

	if (shortcut.ctrl) parts.push('Ctrl');
	if (shortcut.shift) parts.push('Shift');
	if (shortcut.alt) parts.push('Alt');
	if (shortcut.meta) parts.push('⌘');

	parts.push(shortcut.key.toUpperCase());

	return parts.join('+');
}
