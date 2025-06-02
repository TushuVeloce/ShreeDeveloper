import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone:false
})
export class SettingsPage implements OnInit {
  employeeName: string = '';
  userImage: string = '';
  // defaultAvatar: string = 'https://avatar.iran.liara.run/public/6';
  defaultAvatar: string = 'assets/logos/dp.png';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private actionSheetCtrl: ActionSheetController
  ) { }

  async ngOnInit(): Promise<void> {
    this.employeeName = localStorage.getItem('UserDisplayName') || 'User';
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
        { text: 'Cancel', role: 'cancel' },
        { text: 'Logout', handler: () => this.logout() },
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
    this.router.navigate(['/login_mobile_app']);
  }

  async selectImage() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => this.pickImage(CameraSource.Camera)
        },
        {
          text: 'Gallery',
          icon: 'image',
          handler: () => this.pickImage(CameraSource.Photos)
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async pickImage(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source
      });
      this.userImage = image.dataUrl!;
    } catch (error) {
      console.error('Image pick error:', error);
    }
  }
}
