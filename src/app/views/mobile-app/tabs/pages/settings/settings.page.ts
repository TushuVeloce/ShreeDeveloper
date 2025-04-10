import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone:false
})
export class SettingsPage implements OnInit {

  ngOnInit() {
  }

  darkMode = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  toggleDarkMode() {
    document.body.classList.toggle('dark', this.darkMode);
  }

  openProfile() {
    this.router.navigate(['/app_homepage/user-profile']);
  }

  openNotifications() {
    this.router.navigate(['/app_homepage/notifications']);
  }

  openPrivacy() {
    this.router.navigate(['/app_homepage/privacy-and-security']);
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Logout',
          handler: () => this.logout(),
        },
      ],
    });

    await alert.present();
  }

  async logout() {
    const toast = await this.toastController.create({
      message: 'Logged out successfully!',
      duration: 2000,
      color: 'danger',
    });
    toast.present();
    this.router.navigate(['/login']);
  }
}
