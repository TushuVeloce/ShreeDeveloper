import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: false
})
export class UserProfilePage implements OnInit {
  user = {
    name: 'Vijay Yadhav',
    dob: '1986-01-19',
    phone: '+1878891821',
    gender: 'Male',
    email: 'shreedeevelopers@gmail.com',
    image: ''
  };
  isLoading: boolean = false;
  companyRef: number = 0;
  employeeRef: number = 0;
  companyName: any = '';
  employeeData : Employee[] =[];

  constructor(private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private appStateManagement: AppStateManageService,
    private dtu: DTU,
    private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.employeeRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
    this.companyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
    this.companyName = this.appStateManagement.StorageKey.getItem('companyName') ? this.appStateManagement.StorageKey.getItem('companyName') : '';
    await this.getSingleEmployeeDetails();
  }

  private async getSingleEmployeeDetails(): Promise<void> {
    try {
      if (this.companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }

      const employee = await Employee.FetchInstance(
        this.employeeRef, this.companyRef,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      if (!employee) {
        this.employeeData[0].p.CreatedByName= this.appStateManage.StorageKey.getItem('UserDisplayName') ?? '';
      }
      this.employeeData.push(employee);
    } catch (error) {

    }
  }

  async addImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.user.image = image.dataUrl!;
  }

  goToAccountSettings() {
    this.router.navigate(['/account-settings']);
  }
}

// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
// import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
// import { AppStateManageService } from 'src/app/services/app-state-manage.service';
// import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
// import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
// import { DTU } from 'src/app/services/dtu.service';
// import { UIUtils } from 'src/app/services/uiutils.service';
// import { Utils } from 'src/app/services/utils.service';

// @Component({
//   selector: 'app-user-profile',
//   templateUrl: './user-profile.page.html',
//   styleUrls: ['./user-profile.page.scss'],
// })
// export class UserProfilePage implements OnInit {
//   user = {
//     name: 'Vijay Yadhav',
//     dob: '1986-01-19',
//     phone: '+1878891821',
//     gender: 'Male',
//     email: 'shreedeevelopers@gmail.com',
//     image: ''
//   };

//   isLoading: boolean = false;
//   companyRef = 0;
//   employeeRef = 0;
//   companyName: string = '';
//   employeeData: Employee[] = [];

//   constructor(
//     private uiUtils: UIUtils,
//     private bottomsheetMobileAppService: BottomsheetMobileAppService,
//     private appStateManagement: AppStateManageService,
//     private dtu: DTU,
//     private router: Router
//   ) { }

//   async ngOnInit(): Promise<void> {
//     this.employeeRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
//     this.companyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
//     this.companyName = this.appStateManagement.StorageKey.getItem('companyName') || '';
//     await this.getSingleEmployeeDetails();
//   }

//   private async getSingleEmployeeDetails(): Promise<void> {
//     this.isLoading = true;
//     try {
//       if (this.companyRef <= 0) {
//         await this.uiUtils.showErrorToster('Company not Selected');
//         return;
//       }

//       const employee = await Employee.FetchInstance(
//         this.employeeRef,
//         this.companyRef,
//         async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
//       );

//       if (employee) {
//         this.employeeData.push(employee);
//       } else {
//         await this.uiUtils.showWarningToster('employee not Selected');
//       }
//     } catch (error) {
//       console.error('Fetch Employee Error:', error);
//       this.uiUtils.showErrorToster('Something went wrong while fetching employee data');
//     } finally {
//       this.isLoading = false;
//     }
//   }

//   async addImage() {
//     try {
//       const image = await Camera.getPhoto({
//         quality: 90,
//         allowEditing: false,
//         resultType: CameraResultType.DataUrl,
//         source: CameraSource.Camera,
//       });

//       this.user.image = image.dataUrl!;
//     } catch (err) {
//       console.error('Camera Error:', err);
//       this.uiUtils.showErrorToster('Image selection failed');
//     }
//   }

//   goToAccountSettings() {
//     this.router.navigate(['/account-settings']);
//   }
// }
