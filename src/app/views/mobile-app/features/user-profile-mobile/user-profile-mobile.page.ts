import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController } from '@ionic/angular';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-user-profile-mobile',
  templateUrl: './user-profile-mobile.page.html',
  styleUrls: ['./user-profile-mobile.page.scss'],
  standalone:false
})
export class UserProfileMobilePage implements OnInit {

  user = {
    name: 'Vijay Yadhav',
    dob: '1986-01-19',
    phone: '+1878891821',
    gender: 'Male',
    email: 'shreedeevelopers@gmail.com',
    image: 'assets/logos/dp.png'
  };
  isLoading: boolean = false;
  companyRef: number = 0;
  employeeRef: number = 0;
  companyName: any = '';
  employeeData: Employee[] = [];

  constructor(private uiUtils: UIUtils,
    private appStateManagement: AppStateManageService,
    private router: Router,
    private actionSheetController: ActionSheetController) { }

  async ngOnInit(): Promise<void> {
    this.employeeRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
    this.companyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
    this.companyName = this.appStateManagement.StorageKey.getItem('companyName') ? this.appStateManagement.StorageKey.getItem('companyName') : '';
    await this.getSingleEmployeeDetails();
  }
  ionViewWillEnter = async () => {
    await this.getSingleEmployeeDetails();
  };

  private async getSingleEmployeeDetails(): Promise<void> {
    try {
      this.isLoading = true;
      if (this.companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      if (this.employeeRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }

      const employee = await Employee.FetchInstance(
        this.employeeRef, this.companyRef,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      console.log('this.employeeRef, this.companyRef, :', this.employeeRef, this.companyRef,);
      console.log('employee :', employee);

      if (!employee) {
        this.employeeData[0].p.CreatedByName = this.appStateManagement.StorageKey.getItem('UserDisplayName') ?? '';
      }
    } catch (error) {

    } finally {
      this.isLoading = false;
    }
  }

  // async addImage() {
  //   const image = await Camera.getPhoto({
  //     quality: 90,
  //     allowEditing: false,
  //     resultType: CameraResultType.DataUrl,
  //     source: CameraSource.Camera
  //   });

  //   this.user.image = image.dataUrl!;
  // }

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

      this.user.image = image.dataUrl!;
    } catch (error) {
      console.error('Image picking error:', error);
    }
  }


  goToAccountSettings() {
    this.router.navigate(['/account-settings']);
  }

}
