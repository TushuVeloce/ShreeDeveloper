import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { AdminProfile } from 'src/app/classes/domain/entities/website/profile/adminprofile/adminprofile';
import { UserLogoutRequest } from 'src/app/classes/infrastructure/request_response/userlogoutrequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { DTU } from 'src/app/services/dtu.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { SessionValues } from 'src/app/services/sessionvalues.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-settings-view-mobile-app',
  templateUrl: './settings-view-mobile-app.component.html',
  styleUrls: ['./settings-view-mobile-app.component.scss'],
  standalone: false
})
export class SettingsViewMobileAppComponent implements OnInit {
  Entity: Employee = Employee.CreateNewInstance();
  AdminEntity: AdminProfile = AdminProfile.CreateNewInstance();

  employeeName: string = '';
  employeeEmail: string = '';
  Role:string='';
  userImage: string = '';
  defaultAvatar: string = 'assets/logos/dp.png';

  currentemployee = 0;
  companyRef = 0;
  imagePreviewUrl: string | null = null;
  selectedFileName: string | null = null;
  TimeStamp = Date.now();
  ImageBaseUrl = '';
  LoginToken = '';
  imageUrl: string | null = null;
  ProfilePicFile: File | null = null;
  IsEmployee = false;
  IsAdmin = false;


  profileOptions = [
    { title: 'Notifications', icon: 'notifications-outline', action: () => this.openNotifications() },
    { title: 'change password', icon: 'finger-print', action: () => this.openChangePassword() },
    { title: 'Privacy and Security', icon: 'lock-closed-outline', action: () => this.openPrivacy() },
    { title: 'Logout', icon: 'log-out-outline', action: () => this.confirmLogout() },
  ];

  constructor(
    private router: Router,
    public appStateManagement: AppStateManageService,
    private sessionValues: SessionValues,
    private servercommunicator: ServerCommunicatorService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private baseUrl: BaseUrlService,
    private dtu: DTU,
  ) { }

  ngOnInit = async () => {
    // await this.loadingService.show();
    // this.employeeName = localStorage.getItem('UserDisplayName') || 'User';
    // this.employeeEmail = localStorage.getItem('userEmail') || 'email';
    // this.currentemployee = Number(this.appStateManagement.localStorage.getItem('LoginEmployeeRef'));
    // this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
    // this.LoginToken = this.appStateManagement.getLoginTokenForMobile();
    // this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
    // if (this.currentemployee !== 0) {
    //   await this.getEmployeeDetails();
    // }
    // await this.loadingService.hide();
  }
  ionViewWillEnter = async () => {
    // await this.loadingService.show();
    // this.employeeName = localStorage.getItem('UserDisplayName') || 'User';
    // this.employeeEmail = localStorage.getItem('userEmail') || 'email';
    // await this.loadingService.hide();
    this.employeeName = localStorage.getItem('UserDisplayName') || 'User';
    this.employeeEmail = localStorage.getItem('userEmail') || 'email';
    this.currentemployee = Number(this.appStateManagement.localStorage.getItem('LoginEmployeeRef'));
    this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
    this.LoginToken = this.appStateManagement.getLoginTokenForMobile();
    this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
    if (this.currentemployee !== 0) {
      await this.getEmployeeDetails();
    }
  }
  getEmployeeDetails = async () => {
    if (this.currentemployee && this.companyRef) {
      const employeeData = await Employee.FetchInstance(
        this.currentemployee,
        this.companyRef,
        async errMsg => {
          await this.toastService.present("Error " + errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );
      // console.log('employeeData :', employeeData);
      if (employeeData == null) {
        const adminData = await AdminProfile.FetchAdminData(async errMsg => {
          await this.toastService.present("Error " + errMsg, 1000, 'danger');
          await this.haptic.error();
          // await this.uiUtils.showErrorMessage('Error', errMsg)
        }
        );

        // console.log('adminData :', adminData);

        if (adminData?.[0]) {
          this.AdminEntity = adminData[0];
          this.IsAdmin = true;
          this.IsEmployee = false;
          this.Role ='Admin';
          if (this.AdminEntity.p.DOB) {
            this.AdminEntity.p.DOB = this.dtu.ConvertStringDateToShortFormat(this.AdminEntity.p.DOB);
          }
          this.imageUrl = this.AdminEntity.p.ProfilePicPath;
          this.loadImageFromBackend(this.imageUrl);
        }
      } else {
        this.Entity = employeeData;
        this.IsEmployee = true;
        this.IsAdmin = false;
        this.Role =this.Entity.p.DesignationName;
        if (this.Entity.p.DOB) {
          this.Entity.p.DOB = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.DOB);
        }
        this.imageUrl = this.Entity.p.ProfilePicPath;
        this.loadImageFromBackend(this.imageUrl);
        this.AdminEntity = AdminProfile.CreateNewInstance();
      }
    }
  };

  loadImageFromBackend(imageUrl: string | null): void {
    if (imageUrl) {
      this.imagePreviewUrl = `${this.ImageBaseUrl}${imageUrl}/${this.LoginToken}?${this.TimeStamp}`;
      this.selectedFileName = imageUrl;
    } else {
      this.imagePreviewUrl = null;
    }
  }

  openProfile = async () => {
    this.router.navigate(['/mobile-app/tabs/settings/profile']);
  }

  openNotifications = async () => {
    this.router.navigate(['/mobile-app/tabs/settings/notifications']);
  }

  openChangePassword = async () => {
    this.router.navigate(['/mobile-app/tabs/settings/change-password']);
  }

  openPrivacy = async () => {
    this.router.navigate(['/mobile-app/tabs/settings/privacy-and-security']);
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
            // console.log('User cancelled.');
          }
        },
        {
          text: 'Yes, Logout',
          cssClass: 'custom-confirm',
          handler: () => {
            // console.log('User confirmed logout.');
            this.logout()
          }
        }
      ]
    });
  }

  logout = async () => {
    try {
      await this.loadingService.show();
      const req = new UserLogoutRequest();
      req.LoginToken = this.appStateManagement.localStorage.getItem('CurrentLoginToken') || '';
      req.LastSelectedCompanyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
      req.EmployeeRef = Number(this.appStateManagement.localStorage.getItem('LoginEmployeeRef'));

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

      this.toastService.present('Logout successfully', 1000, 'danger');
      this.haptic.success();
      // Navigate to login
      this.router.navigate(['/mobile-app/auth/login']);
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
