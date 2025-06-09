import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { UserLogoutRequest } from 'src/app/classes/infrastructure/request_response/userlogoutrequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { SessionValues } from 'src/app/services/sessionvalues.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {

  employeeName: string = '';
  userImage: string = '';
  defaultAvatar: string = 'assets/logos/dp.png';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private actionSheetCtrl: ActionSheetController,
    public appStateManagement: AppStateManageService,
    private sessionValues: SessionValues,
    private servercommunicator: ServerCommunicatorService
  ) { }

  ngOnInit(): void {
    this.employeeName = localStorage.getItem('UserDisplayName') || 'User';
  }

  openProfile() {
    this.router.navigate(['/mobileapp/tabs/settings/user-profile']);
  }

  openNotifications() {
    this.router.navigate(['/mobileapp/tabs/settings/notification']);
  }

  openPrivacy() {
    this.router.navigate(['/mobileapp/tabs/settings/privacy-and-security']);
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Logout', handler: () => this.logout() }
      ]
    });
    await alert.present();
  }

  async logout() {
    const req = new UserLogoutRequest();
    req.LoginToken = this.sessionValues.CurrentLoginToken;
    req.LastSelectedCompanyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
    req.EmployeeRef = this.appStateManagement.getEmployeeRef();

    try {
      await this.servercommunicator.LogoutUser(req);
    } catch (error) {
      console.error('Logout error:', error);
    }

    // Clear all storage and reset app state
    this.appStateManagement.StorageKey.clear();
    localStorage.clear();

    const toast = await this.toastController.create({
      message: 'Logged out successfully!',
      duration: 2000,
      color: 'danger',
    });
    await toast.present();

    // Navigate to login
    this.router.navigate(['/mobileapp/auth/login-mobile']);
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
      this.userImage = image.dataUrl || '';
    } catch (error) {
      console.error('Image pick error:', error);
    }
  }
}
