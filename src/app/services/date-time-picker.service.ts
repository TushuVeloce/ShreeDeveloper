// import { Injectable } from '@angular/core';
// import { ModalController } from '@ionic/angular';
// import { DateTimeModelComponent } from '../views/mobile-app/shared/date-time-model/date-time-model.component';

// @Injectable({
//     providedIn: 'root',
// })
// export class DateTimePickerService {
//     constructor(private modalCtrl: ModalController) { }

//     async open(options: {
//         mode: 'date' | 'time' | 'date-time',
//         label?: string,
//         value?: string | null
//     }): Promise<string | null> {
//         const modal = await this.modalCtrl.create({
//             component: DateTimeModelComponent,
//             componentProps: {
//                 mode: options.mode,
//                 label: options.label || 'Select Date/Time',
//                 value: options.value || null,
//             },
//         });

//         await modal.present();
//         const { data } = await modal.onWillDismiss();
//         return data || null;
//     }
// }
