/**
 * Copy text to clipboard
 * @param text Text to copy
 * @returns Promise<boolean> Success status
 */
export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		if (typeof navigator === 'undefined' || !navigator.clipboard) {
			// Fallback for older browsers or SSR
			return fallbackCopyToClipboard(text);
		}

		await navigator.clipboard.writeText(text);
		return true;
	} catch (err) {
		console.error('Failed to copy to clipboard:', err);
		return fallbackCopyToClipboard(text);
	}
}

/**
 * Fallback method for copying text when clipboard API is not available
 */
function fallbackCopyToClipboard(text: string): boolean {
	if (typeof document === 'undefined') return false;

	try {
		const textArea = document.createElement('textarea');
		textArea.value = text;
		textArea.style.position = 'fixed';
		textArea.style.left = '-999999px';
		textArea.style.top = '-999999px';
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		const successful = document.execCommand('copy');
		document.body.removeChild(textArea);

		return successful;
	} catch (err) {
		console.error('Fallback copy failed:', err);
		return false;
	}
}

/**
 * Check if clipboard API is supported
 */
export function isClipboardSupported(): boolean {
	return typeof navigator !== 'undefined' && !!navigator.clipboard;
}
