import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular/standalone';
import { NetworkService } from '../core/network.service';
import { ToastService } from '../core/toast.service';
import { App as CapacitorApp } from '@capacitor/app'; 
import { filter, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { HapticService } from '../core/haptic.service';
import { AlertService } from '../core/alert.service';
import { LoadingService } from '../core/loading.service';
@Component({
  selector: 'app-tabs-mobile-app',
  templateUrl: './tabs-mobile-app.page.html',
  styleUrls: ['./tabs-mobile-app.page.scss'],
  standalone:false
})
export class TabsMobileAppPage implements OnInit {

  backButtonSub!: Subscription;
  backPressedOnce = false;
  backPressTimer: any;
  showTabs = true;

  private offlineToast: HTMLIonToastElement | null = null;
  constructor(
    private platform: Platform,
    private alertCtrl: AlertController,
    private location: Location,
    private router: Router,
    private networkService: NetworkService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
  ) {
    this.monitorNetworkConnection();
  }

  monitorNetworkConnection() {
    this.networkService.getOnlineStatus().subscribe((connected: boolean) => {
      console.log('Network connected:', connected);

      if (!connected) {
        this.toastService.presentPersistent(
          'No Internet Connection',
          'danger',
          () => this.networkService.retryConnectionCheck()
        );
      } else {
        this.toastService.dismiss();
      }
    });
  }


  ngOnInit() {
    this.backButtonSub = this.platform.backButton.subscribeWithPriority(10, async () => {
      const currentUrl = this.router.url;

      if (currentUrl === '/tabs/dashboard') {
        // Handle double back press to exit
        if (this.backPressedOnce) {
          CapacitorApp.exitApp();
        } else {
          this.backPressedOnce = true;
          // const alert = await this.alertCtrl.create({
          //   header: 'Exit App',
          //   message: 'Press back again to exit the app.',
          //   buttons: ['OK'],
          // });
          // await alert.present();
          this.alertService.presentDynamicAlert({
            header: 'Exit App',
            subHeader: 'Confirmation needed',
            message: 'Press back again to exit the app.',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'custom-cancel',
                handler: () => {
                  console.log('User cancelled.');
                }
              },
              {
                text: 'Ok',
                cssClass: 'custom-confirm',
                handler: () => {
                  this.haptic.success();
                  console.log('User confirmed.');
                }
              }
            ]
          });
          this.backPressTimer = setTimeout(() => {
            this.backPressedOnce = false;
          }, 2000);
        }
      } else {
        // Just go back in history for any nested page
        this.location.back();
      }
    });
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects.toLowerCase();

        // Get last segment of the URL (e.g., 'add' or 'edit')
        const lastSegment = url.split('/').pop();

        // Hide tab bar if last segment is 'add' or 'edit'
        this.showTabs = !(lastSegment === 'add' || lastSegment === 'edit' || lastSegment === 'user-profile');
      });
  }

  ngOnDestroy() {
    if (this.backButtonSub) this.backButtonSub.unsubscribe();
    if (this.backPressTimer) clearTimeout(this.backPressTimer);
  }

}
