/**
 * Debounce function that delays execution until after a specified wait time
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	return function executedFunction(...args: Parameters<T>) {
		const later = () => {
			timeout = null;
			func(...args);
		};

		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

/**
 * Throttle function that limits execution to once per specified time period
 * @param func Function to throttle
 * @param limit Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle: boolean = false;

	return function executedFunction(...args: Parameters<T>) {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
}

/**
 * Create a debounced version of an async function
 * @param func Async function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced async function
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
	func: T,
	wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
	let timeout: ReturnType<typeof setTimeout> | null = null;
	let resolveList: Array<(value: any) => void> = [];
	let rejectList: Array<(reason: any) => void> = [];

	return function executedFunction(...args: Parameters<T>): Promise<ReturnType<T>> {
		return new Promise((resolve, reject) => {
			resolveList.push(resolve);
			rejectList.push(reject);

			if (timeout) clearTimeout(timeout);

			timeout = setTimeout(async () => {
				const currentResolveList = [...resolveList];
				const currentRejectList = [...rejectList];
				resolveList = [];
				rejectList = [];
				timeout = null;

				try {
					const result = await func(...args);
					currentResolveList.forEach(res => res(result));
				} catch (error) {
					currentRejectList.forEach(rej => rej(error));
				}
			}, wait);
		});
	};
}
