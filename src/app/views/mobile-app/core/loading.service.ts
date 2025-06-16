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
  private isLoading = false;
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
    try {
      if (this.isLoading || this.loading) return;

      this.isLoading = true;

      this.loading = await this.loadingCtrl.create({
        message,
        spinner,
        cssClass: 'custom-loading',
        backdropDismiss: false
      });

      await this.loading.present();

      // Prevent double loaders
      const result = await this.loading.onDidDismiss();
      if (!this.isLoading) return;

      this.loading = null;
      this.isLoading = false;

      // Subscribe to back button
      this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(9999, async () => {
        await this.hide();
      });
    } catch (error) {
      console.error('Error showing loader:', error);
    }
  }

  async hide() {
    try {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
      }

      this.isLoading = false;

      // Unsubscribe back button
      if (this.backButtonSubscription) {
        this.backButtonSubscription.unsubscribe();
        this.backButtonSubscription = null;
      }
    } catch (error) {
      // In case loader is already dismissed
      console.warn('Loader dismiss error (likely already dismissed):', error);
      this.loading = null;
      this.isLoading = false;
    }
  }

  isLoaderActive(): boolean {
    return this.isLoading;
  }
}

