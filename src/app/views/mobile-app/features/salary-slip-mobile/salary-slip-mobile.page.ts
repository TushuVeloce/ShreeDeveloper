import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { SalarySlipRequest } from 'src/app/classes/domain/entities/website/request/salarysliprequest/salarysliprequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { ToastService } from '../../core/toast.service';
import { HapticService } from '../../core/haptic.service';
import { AlertService } from '../../core/alert.service';
import { LoadingService } from '../../core/loading.service';

@Component({
  selector: 'app-salary-slip-mobile',
  templateUrl: './salary-slip-mobile.page.html',
  styleUrls: ['./salary-slip-mobile.page.scss'],
  standalone: false
})
export class SalarySlipMobilePage implements OnInit, OnDestroy {
  modalOpen = false;
  selectedSlip: SalarySlipRequest = SalarySlipRequest.CreateNewInstance();

  selectedStatus = -1;
  statusOptions = [
    { label: 'All', value: -1 },
    { label: 'Approved', value: 1 },
    { label: 'Pending', value: 0 }
  ];

  companyRef: number = 0;
  employeeList: Employee[] = [];
  employeeRef: number = 0;

  entity: SalarySlipRequest = SalarySlipRequest.CreateNewInstance();
  salarySlipRequestList: SalarySlipRequest[] = [];
  filteredSalarySlipRequestList: SalarySlipRequest[] = [];

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManagement: AppStateManageService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadSalaryslipIfCompanyExists();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadSalaryslipIfCompanyExists(); // Refresh on enter
  }

  ngOnDestroy(): void {
    // Add cleanup logic if needed
  }

  private async loadSalaryslipIfCompanyExists(): Promise<void> {
    try {
      this.loadingService.show();
      this.companyRef = Number(this.appStateManagement.localStorage.getItem('SelectedCompanyRef'));
      this.entity.p.EmployeeRef = Number(this.appStateManagement.getEmployeeRef());

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }

      await this.getSalarySlipRequestListByEmployeeRef();
    } catch (error) {
      console.error('Error loading salary slips:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadSalaryslipIfCompanyExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  async getSalarySlipRequestListByEmployeeRef(): Promise<void> {
    try {
      this.salarySlipRequestList = [];
      this.filteredSalarySlipRequestList = [];

      if (this.entity.p.EmployeeRef <= 0) {
        await this.toastService.present('Employee not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }

      this.salarySlipRequestList = await SalarySlipRequest.FetchEntireListByEmployeeRef(
        this.entity.p.EmployeeRef,
        async (errMsg) => {
          await this.toastService.present(errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );

      await this.filterSalarySlipsByStatus();
    } catch (error) {
      console.error('Error fetching salary slip list:', error);
    }
  }

  async onDeleteClicked(slip: SalarySlipRequest): Promise<void> {
    try {
      this.alertService.presentDynamicAlert({
        header: 'Delete',
        subHeader: 'Confirmation needed',
        message: 'Are you sure you want to delete this Salary Slip Request?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: async () => {
              console.log('Delete cancelled.');
            }
          },
          {
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                await slip.DeleteInstance(async () => {
                  await this.toastService.present(
                    `Salary Slip Request ${slip.p.EmployeeName} has been deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
                await this.getSalarySlipRequestListByEmployeeRef();
              } catch (error) {
                console.error('Error deleting slip:', error);
                await this.toastService.present('Error deleting salary slip', 1000, 'danger');
                await this.haptic.error();
              }
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error in onDeleteClicked:', error);
    }
  }

  filterSalarySlipsByStatus(): void {
    this.filteredSalarySlipRequestList =
      this.selectedStatus === -1
        ? this.salarySlipRequestList
        : this.salarySlipRequestList.filter(slip => slip.p.IsApproved === this.selectedStatus);
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 1:
        return 'success';
      case 0:
        return 'warning';
      default:
        return 'medium';
    }
  }

  async addSalarySlipRequest(): Promise<void> {
    try {
      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }

      this.router.navigate(['/mobileapp/tabs/attendance/salary-slip/add']);
    } catch (error: any) {
      console.error('Error navigating to add form:', error);
      await this.toastService.present('Error: ' + (error?.message || 'Failed to open the add form.'), 1000, 'danger');
      await this.haptic.error();
    }
  }
}
