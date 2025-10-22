/**
 * Date formatting utilities
 */

export type DateFormat = 'short' | 'medium' | 'long' | 'relative' | 'time';

/**
 * Format date to localized string
 * @param date Date to format (Date object or ISO string)
 * @param format Format type
 * @param locale Locale string (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(
	date: string | Date,
	format: DateFormat = 'medium',
	locale: string = 'en-US'
): string {
	const d = typeof date === 'string' ? new Date(date) : date;

	if (isNaN(d.getTime())) {
		console.error('Invalid date:', date);
		return 'Invalid date';
	}

	if (format === 'relative') {
		return formatRelativeTime(d);
	}

	if (format === 'time') {
		return new Intl.DateTimeFormat(locale, {
			hour: '2-digit',
			minute: '2-digit'
		}).format(d);
	}

	const options: Intl.DateTimeFormatOptions =
		format === 'short'
			? { year: 'numeric', month: '2-digit', day: '2-digit' }
			: format === 'medium'
			? { year: 'numeric', month: 'short', day: 'numeric' }
			: {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			};

	return new Intl.DateTimeFormat(locale, options).format(d);
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 * @param date Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	const now = new Date();
	const diffMs = now.getTime() - d.getTime();
	const diffSec = Math.floor(diffMs / 1000);
	const diffMin = Math.floor(diffSec / 60);
	const diffHour = Math.floor(diffMin / 60);
	const diffDay = Math.floor(diffHour / 24);
	const diffWeek = Math.floor(diffDay / 7);
	const diffMonth = Math.floor(diffDay / 30);
	const diffYear = Math.floor(diffDay / 365);

	// Future dates
	if (diffSec < 0) {
		const absSec = Math.abs(diffSec);
		const absMin = Math.abs(diffMin);
		const absHour = Math.abs(diffHour);
		const absDay = Math.abs(diffDay);

		if (absSec < 60) return 'in a few seconds';
		if (absMin < 60) return `in ${absMin}m`;
		if (absHour < 24) return `in ${absHour}h`;
		if (absDay < 7) return `in ${absDay}d`;
		return formatDate(d, 'short');
	}

	// Past dates
	if (diffSec < 10) return 'just now';
	if (diffSec < 60) return `${diffSec}s ago`;
	if (diffMin < 60) return `${diffMin}m ago`;
	if (diffHour < 24) return `${diffHour}h ago`;
	if (diffDay < 7) return `${diffDay}d ago`;
	if (diffWeek < 4) return `${diffWeek}w ago`;
	if (diffMonth < 12) return `${diffMonth}mo ago`;
	if (diffYear < 2) return '1y ago';

	return formatDate(d, 'short');
}

/**
 * Format duration in milliseconds to human-readable string
 * @param ms Duration in milliseconds
 * @returns Formatted duration string
 */
export function formatDuration(ms: number): string {
	const seconds = Math.floor(ms / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) {
		const remainingHours = hours % 24;
		return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
	}

	if (hours > 0) {
		const remainingMinutes = minutes % 60;
		return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
	}

	if (minutes > 0) {
		const remainingSeconds = seconds % 60;
		return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
	}

	return `${seconds}s`;
}

/**
 * Check if date is today
 * @param date Date to check
 * @returns true if date is today
 */
export function isToday(date: Date | string): boolean {
	const d = typeof date === 'string' ? new Date(date) : date;
	const today = new Date();

	return (
		d.getDate() === today.getDate() &&
		d.getMonth() === today.getMonth() &&
		d.getFullYear() === today.getFullYear()
	);
}

/**
 * Check if date is yesterday
 * @param date Date to check
 * @returns true if date is yesterday
 */
export function isYesterday(date: Date | string): boolean {
	const d = typeof date === 'string' ? new Date(date) : date;
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);

	return (
		d.getDate() === yesterday.getDate() &&
		d.getMonth() === yesterday.getMonth() &&
		d.getFullYear() === yesterday.getFullYear()
	);
}

/**
 * Check if date is this week
 * @param date Date to check
 * @returns true if date is this week
 */
export function isThisWeek(date: Date | string): boolean {
	const d = typeof date === 'string' ? new Date(date) : date;
	const now = new Date();
	const weekStart = new Date(now);
	weekStart.setDate(now.getDate() - now.getDay());
	weekStart.setHours(0, 0, 0, 0);

	const weekEnd = new Date(weekStart);
	weekEnd.setDate(weekStart.getDate() + 7);

	return d >= weekStart && d < weekEnd;
}

/**
 * Get start of day
 * @param date Date
 * @returns Date at 00:00:00
 */
export function startOfDay(date: Date | string): Date {
	const d = typeof date === 'string' ? new Date(date) : new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

/**
 * Get end of day
 * @param date Date
 * @returns Date at 23:59:59
 */
export function endOfDay(date: Date | string): Date {
	const d = typeof date === 'string' ? new Date(date) : new Date(date);
	d.setHours(23, 59, 59, 999);
	return d;
}

/**
 * Add days to date
 * @param date Date
 * @param days Number of days to add (can be negative)
 * @returns New date
 */
export function addDays(date: Date | string, days: number): Date {
	const d = typeof date === 'string' ? new Date(date) : new Date(date);
	d.setDate(d.getDate() + days);
	return d;
}

/**
 * Add months to date
 * @param date Date
 * @param months Number of months to add (can be negative)
 * @returns New date
 */
export function addMonths(date: Date | string, months: number): Date {
	const d = typeof date === 'string' ? new Date(date) : new Date(date);
	d.setMonth(d.getMonth() + months);
	return d;
}

/**
 * Format date range
 * @param start Start date
 * @param end End date
 * @param locale Locale string
 * @returns Formatted date range string
 */
export function formatDateRange(
	start: Date | string,
	end: Date | string,
	locale: string = 'en-US'
): string {
	const startDate = typeof start === 'string' ? new Date(start) : start;
	const endDate = typeof end === 'string' ? new Date(end) : end;

	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	};

	const formatter = new Intl.DateTimeFormat(locale, options);

	// Same day
	if (
		startDate.getDate() === endDate.getDate() &&
		startDate.getMonth() === endDate.getMonth() &&
		startDate.getFullYear() === endDate.getFullYear()
	) {
		return formatter.format(startDate);
	}

	// Same month and year
	if (
		startDate.getMonth() === endDate.getMonth() &&
		startDate.getFullYear() === endDate.getFullYear()
	) {
		return `${startDate.getDate()}-${endDate.getDate()} ${formatter.format(endDate)}`;
	}

	return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
}

/**
 * Parse ISO date string safely
 * @param dateString ISO date string
 * @returns Date or null if invalid
 */
export function parseDate(dateString: string): Date | null {
	try {
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? null : date;
	} catch {
		return null;
	}
}
