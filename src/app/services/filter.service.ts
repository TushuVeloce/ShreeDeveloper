import { Injectable } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterSheetComponent } from '../views/mobile-app/shared/filter-sheet/filter-sheet.component';

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    private backButtonSubscription: any;
    private routeSubscription: Subscription | null = null;
    private modalInstance: HTMLIonModalElement | null = null;

    constructor(
        private modalCtrl: ModalController,
        private platform: Platform,
        private router: Router
    ) { }

    async openFilter(data: any, selected: any = {}): Promise<any> {
        this.modalInstance = await this.modalCtrl.create({
            component: FilterSheetComponent,
            componentProps: { data, selected },
            breakpoints: [0, 0.5],
            initialBreakpoint: 0.5,
            showBackdrop: true,
            cssClass: 'filter-modal'
        });

        await this.modalInstance.present();

        // Hardware back button
        this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
            console.log('Back button pressed - Closing filter modal');
            this.modalInstance?.dismiss();
            this.unsubscribe();
        });

        // Route change listener
        this.routeSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                console.log('Route changed - Closing filter modal');
                this.modalInstance?.dismiss();
                this.unsubscribe();
            }
        });

        const { data: result } = await this.modalInstance.onWillDismiss();
        this.unsubscribe();
        return result;
    }

    private unsubscribe() {
        if (this.backButtonSubscription) {
            this.backButtonSubscription.unsubscribe();
        }
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    }
}
