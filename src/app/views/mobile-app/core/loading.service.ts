import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingCtrl: LoadingController) { }

  async show(message: string = 'Loading...') {
    this.loading = await this.loadingCtrl.create({
      message,
      spinner: 'crescent'
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


// constructor(private loadingService: LoadingService) { }

// async login() {
//   await this.loadingService.show('Logging in...');
//   // logic here
//   await this.loadingService.hide();
// }
