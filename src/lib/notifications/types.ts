/**
 * Notification types
 */

export enum NotificationType {
	SUCCESS = 'success',
	ERROR = 'error',
	WARNING = 'warning',
	INFO = 'info'
}

export interface Notification {
	id: string;
	type: NotificationType;
	title?: string;
	message: string;
	duration?: number; // milliseconds, 0 = no auto-dismiss
	dismissible?: boolean;
	action?: {
		label: string;
		callback: () => void;
	};
}

export interface NotificationOptions {
	title?: string;
	duration?: number;
	dismissible?: boolean;
	action?: {
		label: string;
		callback: () => void;
	};
}
