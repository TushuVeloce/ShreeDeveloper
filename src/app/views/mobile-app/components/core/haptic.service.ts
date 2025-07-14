// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class HapticService {

//   constructor() { }
// }

// src/app/services/haptic.service.ts
import { Injectable } from '@angular/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root',
})
export class HapticService {
  async lightImpact() {
    await Haptics.impact({ style: ImpactStyle.Light });
  }

  async mediumImpact() {
    await Haptics.impact({ style: ImpactStyle.Medium });
  }

  async heavyImpact() {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  }

  async selectionStart() {
    await Haptics.selectionStart();
  }

  async selectionChanged() {
    await Haptics.selectionChanged();
  }

  async selectionEnd() {
    await Haptics.selectionEnd();
  }

  async success() {
    await Haptics.notification({ type: NotificationType.Success });
  }

  async warning() {
    await Haptics.notification({ type: NotificationType.Warning });
  }

  async error() {
    await Haptics.notification({ type: NotificationType.Error });
  }
}


// async showSuccessToast() {
//   await this.haptic.success();
//   const toast = await this.toastCtrl.create({
//     message: 'Action completed!',
//     duration: 2000,
//     color: 'success',
//   });
//   await toast.present();
// }
// constructor(private haptic: HapticService) { }

// onTabClick() {
//   this.haptic.lightImpact();
// }
// async showSuccessToast() {
//   await this.haptic.success();
//   const toast = await this.toastCtrl.create({
//     message: 'Action completed!',
//     duration: 2000,
//     color: 'success',
//   });
//   await toast.present();
// }
