// Фабрики стора уведомлений в stylist-svelte 2.0.0 нет — держим её в приложении.
// Элементы совместимы с ToastStack из библиотеки (RecipeToast).
import type { RecipeToast } from '$stylist/notification/interface/recipe/toast';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotifyOptions {
	title?: string;
	/** Время показа в мс; 0 — не скрывать автоматически */
	duration?: number;
	actions?: RecipeToast['actions'];
}

const DEFAULT_DURATION = 5000;

function createNotificationStore() {
	let items = $state<RecipeToast[]>([]);
	let counter = 0;

	function dismiss(id: string) {
		items = items.filter((item) => item.id !== id);
	}

	function notify(type: NotificationType, message: string, options: NotifyOptions = {}) {
		const id = `notification-${++counter}`;
		const duration = options.duration ?? DEFAULT_DURATION;

		items = [
			...items,
			{
				id,
				type,
				message,
				text: options.title,
				duration,
				actions: options.actions,
				dismissible: true,
				onDismiss: () => dismiss(id)
			}
		];

		if (duration > 0 && typeof window !== 'undefined') {
			setTimeout(() => dismiss(id), duration);
		}

		return id;
	}

	return {
		get items() {
			return items;
		},
		info: (message: string, options?: NotifyOptions) => notify('info', message, options),
		success: (message: string, options?: NotifyOptions) => notify('success', message, options),
		warning: (message: string, options?: NotifyOptions) => notify('warning', message, options),
		error: (message: string, options?: NotifyOptions) => notify('error', message, options),
		dismiss,
		dismissAll: () => {
			items = [];
		}
	};
}

export const notificationStore = createNotificationStore();
