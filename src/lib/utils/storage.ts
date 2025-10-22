/**
 * Type-safe localStorage utilities with error handling and SSR support
 */

/**
 * Storage interface for type safety
 */
interface StorageValue<T> {
	value: T;
	timestamp: number;
	version?: string;
}

/**
 * Storage options
 */
interface StorageOptions {
	/** Expiration time in milliseconds */
	expiresIn?: number;
	/** Version for cache invalidation */
	version?: string;
}

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Local storage utilities
 */
export const storage = {
	/**
	 * Get item from localStorage
	 * @param key Storage key
	 * @param defaultValue Default value if not found or expired
	 * @returns The stored value or default value
	 */
	get<T>(key: string, defaultValue: T): T {
		if (!isBrowser) return defaultValue;

		try {
			const item = window.localStorage.getItem(key);
			if (!item) return defaultValue;

			const parsed: StorageValue<T> = JSON.parse(item);

			// Check expiration
			if (parsed.timestamp) {
				const now = Date.now();
				// If item has expired, remove it and return default
				if (parsed.timestamp < now) {
					this.remove(key);
					return defaultValue;
				}
			}

			return parsed.value;
		} catch (error) {
			console.error('Failed to get from localStorage:', error);
			return defaultValue;
		}
	},

	/**
	 * Set item in localStorage
	 * @param key Storage key
	 * @param value Value to store
	 * @param options Storage options (expiration, version)
	 */
	set<T>(key: string, value: T, options?: StorageOptions): void {
		if (!isBrowser) return;

		try {
			const storageValue: StorageValue<T> = {
				value,
				timestamp: options?.expiresIn ? Date.now() + options.expiresIn : Infinity,
				version: options?.version
			};

			window.localStorage.setItem(key, JSON.stringify(storageValue));
		} catch (error) {
			console.error('Failed to save to localStorage:', error);

			// Handle quota exceeded errors
			if (error instanceof DOMException && error.name === 'QuotaExceededError') {
				console.warn('localStorage quota exceeded, attempting to clear old items');
				this.clearExpired();

				// Try again after clearing
				try {
					const storageValue: StorageValue<T> = {
						value,
						timestamp: options?.expiresIn ? Date.now() + options.expiresIn : Infinity,
						version: options?.version
					};
					window.localStorage.setItem(key, JSON.stringify(storageValue));
				} catch (retryError) {
					console.error('Failed to save after clearing expired items:', retryError);
				}
			}
		}
	},

	/**
	 * Remove item from localStorage
	 * @param key Storage key
	 */
	remove(key: string): void {
		if (!isBrowser) return;
		try {
			window.localStorage.removeItem(key);
		} catch (error) {
			console.error('Failed to remove from localStorage:', error);
		}
	},

	/**
	 * Clear all items from localStorage
	 */
	clear(): void {
		if (!isBrowser) return;
		try {
			window.localStorage.clear();
		} catch (error) {
			console.error('Failed to clear localStorage:', error);
		}
	},

	/**
	 * Check if key exists in localStorage
	 * @param key Storage key
	 * @returns true if key exists
	 */
	has(key: string): boolean {
		if (!isBrowser) return false;
		return window.localStorage.getItem(key) !== null;
	},

	/**
	 * Get all keys from localStorage
	 * @returns Array of all keys
	 */
	keys(): string[] {
		if (!isBrowser) return [];
		try {
			return Object.keys(window.localStorage);
		} catch (error) {
			console.error('Failed to get localStorage keys:', error);
			return [];
		}
	},

	/**
	 * Clear expired items from localStorage
	 */
	clearExpired(): void {
		if (!isBrowser) return;

		const keys = this.keys();
		const now = Date.now();

		keys.forEach(key => {
			try {
				const item = window.localStorage.getItem(key);
				if (!item) return;

				const parsed: StorageValue<any> = JSON.parse(item);
				if (parsed.timestamp && parsed.timestamp < now) {
					this.remove(key);
				}
			} catch (error) {
				// If parsing fails, item might be corrupted, skip it
			}
		});
	},

	/**
	 * Get storage size in bytes (approximate)
	 * @returns Storage size in bytes
	 */
	getSize(): number {
		if (!isBrowser) return 0;

		let total = 0;
		const keys = this.keys();

		keys.forEach(key => {
			const item = window.localStorage.getItem(key);
			if (item) {
				total += key.length + item.length;
			}
		});

		return total;
	}
};

/**
 * Session storage utilities (same interface as localStorage)
 */
export const sessionStorage = {
	get<T>(key: string, defaultValue: T): T {
		if (!isBrowser) return defaultValue;

		try {
			const item = window.sessionStorage.getItem(key);
			if (!item) return defaultValue;

			const parsed: StorageValue<T> = JSON.parse(item);
			return parsed.value;
		} catch (error) {
			console.error('Failed to get from sessionStorage:', error);
			return defaultValue;
		}
	},

	set<T>(key: string, value: T): void {
		if (!isBrowser) return;

		try {
			const storageValue: StorageValue<T> = {
				value,
				timestamp: Infinity
			};
			window.sessionStorage.setItem(key, JSON.stringify(storageValue));
		} catch (error) {
			console.error('Failed to save to sessionStorage:', error);
		}
	},

	remove(key: string): void {
		if (!isBrowser) return;
		try {
			window.sessionStorage.removeItem(key);
		} catch (error) {
			console.error('Failed to remove from sessionStorage:', error);
		}
	},

	clear(): void {
		if (!isBrowser) return;
		try {
			window.sessionStorage.clear();
		} catch (error) {
			console.error('Failed to clear sessionStorage:', error);
		}
	},

	has(key: string): boolean {
		if (!isBrowser) return false;
		return window.sessionStorage.getItem(key) !== null;
	}
};

/**
 * Create a namespaced storage instance
 * @param prefix Namespace prefix
 * @returns Namespaced storage utilities
 */
export function createNamespacedStorage(prefix: string) {
	return {
		get<T>(key: string, defaultValue: T): T {
			return storage.get(`${prefix}:${key}`, defaultValue);
		},

		set<T>(key: string, value: T, options?: StorageOptions): void {
			storage.set(`${prefix}:${key}`, value, options);
		},

		remove(key: string): void {
			storage.remove(`${prefix}:${key}`);
		},

		clear(): void {
			const keys = storage.keys();
			keys.forEach(key => {
				if (key.startsWith(`${prefix}:`)) {
					storage.remove(key);
				}
			});
		},

		has(key: string): boolean {
			return storage.has(`${prefix}:${key}`);
		}
	};
}
