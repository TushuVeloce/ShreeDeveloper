// import { Injectable } from '@angular/core';
// import { ToastController } from '@ionic/angular';

// @Injectable({
//   providedIn: 'root'
// })
// export class ToastService {
//   constructor(private toastCtrl: ToastController) { }

//   async present(message: string, duration: number = 2000, color: string = 'primary') {
//     const toast = await this.toastCtrl.create({
//       message,
//       duration,
//       color,
//       position: 'bottom'
//     });
//     await toast.present();
//   }
// }

// // constructor(private toastService: ToastService) { }

// // this.toastService.present('Logged in successfully', 2000, 'success');

// src/app/services/toast.service.ts
import { Injectable } from '@angular/core';
import { ToastController, ToastButton } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private activeToast: HTMLIonToastElement | null = null;

  constructor(private toastCtrl: ToastController) { }

  // Simple toast
  async present(message: string, duration: number = 2000, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  // Persistent toast with optional retry
  async presentPersistent(
    message: string,
    color: string = 'danger',
    retryCallback?: () => void
  ) {
    if (this.activeToast) return; // Avoid showing multiple toasts

    const buttons: ToastButton[] = retryCallback
      ? [
        {
          text: 'Retry',
          role: 'cancel',
          handler: () => {
            retryCallback();
            this.activeToast = null;
          }
        }
      ]
      : [];

    this.activeToast = await this.toastCtrl.create({
      message,
      duration: 0, // Stays until dismissed
      color,
      position: 'bottom',
      buttons
    });

    await this.activeToast.present();
  }

  async dismiss() {
    if (this.activeToast) {
      await this.activeToast.dismiss();
      this.activeToast = null;
    }
  }
}
