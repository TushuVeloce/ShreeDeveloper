import { Injectable } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { SelectModalComponent } from '../views/mobile-app/components/shared/select-modal/select-modal.component';


@Injectable({
    providedIn: 'root'
})
export class BottomsheetMobileAppService {
    private backButtonSubscription: any;
    private routeSubscription: Subscription | null = null;
    private modalInstance: HTMLIonModalElement | null = null;

    constructor(
        private modalCtrl: ModalController,
        private platform: Platform,
        private router: Router
    ) { }

    async openSelectModal(options: any[], selectedOptions: any[] = [], multiSelect: boolean = false, bottomsheetTitle: string = '', MaxSelection: number = 1): Promise<any[] | null> {
        this.modalInstance = await this.modalCtrl.create({
            component: SelectModalComponent,
            componentProps: {
                options,
                selectedOptions,
                multiSelect,
                bottomsheetTitle,
                MaxSelection
            },
            breakpoints: [0, 0.3, 0.6, 1],
            initialBreakpoint: 0.6,
            handle: true,
            backdropDismiss: true
        });
        await this.modalInstance.present();

        this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
            this.modalInstance?.dismiss();
            this.unsubscribe();
        });

        this.routeSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.modalInstance?.dismiss();
                this.unsubscribe();
            }
        });

        const { data } = await this.modalInstance.onWillDismiss();
        this.unsubscribe();
        return data || null;
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
