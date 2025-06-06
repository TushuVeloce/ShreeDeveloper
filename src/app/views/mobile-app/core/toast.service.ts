import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastCtrl: ToastController) { }

  async present(message: string, duration: number = 2000, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}

// constructor(private toastService: ToastService) { }

// this.toastService.present('Logged in successfully!', 2000, 'success');
