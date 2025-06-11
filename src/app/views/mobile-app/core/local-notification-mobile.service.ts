import { Injectable } from '@angular/core';
import {
  LocalNotifications,
  LocalNotificationSchedule,
  PermissionStatus,
} from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private permissionGranted = false;

  constructor() {
    this.requestPermission();
  }

  async requestPermission() {
    const result: PermissionStatus = await LocalNotifications.requestPermissions();
    this.permissionGranted = result.display === 'granted';
    if (!this.permissionGranted) {
      console.warn('🚫 Notification permission not granted');
    }
  }

  async showSuccess(message: string) {
    if (!this.permissionGranted) return;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: Date.now(),
          title: '✅ Success',
          body: message,
          schedule: { at: new Date(Date.now() + 500) },
        },
      ],
    });
  }

  async showError(message: string) {
    if (!this.permissionGranted) return;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: Date.now(),
          title: '❌ Error',
          body: message,
          schedule: { at: new Date(Date.now() + 500) },
        },
      ],
    });
  }

  async scheduleNotification(title: string, body: string, delayMs = 1000) {
    if (!this.permissionGranted) return;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: Date.now(),
          title,
          body,
          schedule: { at: new Date(Date.now() + delayMs) },
        },
      ],
    });
  }

  async cancelAll() {
    await LocalNotifications.cancel({ notifications: [] });
    console.log('🔕 All notifications cancelled.');
  }

  async scheduleDailyNotification(title: string, body: string, hour: number, minute: number) {
    if (!this.permissionGranted) return;

    const schedule: LocalNotificationSchedule = {
      repeats: true,
      every: 'day',
      on: { hour, minute }, // 24-hour format
    };

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 10001,
          title,
          body,
          schedule,
        },
      ],
    });

    console.log(`📅 Daily notification set for ${hour}:${minute}`);
  }

  async cancelRecurring(id: number) {
    await LocalNotifications.cancel({
      notifications: [{ id }],
    });

    console.log(`❌ Notification with ID ${id} cancelled.`);
  }
}




// constructor(private notificationService: NotificationService) { }

// // Show toast-style notifications
// this.notificationService.showSuccess('Data saved successfully');
// this.notificationService.showError('Something went wrong!');

// // Schedule a daily reminder at 9:30 AM
// this.notificationService.scheduleDailyNotification('Reminder', 'Open your app!', 9, 30);

// // Cancel it if needed
// this.notificationService.cancelRecurring(10001);
