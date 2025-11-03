import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { EmployeeOvertime } from 'src/app/classes/domain/entities/website/HR_and_Payroll/Employee_Overtime/employeeovertime';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-employee-overtime-view-mobile-app',
  templateUrl: './employee-overtime-view-mobile-app.component.html',
  styleUrls: ['./employee-overtime-view-mobile-app.component.scss'],
  standalone: false,
})
export class EmployeeOvertimeViewMobileAppComponent implements OnInit {
  isAdmin = false;
  employeeRef = 0;
  companyRef = 0;

  MasterList: EmployeeOvertime[] = [];
  DisplayMasterList: EmployeeOvertime[] = [];
  currentPage = 1;
  pageSize = 10;

  constructor(
    private appStateManagement: AppStateManageService,
    private dateConversionService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private companystatemanagement: CompanyStateManagement,
    private router: Router,
    private utils: Utils,
    private actionSheetCtrl: ActionSheetController
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadInitialData();
  }

  ngOnDestroy(): void {
    // Clean up logic if needed
  }

  ionViewWillEnter = async (): Promise<void> => {
    await this.loadInitialData();
  };

  async handleRefresh(event: CustomEvent): Promise<void> {
    this.currentPage = 1;
    await this.loadInitialData();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async loadInitialData(): Promise<void> {
    try {
      await this.loadingService.show();
      this.employeeRef = Number(
        this.appStateManagement.localStorage.getItem('LoginEmployeeRef')
      );
      this.companyRef = Number(
        this.appStateManagement.localStorage.getItem('SelectedCompanyRef')
      );
      this.isAdmin =
        this.appStateManagement.localStorage.getItem('IsDefaultUser') === '1';

      if (this.companyRef <= 0) {
        this.toastService.present('Please select a company.', 1000, 'warning');
        return;
      }

      await this.getEmployeeOvertimeListByCompanyRef();
    } catch (error) {
      this.toastService.present(
        'Failed to load overtime data.',
        1000,
        'danger'
      );
    } finally {
      this.loadingService.hide();
    }
  }

  async getEmployeeOvertimeListByCompanyRef(): Promise<void> {
    this.MasterList = [];
    let lst = await EmployeeOvertime.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        await this.toastService.present(
          `Failed to load data: ${errMsg}`,
          1000,
          'danger'
        );
      }
    );
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  }

  paginatedList(): EmployeeOvertime[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  async loadMoreData(event: any): Promise<void> {
    const totalItems = this.MasterList.length;
    const nextPageStart = this.currentPage * this.pageSize;

    if (nextPageStart < totalItems) {
      this.currentPage++;
      // Since we already have all data, we don't need to fetch more. Just slice it.
      const newItems = this.MasterList.slice(
        nextPageStart,
        nextPageStart + this.pageSize
      );
      this.DisplayMasterList.push(...newItems);
      event.target.complete();
    } else {
      event.target.disabled = true;
    }
  }

  async showOvertimeActions(overtime: EmployeeOvertime): Promise<void> {
    this.haptic.success();
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Edit',
          icon: 'create-outline',
          handler: () => {
            this.onEditClicked(overtime);
          },
          // You can define 'action-edit' in your SCSS for specific styling
          cssClass: 'action-edit',
        },
        {
          text: 'Delete',
          icon: 'trash-outline',
          role: 'destructive', // This role usually makes the text red by default
          handler: () => {
            this.onDeleteClicked(overtime);
          },
        },
        {
          text: 'Approve',
          icon: 'checkmark-circle-outline',
          handler: () => {
            this.ChangeOvertimeStatus(overtime);
          },
          // Conditionally hide the button if overtime is already verified
          // hidden: overtime.p.IsOverTimeVerified,
          // You can define 'action-approve' in your SCSS for specific styling
          cssClass: 'action-approve',
        },
        {
          text: 'Cancel',
          icon: 'close-circle-outline',
          role: 'cancel', // This role handles dismissal by default
        },
      ],
    });
    await actionSheet.present();
  }

  convertTo12Hour = (time24: string): string => {
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;
    return `${hour}:${minute} ${ampm}`;
  };

  formatDate = (date: string | Date): string => {
    return this.dateConversionService.formatDate(date);
  };

  // async onEditClicked(item: EmployeeOvertime): Promise<void> {
  //   const selectedItem = item.GetEditableVersion();
  //   EmployeeOvertime.SetCurrentInstance(selectedItem);
  //   this.appStateManagement.localStorage.setItem('Editable', 'Edit');
  //   await this.router.navigate(['mobile-app/tabs/attendance/approvals/employee-overtime/edit']);
  // }

  onEditClicked = async (item: EmployeeOvertime) => {
    const selectedItem = item.GetEditableVersion();
    EmployeeOvertime.SetCurrentInstance(selectedItem);
    this.appStateManagement.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate([
      '/mobile-app/tabs/attendance/approvals/employee-overtime/edit',
    ]);
  };

  async ChangeOvertimeStatus(Entity: EmployeeOvertime): Promise<void> {
    try {
      await this.loadingService.show();
      Entity.p.UpdatedBy = this.employeeRef;
      Entity.p.IsOverTimeVerified = true;

      let tr = await this.utils.SavePersistableEntities([
        Entity.GetEditableVersion(),
      ]);

      if (!tr.Successful) {
        this.toastService.present(
          `Failed to approve overtime: ${tr.Message}`,
          1000,
          'danger'
        );
        Entity.p.IsOverTimeVerified = false;
      } else {
        this.toastService.present(
          'Overtime approved successfully!',
          1000,
          'success'
        );
        await this.getEmployeeOvertimeListByCompanyRef();
      }
    } catch (error) {
      this.toastService.present(
        'An unexpected error occurred.',
        1000,
        'danger'
      );
    } finally {
      this.loadingService.hide();
    }
  }

  async onDeleteClicked(overtime: EmployeeOvertime): Promise<void> {
    try {
      await this.loadingService.show();
      await overtime.DeleteInstance(
        async () => {
          this.toastService.present(
            'Overtime deleted successfully!',
            1000,
            'success'
          );
          await this.getEmployeeOvertimeListByCompanyRef();
        },
        async (errMsg) => {
          this.toastService.present(
            `Failed to delete overtime: ${errMsg}`,
            1000,
            'danger'
          );
        }
      );
    } catch (error) {
      this.toastService.present(
        'An unexpected error occurred during deletion.',
        1000,
        'danger'
      );
    } finally {
      this.loadingService.hide();
    }
  }

  AddEmployeeOvertime = async (): Promise<void> => {
    this.haptic.success();
    if (this.companyRef <= 0) {
      this.toastService.present('Please select a company.', 1000, 'warning');
      return;
    }
    await this.router.navigate([
      'mobile-app/tabs/attendance/approvals/employee-overtime/add',
    ]);
  };
}
