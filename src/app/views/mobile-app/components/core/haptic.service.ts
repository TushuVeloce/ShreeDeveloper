// src/app/services/haptic.service.ts
import { Injectable } from '@angular/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class HapticService {
  private isNativePlatform(): boolean {
    return Capacitor.isNativePlatform(); // returns true for iOS/Android apps only
  }

  async lightImpact() {
    if (!this.isNativePlatform()) return;
    await Haptics.impact({ style: ImpactStyle.Light });
  }

  async mediumImpact() {
    if (!this.isNativePlatform()) return;
    await Haptics.impact({ style: ImpactStyle.Medium });
  }

  async heavyImpact() {
    if (!this.isNativePlatform()) return;
    await Haptics.impact({ style: ImpactStyle.Heavy });
  }

  async selectionStart() {
    if (!this.isNativePlatform()) return;
    await Haptics.selectionStart();
  }

  async selectionChanged() {
    if (!this.isNativePlatform()) return;
    await Haptics.selectionChanged();
  }

  async selectionEnd() {
    if (!this.isNativePlatform()) return;
    await Haptics.selectionEnd();
  }

  async success() {
    if (!this.isNativePlatform()) return;
    await Haptics.notification({ type: NotificationType.Success });
  }

  async warning() {
    if (!this.isNativePlatform()) return;
    await Haptics.notification({ type: NotificationType.Warning });
  }

  async error() {
    if (!this.isNativePlatform()) return;
    await Haptics.notification({ type: NotificationType.Error });
  }
}
