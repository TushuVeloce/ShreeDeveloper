// import { Injectable } from '@angular/core';
// import { LoadingController } from '@ionic/angular';

// @Injectable({
//   providedIn: 'root'
// })
// export class LoadingService {
//   private loading: HTMLIonLoadingElement | null = null;

//   constructor(private loadingCtrl: LoadingController) { }

//   async show(message: string = 'Loading...') {
//     this.loading = await this.loadingCtrl.create({
//       message,
//       spinner: 'crescent'
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


// // constructor(private loadingService: LoadingService) { }

// // async login() {
// //   await this.loadingService.show('Logging in...');
// //   // logic here
// //   await this.loadingService.hide();
// // }


import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingCtrl: LoadingController) { }

  async show(message: string = 'Loading.....', spinner: string = 'crescent') {
    if (this.loading) await this.hide();

    const loadingElement = document.createElement('div');
    loadingElement.innerHTML = `
      <div class="custom-loading-content">
        <ion-spinner name="${spinner}"></ion-spinner>
        <p class="custom-loading-message">${message}</p>
      </div>
    `;

    this.loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading',
      spinner: null, // disable default spinner
      backdropDismiss: false,
      message: '',
    });

    await this.loading.present();

    // Inject custom content after present
    const content = this.loading.querySelector('.loading-wrapper');
    if (content) {
      content.innerHTML = ''; // clear default content
      content.appendChild(loadingElement);
    }
  }
  

  async hide() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
