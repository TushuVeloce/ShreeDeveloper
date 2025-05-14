import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone:false
})
export class SettingsPage implements OnInit {
  isLoading: boolean = false;
  companyRef: number = 0;
  companyName: any = '';
  employeeRef: number = 0;
  employeeName: any = '';
  employeeData: Employee[] = [];

  async ngOnInit(): Promise<void> {
    this.companyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
    this.companyName = this.appStateManagement.StorageKey.getItem('companyName') ? this.appStateManagement.StorageKey.getItem('companyName') : '';
    this.employeeRef = Number(this.appStateManagement.StorageKey.getItem('LoginEmployeeRef'));
    this.employeeName = this.appStateManagement.StorageKey.getItem('UserDisplayName') ? this.appStateManagement.StorageKey.getItem('UserDisplayName') : '';
    await this.loadCustomerEnquiryIfEmployeeExists();
  }

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private uiUtils: UIUtils,
    private utils: Utils,
    private appStateManagement: AppStateManageService,
  ) {}

    private async loadCustomerEnquiryIfEmployeeExists(): Promise<void> {
      try {
        this.isLoading = true;
        // await this.getSingleEmployeeDetails();

      } catch (error) {


      } finally {
        this.isLoading = false;
      }
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
        console.log('employee :', employee);
      } catch (error) {

      }
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
