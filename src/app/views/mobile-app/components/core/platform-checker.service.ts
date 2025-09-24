import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class PlatformCheckerService {
  constructor(private platform: Platform) {}
  isNativePlatform(): boolean {
    return (
      this.platform.is('android') ||
      this.platform.is('ios') ||
      this.platform.is('capacitor')
    );
  }
}
