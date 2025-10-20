/**
 * Notification store using Svelte 5 Runes
 */

import { NotificationType, type Notification, type NotificationOptions } from './types';

class NotificationStore {
	private notifications = $state<Notification[]>([]);
	private idCounter = 0;

	/**
	 * Get all notifications
	 */
	get items(): Notification[] {
		return this.notifications;
	}

	/**
	 * Add a notification
	 */
	private add(
		type: NotificationType,
		message: string,
		options: NotificationOptions = {}
	): string {
		const id = `notification-${++this.idCounter}`;
		const notification: Notification = {
			id,
			type,
			message,
			title: options.title,
			duration: options.duration ?? 5000,
			dismissible: options.dismissible ?? true,
			action: options.action
		};

		this.notifications.push(notification);

		// Auto dismiss if duration is set
		if (notification.duration > 0) {
			setTimeout(() => {
				this.dismiss(id);
			}, notification.duration);
		}

		return id;
	}

	/**
	 * Show success notification
	 */
	success(message: string, options?: NotificationOptions): string {
		return this.add(NotificationType.SUCCESS, message, options);
	}

	/**
	 * Show error notification
	 */
	error(message: string, options?: NotificationOptions): string {
		return this.add(NotificationType.ERROR, message, {
			duration: 7000, // Errors stay longer
			...options
		});
	}

	/**
	 * Show warning notification
	 */
	warning(message: string, options?: NotificationOptions): string {
		return this.add(NotificationType.WARNING, message, options);
	}

	/**
	 * Show info notification
	 */
	info(message: string, options?: NotificationOptions): string {
		return this.add(NotificationType.INFO, message, options);
	}

	/**
	 * Dismiss a notification
	 */
	dismiss(id: string): void {
		const index = this.notifications.findIndex(n => n.id === id);
		if (index > -1) {
			this.notifications.splice(index, 1);
		}
	}

	/**
	 * Dismiss all notifications
	 */
	dismissAll(): void {
		this.notifications = [];
	}

	/**
	 * Clear all notifications of a specific type
	 */
	clearType(type: NotificationType): void {
		this.notifications = this.notifications.filter(n => n.type !== type);
	}
}

// Export singleton instance
export const notificationStore = new NotificationStore();
