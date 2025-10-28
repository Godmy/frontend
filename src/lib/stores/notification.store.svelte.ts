import { writable } from 'svelte/store';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timeout?: number; // milliseconds
}

function createNotificationStore() {
  const { subscribe, set, update } = writable<Notification[]>([]);

  let notificationIdCounter = 0;

  function addNotification(message: string, type: NotificationType = 'info', timeout: number = 3000) {
    const id = `notification-${notificationIdCounter++}`;
    const newNotification: Notification = { id, message, type, timeout };

    update(notifications => [...notifications, newNotification]);

    if (timeout > 0) {
      setTimeout(() => removeNotification(id), timeout);
    }
  }

  function removeNotification(id: string) {
    update(notifications => notifications.filter(n => n.id !== id));
  }

  function clearAllNotifications() {
    set([]);
  }

  return {
    subscribe,
    add: addNotification,
    remove: removeNotification,
    clear: clearAllNotifications,
  };
}

export const notificationStore = createNotificationStore();
