import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { AdminProfile } from 'src/app/classes/domain/entities/website/profile/adminprofile/adminprofile';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { DTU } from 'src/app/services/dtu.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Component({
  selector: 'app-user-profile-mobile-app',
  templateUrl: './user-profile-mobile-app.component.html',
  styleUrls: ['./user-profile-mobile-app.component.scss'],
  standalone:false
})
export class UserProfileMobileAppComponent  implements OnInit {
  Entity: Employee = Employee.CreateNewInstance();
  AdminEntity: AdminProfile = AdminProfile.CreateNewInstance();

  GenderList = DomainEnums.GenderTypeList();
  currentemployee = 0;
  companyRef = 0;
  imagePreviewUrl: string | null = null;
  selectedFileName: string | null = null;
  TimeStamp = Date.now();
  ImageBaseUrl = '';
  LoginToken = '';
  imageUrl: string | null = null;
  ProfilePicFile: File | null = null;
  // selectedDOB: string | null = '';
  selectedDOB: string | null = null;

  IsEmployee = false;
  IsAdmin = false;
  allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

  isEditing: boolean = false;
  dobPopoverOpen = false;
  popoverEvent: any = null;

  presentDOBPopover(ev: Event) {
    this.popoverEvent = ev;
    this.dobPopoverOpen = true;
  }



  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private baseUrl: BaseUrlService,
    private dtu: DTU,
    private actionSheetController: ActionSheetController,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) { }

  ngOnInit = async () => {

    // this.currentemployee = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));
    // this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));
    // this.LoginToken = this.appStateManage.getLoginToken();
    // this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
    // if (this.currentemployee !== 0) {
    //   await this.getEmployeeDetails();
    // }
  };

  ionViewWillEnter = async () => {
    await this.loadingService.show();
    this.currentemployee = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));
    this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));
    this.LoginToken = this.appStateManage.getLoginTokenForMobile();
    this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
    if (this.currentemployee !== 0) {
      await this.getEmployeeDetails();
    }
    await this.loadingService.hide();
  };

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
      console.log('employeeData :', employeeData);
      if (employeeData == null) {
        const adminData = await AdminProfile.FetchAdminData(async errMsg => {
          await this.toastService.present("Error " + errMsg, 1000, 'danger');
          await this.haptic.error();
          // await this.uiUtils.showErrorMessage('Error', errMsg)
        }
        );

        console.log('adminData :', adminData);

        if (adminData?.[0]) {
          this.AdminEntity = adminData[0];
          this.IsAdmin = true;
          this.IsEmployee = false;

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

  findGenderName(GenderRef: number): string {
    const gender = this.GenderList.find(g => g.Ref === GenderRef);
    return gender ? gender.Name : 'N/A';
  }

  addImage = async () => {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Take Photo',
          icon: 'camera',
          handler: () => this.pickImage(CameraSource.Camera)
        },
        {
          text: 'Choose from Gallery',
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
  };

  private pickImage = async (source: CameraSource) => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri, // Use URI instead of DataUrl
        source
      });

      const uri = image.path ?? image.webPath;
      if (!uri) {
        throw new Error('Image URI not available');
      }

      // Convert URI to file
      const fileName = `profile_${Date.now()}.jpeg`;
      const file = await this.uriToFile(uri, fileName);

      // Set preview image
      this.imagePreviewUrl = uri;

      // Assign to the correct entity
      if (this.IsEmployee) {
        this.ProfilePicFile = file;
        this.selectedFileName = file.name;
      } else if (this.AdminEntity && this.AdminEntity.p) {
        this.AdminEntity.p.ProfilePicFile = file;
        this.selectedFileName = file.name;
      }

    } catch (error) {
      console.error('Image picking error:', error);
      this.toastService.present('Error picking image', 1000, 'danger');
      await this.haptic.error();
    }
  };
  uriToFile = async (uri: string, fileName: string, mimeType = 'image/jpeg') => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new File([blob], fileName, { type: mimeType });
  };


  SaveProfile = async () => {
    let lstFTO: FileTransferObject[] = [];

    if (this.IsEmployee) {
      const entityToSave = this.Entity.GetEditableVersion();
      const entitiesToSave = [entityToSave];

      if (this.ProfilePicFile) {
        lstFTO.push(
          FileTransferObject.FromFile(
            'ProfilePicFile',
            this.ProfilePicFile,
            this.ProfilePicFile.name
          )
        );
      }

      await this.Entity.EnsurePrimaryKeysWithValidValues();
      const tr = await this.utils.SavePersistableEntities(entitiesToSave, lstFTO);

      if (!tr.Successful) {
        // this.uiUtils.showErrorMessage('Error', tr.Message);
        await this.toastService.present("Error " + tr.Message, 1000, 'danger');
        await this.haptic.error();
      } else {
        // await this.uiUtils.showSuccessToster('Employee Profile Updated successfully');
        await this.toastService.present('Employee Profile Updated successfully', 1000, 'success');
        await this.haptic.success();
        // this.router.navigate(['/homepage']);
      }
    } else if (this.IsAdmin && this.AdminEntity?.p) {
      const adminToSave = this.AdminEntity.GetEditableVersion();
      const adminEntitiesToSave = [adminToSave];

      if (this.AdminEntity.p.ProfilePicFile) {
        lstFTO.push(
          FileTransferObject.FromFile(
            'ProfilePicFile',
            this.AdminEntity.p.ProfilePicFile,
            this.AdminEntity.p.ProfilePicFile.name
          )
        );
      }

      await this.AdminEntity.EnsurePrimaryKeysWithValidValues();
      const tr = await this.utils.SavePersistableEntities(adminEntitiesToSave, lstFTO);

      if (!tr.Successful) {
        // this.uiUtils.showErrorMessage('Error', tr.Message);
        await this.toastService.present("Error " + tr.Message, 1000, 'danger');
        await this.haptic.error();
      } else {
        // await this.uiUtils.showSuccessToster('Admin Profile Updated successfully');
        // this.router.navigate(['/homepage']);
        await this.toastService.present('Employee Profile Updated successfully', 1000, 'success');
        await this.haptic.success();
        this.cancelEdit()
      }
    } else {
      // this.uiUtils.showErrorMessage('Error', 'No profile found to save.');
      await this.toastService.present("Error No profile found to save.", 1000, 'danger');
      await this.haptic.error();
    }

    // Reset file
    this.ProfilePicFile = null;
  };

  editProfile = () => {
    this.isEditing = true;
  };

  cancelEdit = () => {
    this.isEditing = false;
    this.getEmployeeDetails(); // Re-fetch original data
  };

  BackProfile = () => {
    this.router.navigate(['/mobile-app/tabs/settings'], { replaceUrl: true });
  };
}
