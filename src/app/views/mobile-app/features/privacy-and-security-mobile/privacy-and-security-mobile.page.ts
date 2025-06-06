import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-privacy-and-security-mobile',
  templateUrl: './privacy-and-security-mobile.page.html',
  styleUrls: ['./privacy-and-security-mobile.page.scss'],
  standalone:false,
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0px',
        opacity: 0,
        padding: '0px',
        overflow: 'hidden',
      })),
      state('expanded', style({
        height: '*',
        opacity: 1,
        padding: '*',
        overflow: 'hidden',
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease')
      ]),
    ])
  ]
})
export class PrivacyAndSecurityMobilePage implements OnInit {
  showOnlineStatus = true;
  allowNotifications = true;
  useBiometrics = false;
  locationAccess = false;

  showPrivacyPolicy = false;
  showSecurityPolicy = false;

  constructor(private alertController: AlertController) { }

  ngOnInit() { }

  togglePrivacyPolicy() {
    this.showPrivacyPolicy = !this.showPrivacyPolicy;
  }

  toggleSecurityPolicy() {
    this.showSecurityPolicy = !this.showSecurityPolicy;
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to permanently delete your account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            console.log('Account deleted');
          },
        },
      ],
    });

    await alert.present();
  }
}
