import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { SalarySlipRequest } from 'src/app/classes/domain/entities/website/request/salarysliprequest/salarysliprequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-salary-slip-mobile-app',
  templateUrl: './salary-slip-mobile-app.component.html',
  styleUrls: ['./salary-slip-mobile-app.component.scss'],
  standalone: false
})
export class SalarySlipMobileAppComponent implements OnInit {
  modalOpen = false;
  selectedSlip: SalarySlipRequest = SalarySlipRequest.CreateNewInstance();
  isLoading = false;

  selectedStatus = -1;
  statusOptions = [
    { label: 'All', value: -1 },
    { label: 'Approved', value: 1 },
    { label: 'Pending', value: 0 }
  ];

  companyRef:number=0;
  employeeList: Employee[] = [];
  employeeRef: number = 0;

  entity: SalarySlipRequest = SalarySlipRequest.CreateNewInstance();
  salarySlipRequestList: SalarySlipRequest[] = [];
  filteredSalarySlipRequestList: SalarySlipRequest[] = [];

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManagement: AppStateManageService,
  ) { }

  ngOnInit(): void {
    this.loadSalaryslipIfCompanyExists();
  }

  ionViewWillEnter = async () => {
    await this.loadSalaryslipIfCompanyExists(); // ← Called every time user comes back
  }
  ngOnDestroy(): void {
    // cleanup logic if needed later
  }
  private async loadSalaryslipIfCompanyExists(): Promise<void> {
    this.companyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
    this.entity.p.EmployeeRef = Number(this.appStateManagement.getEmployeeRef());
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    await this.getSalarySlipRequestListByEmployeeRef();
  }

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadSalaryslipIfCompanyExists();
    (event.target as HTMLIonRefresherElement).complete();
  }


  async getSalarySlipRequestListByEmployeeRef(): Promise<void> {
    try {
      this.isLoading = true;
      this.salarySlipRequestList = [];
      this.filteredSalarySlipRequestList = [];

      if (this.entity.p.EmployeeRef <= 0) {
        await this.uiUtils.showErrorToster('Employee not Selected');
        this.isLoading = false;
        return;
      }
      this.salarySlipRequestList = await SalarySlipRequest.FetchEntireListByEmployeeRef(
        this.entity.p.EmployeeRef,
        async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      await this.filterSalarySlipsByStatus();
    } catch (error) {

    } finally {
      this.isLoading = false;
    }
  }

  async onDeleteClicked(slip: SalarySlipRequest): Promise<void> {
    try {
      await this.uiUtils.showConfirmationMessage(
        'Delete',
        `This process is <strong>IRREVERSIBLE!</strong> <br/>Are you sure that you want to DELETE this Salary Slip Request?`,
        async () => {
          await slip.DeleteInstance(async () => {
            await this.uiUtils.showSuccessToster(
              `Salary Slip Request ${slip.p.EmployeeName} has been deleted!`
            );
            await this.getSalarySlipRequestListByEmployeeRef();
          });
        }
      );
    } catch (error) {

    }
  }
  filterSalarySlipsByStatus(): void {
    this.filteredSalarySlipRequestList =
      this.selectedStatus === -1
        ? this.salarySlipRequestList
        : this.salarySlipRequestList.filter(
          slip => slip.p.IsApproved === this.selectedStatus
        );
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
  async addSalarySlipRequest() {
    try {
      if (this.companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      this.router.navigate([
        '/app_homepage/tabs/attendance-management/add-salary-slip',
      ]);
    } catch (error: any) {
      await this.uiUtils.showErrorMessage('Error', error?.message || 'Failed to open the add form.');
    }
  }
}
