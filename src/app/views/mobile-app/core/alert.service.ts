import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private alertCtrl: AlertController) { }

  async presentAlert(header: string, message: string, buttonText: string = 'OK') {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [buttonText]
    });
    await alert.present();
  }

  async presentConfirm(header: string, message: string, okHandler: () => void) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: okHandler
        }
      ]
    });
    await alert.present();
  }
}

// constructor(private alertService: AlertService) { }

// this.alertService.presentAlert('Login Failed', 'Invalid email or password');