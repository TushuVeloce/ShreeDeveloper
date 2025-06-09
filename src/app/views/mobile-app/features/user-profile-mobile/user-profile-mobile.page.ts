import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController } from '@ionic/angular';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-user-profile-mobile',
  templateUrl: './user-profile-mobile.page.html',
  styleUrls: ['./user-profile-mobile.page.scss'],
  standalone:false
})
export class UserProfileMobilePage implements OnInit {

  // user = {
  //   name: 'Vijay Yadhav',
  //   dob: '1986-01-19',
  //   phone: '+1878891821',
  //   gender: 'Male',
  //   email: 'shreedeevelopers@gmail.com',
  //   image: 'assets/logos/dp.png'
  // };
  // isLoading: boolean = false;
  // companyRef: number = 0;
  // employeeRef: number = 0;
  // companyName: any = '';
  // employeeData: Employee[] = [];

  // constructor(private uiUtils: UIUtils,
  //   private appStateManagement: AppStateManageService,
  //   private router: Router,
  //   private actionSheetController: ActionSheetController) { }

  // async ngOnInit(): Promise<void> {
  //   this.employeeRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
  //   this.companyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
  //   this.companyName = this.appStateManagement.StorageKey.getItem('companyName') ? this.appStateManagement.StorageKey.getItem('companyName') : '';
  //   await this.getSingleEmployeeDetails();
  // }
  // ionViewWillEnter = async () => {
  //   await this.getSingleEmployeeDetails();
  // };

  // private async getSingleEmployeeDetails(): Promise<void> {
  //   try {
  //     this.isLoading = true;
  //     if (this.companyRef <= 0) {
  //       await this.uiUtils.showErrorToster('Company not Selected');
  //       return;
  //     }
  //     if (this.employeeRef <= 0) {
  //       await this.uiUtils.showErrorToster('Company not Selected');
  //       return;
  //     }

  //     const employee = await Employee.FetchInstance(
  //       this.employeeRef, this.companyRef,
  //       async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
  //     );
  //     console.log('this.employeeRef, this.companyRef, :', this.employeeRef, this.companyRef,);
  //     console.log('employee :', employee);

  //     if (!employee) {
  //       this.employeeData[0].p.CreatedByName = this.appStateManagement.StorageKey.getItem('UserDisplayName') ?? '';
  //     }
  //   } catch (error) {

  //   } finally {
  //     this.isLoading = false;
  //   }
  // }

  // // async addImage() {
  // //   const image = await Camera.getPhoto({
  // //     quality: 90,
  // //     allowEditing: false,
  // //     resultType: CameraResultType.DataUrl,
  // //     source: CameraSource.Camera
  // //   });

  // //   this.user.image = image.dataUrl!;
  // // }

  // async addImage() {
  //   const actionSheet = await this.actionSheetController.create({
  //     header: 'Select Image Source',
  //     buttons: [
  //       {
  //         text: 'Take Photo',
  //         icon: 'camera',
  //         handler: () => {
  //           this.pickImage(CameraSource.Camera);
  //         },
  //       },
  //       {
  //         text: 'Choose from Gallery',
  //         icon: 'image',
  //         handler: () => {
  //           this.pickImage(CameraSource.Photos);
  //         },
  //       },
  //       {
  //         text: 'Cancel',
  //         icon: 'close',
  //         role: 'cancel',
  //       },
  //     ],
  //   });

  //   await actionSheet.present();
  // }

  // private async pickImage(source: CameraSource) {
  //   try {
  //     const image = await Camera.getPhoto({
  //       quality: 90,
  //       allowEditing: false,
  //       resultType: CameraResultType.DataUrl,
  //       source: source,
  //     });

  //     this.user.image = image.dataUrl!;
  //   } catch (error) {
  //     console.error('Image picking error:', error);
  //   }
  // }


  // goToAccountSettings() {
  //   this.router.navigate(['/account-settings']);
  // }

