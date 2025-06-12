import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingCtrl: LoadingController) { }

  async show(
    message: string = 'Loading...',
    spinner: 'bubbles' | 'circles' | 'circular' | 'crescent' | 'dots' | 'lines' | 'lines-small' | 'lines-sharp' | 'lines-sharp-small' | null = 'crescent'
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
  }

  async hide() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
