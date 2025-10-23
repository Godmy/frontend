/**
 * Online/Offline Store
 *
 * Tracks network connectivity status using the browser's online/offline events.
 * Updates reactive state when connection changes.
 */

let isOnline = $state(typeof navigator !== 'undefined' ? navigator.onLine : true);

// Setup event listeners for online/offline events
if (typeof window !== 'undefined') {
	window.addEventListener('online', () => {
		isOnline = true;
	});

	window.addEventListener('offline', () => {
		isOnline = false;
	});
}

export const onlineStore = {
	get isOnline() {
		return isOnline;
	}
};
