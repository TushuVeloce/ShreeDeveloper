// import { Injectable } from '@angular/core';
// import { LoadingController } from '@ionic/angular';

// @Injectable({
//   providedIn: 'root'
// })
// export class LoadingService {
//   private loading: HTMLIonLoadingElement | null = null;

//   constructor(private loadingCtrl: LoadingController) { }

//   async show(
//     message: string = 'Loading...',
//     spinner: 'bubbles' | 'circles' | 'circular' | 'crescent' | 'dots' | 'lines' | 'lines-small' | 'lines-sharp' | 'lines-sharp-small' | null = 'crescent'
//   ) {
//     // Prevent multiple spinners
//     if (this.loading) return;

//     this.loading = await this.loadingCtrl.create({
//       message,
//       spinner,
//       cssClass: 'custom-loading',
//       backdropDismiss: false 
//     });

//     await this.loading.present();
//   }

//   async hide() {
//     if (this.loading) {
//       await this.loading.dismiss();
//       this.loading = null;
//     }
//   }
// }

import { Injectable } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;
  private backButtonSubscription: any;

  constructor(
    private loadingCtrl: LoadingController,
    private platform: Platform
  ) { }

  async show(
    message: string = 'Loading...',
    spinner:
      | 'bubbles'
      | 'circles'
      | 'circular'
      | 'crescent'
      | 'dots'
      | 'lines'
      | 'lines-small'
      | 'lines-sharp'
      | 'lines-sharp-small'
      | null = 'crescent'
  ) {
    // Prevent multiple spinners
    if (this.loading) return;

    this.loading = await this.loadingCtrl.create({
      message,
      spinner,
      cssClass: 'custom-loading',
      backdropDismiss: false
    });

    await this.loading.present();

    // Subscribe to hardware back button
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(9999, async () => {
      await this.hide(); // Hide loader if back button is pressed
    });
  }

  async hide() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;

      // Unsubscribe from back button event when loader is hidden
      if (this.backButtonSubscription) {
        this.backButtonSubscription.unsubscribe();
        this.backButtonSubscription = null;
      }
    }
  }
}
