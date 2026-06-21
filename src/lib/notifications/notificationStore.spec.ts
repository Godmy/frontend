import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { notificationStore } from './notificationStore.svelte';
import { NotificationType } from './types';

describe('NotificationStore', () => {
	beforeEach(() => {
		// Clear all notifications before each test
		notificationStore.dismissAll();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	describe('success', () => {
		it('should add a success notification', () => {
			const id = notificationStore.success('Operation successful');

			expect(notificationStore.items).toHaveLength(1);
			expect(notificationStore.items[0]).toMatchObject({
				id,
				type: NotificationType.SUCCESS,
				message: 'Operation successful',
				duration: 5000,
				dismissible: true
			});
		});

		it('should support custom options', () => {
			const id = notificationStore.success('Success', {
				title: 'Great!',
				duration: 3000,
				dismissible: false
			});

			expect(notificationStore.items[0]).toMatchObject({
				id,
				title: 'Great!',
				duration: 3000,
				dismissible: false
			});
		});
	});

	describe('error', () => {
		it('should add an error notification', () => {
			const id = notificationStore.error('Something went wrong');

			expect(notificationStore.items).toHaveLength(1);
			expect(notificationStore.items[0]).toMatchObject({
				id,
				type: NotificationType.ERROR,
				message: 'Something went wrong',
				duration: 7000, // Errors stay longer
				dismissible: true
			});
		});

		it('should allow duration override', () => {
			notificationStore.error('Error', { duration: 10000 });

			expect(notificationStore.items[0].duration).toBe(10000);
		});
	});

	describe('warning', () => {
		it('should add a warning notification', () => {
			const id = notificationStore.warning('Please be careful');

			expect(notificationStore.items).toHaveLength(1);
			expect(notificationStore.items[0]).toMatchObject({
				id,
				type: NotificationType.WARNING,
				message: 'Please be careful'
			});
		});
	});

	describe('info', () => {
		it('should add an info notification', () => {
			const id = notificationStore.info('Here is some information');

			expect(notificationStore.items).toHaveLength(1);
			expect(notificationStore.items[0]).toMatchObject({
				id,
				type: NotificationType.INFO,
				message: 'Here is some information'
			});
		});
	});

	describe('dismiss', () => {
		it('should dismiss a specific notification', () => {
			const id1 = notificationStore.success('First');
			const id2 = notificationStore.success('Second');

			expect(notificationStore.items).toHaveLength(2);

			notificationStore.dismiss(id1);

			expect(notificationStore.items).toHaveLength(1);
			expect(notificationStore.items[0].id).toBe(id2);
		});

		it('should do nothing if notification does not exist', () => {
			notificationStore.success('Test');

			notificationStore.dismiss('non-existent-id');

			expect(notificationStore.items).toHaveLength(1);
		});
	});

	describe('dismissAll', () => {
		it('should dismiss all notifications', () => {
			notificationStore.success('First');
			notificationStore.error('Second');
			notificationStore.warning('Third');

			expect(notificationStore.items).toHaveLength(3);

			notificationStore.dismissAll();

			expect(notificationStore.items).toHaveLength(0);
		});
	});

	describe('clearType', () => {
		it('should clear all notifications of a specific type', () => {
			notificationStore.success('Success 1');
			notificationStore.error('Error 1');
			notificationStore.success('Success 2');
			notificationStore.warning('Warning 1');

			expect(notificationStore.items).toHaveLength(4);

			notificationStore.clearType(NotificationType.SUCCESS);

			expect(notificationStore.items).toHaveLength(2);
			expect(notificationStore.items.some(n => n.type === NotificationType.SUCCESS)).toBe(false);
			expect(notificationStore.items.some(n => n.type === NotificationType.ERROR)).toBe(true);
			expect(notificationStore.items.some(n => n.type === NotificationType.WARNING)).toBe(true);
		});
	});

	describe('auto-dismiss', () => {
		it('should auto-dismiss notification after duration', () => {
			notificationStore.success('Auto dismiss', { duration: 3000 });

			expect(notificationStore.items).toHaveLength(1);

			vi.advanceTimersByTime(2999);
			expect(notificationStore.items).toHaveLength(1);

			vi.advanceTimersByTime(1);
			expect(notificationStore.items).toHaveLength(0);
		});

		it('should not auto-dismiss if duration is 0', () => {
			notificationStore.success('No auto dismiss', { duration: 0 });

			expect(notificationStore.items).toHaveLength(1);

			vi.advanceTimersByTime(10000);
			expect(notificationStore.items).toHaveLength(1);
		});

		it('should handle multiple notifications with different durations', () => {
			notificationStore.success('First', { duration: 1000 });
			notificationStore.success('Second', { duration: 2000 });
			notificationStore.success('Third', { duration: 3000 });

			expect(notificationStore.items).toHaveLength(3);

			vi.advanceTimersByTime(1000);
			expect(notificationStore.items).toHaveLength(2);

			vi.advanceTimersByTime(1000);
			expect(notificationStore.items).toHaveLength(1);

			vi.advanceTimersByTime(1000);
			expect(notificationStore.items).toHaveLength(0);
		});
	});

	describe('notification actions', () => {
		it('should support notification actions', () => {
			const action = {
				label: 'Undo',
				onClick: vi.fn()
			};

			const id = notificationStore.success('Action notification', { action });

			expect(notificationStore.items[0].action).toEqual(action);
		});
	});

	describe('unique IDs', () => {
		it('should generate unique IDs for each notification', () => {
			const id1 = notificationStore.success('First');
			const id2 = notificationStore.success('Second');
			const id3 = notificationStore.error('Third');

			expect(id1).not.toBe(id2);
			expect(id2).not.toBe(id3);
			expect(id1).not.toBe(id3);
		});

		it('should increment ID counter', () => {
			const id1 = notificationStore.success('First');
			notificationStore.dismissAll();
			const id2 = notificationStore.success('Second');

			// IDs should continue incrementing even after dismissAll
			expect(id1).toMatch(/notification-\d+/);
			expect(id2).toMatch(/notification-\d+/);
			expect(id1).not.toBe(id2);
		});
	});

	describe('default options', () => {
		it('should use default duration of 5000ms for most notifications', () => {
			notificationStore.success('Test');
			expect(notificationStore.items[0].duration).toBe(5000);

			notificationStore.dismissAll();

			notificationStore.warning('Test');
			expect(notificationStore.items[0].duration).toBe(5000);

			notificationStore.dismissAll();

			notificationStore.info('Test');
			expect(notificationStore.items[0].duration).toBe(5000);
		});

		it('should use default duration of 7000ms for errors', () => {
			notificationStore.error('Test');
			expect(notificationStore.items[0].duration).toBe(7000);
		});

		it('should be dismissible by default', () => {
			notificationStore.success('Test');
			expect(notificationStore.items[0].dismissible).toBe(true);
		});
	});
});