   Entity: Employee = Employee.CreateNewInstance();
    GenderList = DomainEnums.GenderTypeList(true, '--- Select Gender ---');
    currentemployee: number = 0
    companyRef = this.companystatemanagement.SelectedCompanyRef;
    imagePreviewUrl: string | null = null;
    selectedFileName: string | null = null;
    TimeStamp = Date.now()
    ImageBaseUrl: string = "";
    LoginToken = '';
    file: File | null = null;
    imageUrl: string | null = null;  // Add imageUrl to bind to src
    errors = { profile_image: '' };
    allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  isLoading: boolean = false;
  
    INDPhoneNo: string = ValidationPatterns.INDPhoneNo
  
    INDPhoneNoMsg: string = ValidationMessages.INDPhoneNoMsg
    RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg  
  
    constructor(private cdr: ChangeDetectorRef, private DateconversionService: DateconversionService,
      private router: Router,
      private uiUtils: UIUtils,
      private appStateManage: AppStateManageService,
      private utils: Utils,
      private companystatemanagement: CompanyStateManagement,
      private baseUrl: BaseUrlService,
      private dtu: DTU,
      private actionSheetController: ActionSheetController
    ) { }
  
    ngOnInit() {
      this.currentemployee = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.LoginToken = this.appStateManage.getLoginToken();
      this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();
      if (this.currentemployee !=0 && this.currentemployee != 1001) {
        this.getEmployeeDetails()
      }
    }
  
    getEmployeeDetails = async () => {
      if (this.currentemployee && this.companyRef()) {
        let EmployeeData = await Employee.FetchInstance(this.currentemployee, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
        this.Entity = EmployeeData
        if (this.Entity.p.DOB != '') {
          this.Entity.p.DOB = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.DOB)
        }
        this.imageUrl = this.Entity.p.ProfilePicPath;
        this.loadImageFromBackend(this.Entity.p.ProfilePicPath)
      }
    }
  
    loadImageFromBackend(imageUrl: string): void {
    console.log('imageUrl :', imageUrl);
      if (imageUrl) {
        this.imagePreviewUrl = `${this.ImageBaseUrl}${imageUrl}/${this.LoginToken}?${this.TimeStamp}`;
        console.log('this.imagePreviewUrl :', this.imagePreviewUrl);
        this.selectedFileName = imageUrl;
      } else {
        this.imagePreviewUrl = null;
      }
    }
  
  async addImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Take Photo',
          icon: 'camera',
          handler: () => {
            this.pickImage(CameraSource.Camera);
          },
        },
        {
          text: 'Choose from Gallery',
          icon: 'image',
          handler: () => {
            this.pickImage(CameraSource.Photos);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  private async pickImage(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: source,
      });

      this.imageUrl = image.dataUrl!;
    } catch (error) {
      console.error('Image picking error:', error);
    }
  }
     handleFileChange(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        this.Entity.p.ProfilePicFile = input.files[0];
        this.selectedFileName = this.Entity.p.ProfilePicFile.name;
  
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviewUrl = reader.result as string;
        };
        reader.readAsDataURL(this.Entity.p.ProfilePicFile);
      }
    }
  
    // Utility function to create object URL
    createObjectURL(file: File): string {
      return URL.createObjectURL(file);
    }
  
    // Extracted from services date conversion //
    formatDate = (date: string | Date): string => {
      return this.DateconversionService.formatDate(date);
    }
  
    selectAllValue(event: MouseEvent): void {
      const input = event.target as HTMLInputElement;
      input.select();
    }
  
    SaveProfile = async () => {
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
  
    let lstFTO: FileTransferObject[] = [];
  
    if (this.Entity.p.ProfilePicFile) {
      lstFTO.push(
        FileTransferObject.FromFile(
          "ProfilePicFile",
          this.Entity.p.ProfilePicFile,
          this.Entity.p.ProfilePicFile.name
        )
      );
    }
  
    await this.Entity.EnsurePrimaryKeysWithValidValues();
    let tr = await this.utils.SavePersistableEntities(entitiesToSave, lstFTO);
  
    if (!tr.Successful) {
      this.uiUtils.showErrorMessage('Error', tr.Message);
    } else {
      await this.uiUtils.showSuccessToster('Profile Updated successfully!');
      this.router.navigate(['/']);
    }
  };
  
  
      BackProfile = () => {
      this.router.navigate(['/homepage']);
    }

}
