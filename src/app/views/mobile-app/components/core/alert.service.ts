// import { Injectable } from '@angular/core';
// import { AlertController } from '@ionic/angular';

// @Injectable({
//   providedIn: 'root'
// })
// export class AlertService {
//   constructor(private alertCtrl: AlertController) { }

//   async presentAlert(header: string, message: string, buttonText: string = 'OK') {
//     const alert = await this.alertCtrl.create({
//       header,
//       message,
//       buttons: [buttonText]
//     });
//     await alert.present();
//   }

//   async presentConfirm(header: string, message: string, okHandler: () => void) {
//     const alert = await this.alertCtrl.create({
//       header,
//       message,
//       buttons: [
//         {
//           text: 'Cancel',
//           role: 'cancel'
//         },
//         {
//           text: 'OK',
//           handler: okHandler
//         }
//       ]
//     });
//     await alert.present();
//   }
// }

// // constructor(private alertService: AlertService) { }

// // this.alertService.presentAlert('Login Failed', 'Invalid email or password');

import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

export interface AlertButton {
  text: string;
  role?: 'cancel' | 'destructive' | string;
  cssClass?: string;
  handler?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private alertCtrl: AlertController) { }

  async presentDynamicAlert({
    header = 'Alert',
    subHeader = '',
    message = '',
    icon = '',
    buttons = [],
    animated = true,
    cssClass = 'custom-alert'
  }: {
    header?: string;
    subHeader?: string;
    message?: string;
    icon?: string; // Pass Ionicon name, image path, or animation HTML
    buttons: AlertButton[];
    animated?: boolean;
    cssClass?: string;
  }) {
    const alert = await this.alertCtrl.create({
      header,
      subHeader,
      // message: `
      //   <div class="alert-icon">${icon}</div>
      //   <div class="alert-msg">${message}</div>
      // `,
      message: message,
      cssClass,
      buttons,
      animated,
      backdropDismiss: false,
      mode: 'ios'
    });

    await alert.present();
  }
}


