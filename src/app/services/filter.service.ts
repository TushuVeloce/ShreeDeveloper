import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FilterSheetComponent } from '../views/mobile-app/shared/filter-sheet/filter-sheet.component';


@Injectable({
    providedIn: 'root'
})
export class FilterService {
    constructor(private modalCtrl: ModalController) { }

    async openFilter(data: any, selected: any = {}): Promise<any> {
        const modal = await this.modalCtrl.create({
            component: FilterSheetComponent,
            componentProps: { data, selected },
            breakpoints: [0, 0.5],
            initialBreakpoint: 0.5,
            showBackdrop: true,
            cssClass: 'filter-modal'
        });
        await modal.present();
        const { data: result } = await modal.onDidDismiss();
        return result;
    }

}
