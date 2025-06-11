import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { UserLogoutRequest } from 'src/app/classes/infrastructure/request_response/userlogoutrequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { SessionValues } from 'src/app/services/sessionvalues.service';
import { AlertService } from '../../core/alert.service';
import { ToastService } from '../../core/toast.service';
import { HapticService } from '../../core/haptic.service';
import { LoadingService } from '../../core/loading.service';

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
    private actionSheetCtrl: ActionSheetController,
    public appStateManagement: AppStateManageService,
    private sessionValues: SessionValues,
    private servercommunicator: ServerCommunicatorService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) { }

  ngOnInit = async () => {
    await this.loadingService.show();
    this.employeeName = localStorage.getItem('UserDisplayName') || 'User';
    await this.loadingService.hide();
  }
  ionViewWillEnter = async () => {
    await this.loadingService.show();
    this.employeeName = localStorage.getItem('UserDisplayName') || 'User';
    await this.loadingService.hide();
  }

  openProfile = async () => {
    this.router.navigate(['/mobileapp/tabs/settings/user-profile']);
  }

  openNotifications = async () => {
    this.router.navigate(['/mobileapp/tabs/settings/notification']);
  }
  
  openChangePassword = async () => {
    this.router.navigate(['/mobileapp/tabs/settings/change-password']);
  }

  openPrivacy = async () => {
    this.router.navigate(['/mobileapp/tabs/settings/privacy-and-security']);
  }

  confirmLogout = async () => {
    this.alertService.presentDynamicAlert({
      header: 'Logout',
      subHeader: 'Confirmation needed',
      message: 'Are you sure you want to logout?',
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
          text: 'Yes, Logout',
          cssClass: 'custom-confirm',
          handler: () => {
            console.log('User confirmed logout.');
            this.logout()
          }
        }
      ]
    });
  }

  logout = async () => {
    try {
      await this.loadingService.show('Loading...', 'crescent');
      const req = new UserLogoutRequest();
      req.LoginToken = this.sessionValues.CurrentLoginToken;
      req.LastSelectedCompanyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
      req.EmployeeRef = this.appStateManagement.getEmployeeRef();

      try {
        await this.servercommunicator.LogoutUser(req);
      } catch (error) {
        this.toastService.present(`Error ${error}`, 1000, 'danger');
        await this.haptic.error();
        // console.error('Logout error:', error);
      }

      // Clear all storage and reset app state
      this.appStateManagement.StorageKey.clear();
      localStorage.clear();

      this.toastService.present('Logout successfully', 2000, 'danger');
      await this.haptic.success();
      // Navigate to login
      this.router.navigate(['/mobileapp/auth/login-mobile']);
    } catch (error) {

    } finally {
      await this.loadingService.hide();
    }
  }

  // async selectImage() {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Select Image Source',
  //     buttons: [
  //       {
  //         text: 'Camera',
  //         icon: 'camera',
  //         handler: () => this.pickImage(CameraSource.Camera)
  //       },
  //       {
  //         text: 'Gallery',
  //         icon: 'image',
  //         handler: () => this.pickImage(CameraSource.Photos)
  //       },
  //       {
  //         text: 'Cancel',
  //         icon: 'close',
  //         role: 'cancel'
  //       }
  //     ]
  //   });

  //   await actionSheet.present();
  // }

  // async pickImage(source: CameraSource) {
  //   try {
  //     const image = await Camera.getPhoto({
  //       quality: 90,
  //       allowEditing: true,
  //       resultType: CameraResultType.DataUrl,
  //       source
  //     });
  //     this.userImage = image.dataUrl || '';
  //   } catch (error) {
  //     console.error('Image pick error:', error);
  //   }
  // }
}
