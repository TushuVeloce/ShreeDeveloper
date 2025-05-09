import { Component, OnInit, OnDestroy, effect } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveRequestType } from 'src/app/classes/domain/domainenums/domainenums';
import { LeaveRequest } from 'src/app/classes/domain/entities/website/request/leaverequest/leaverequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-leave-request-mobile-app',
  templateUrl: './leave-request-mobile-app.component.html',
  styleUrls: ['./leave-request-mobile-app.component.scss'],
  standalone: false,
})
export class LeaveRequestMobileAppComponent implements OnInit, OnDestroy {
  LeaveRequestList: LeaveRequest[] = [];
  filteredLeaveRequestData: LeaveRequest[] = [];

  SelectedLeaveRequest: LeaveRequest = LeaveRequest.CreateNewInstance();
  Entity: LeaveRequest = LeaveRequest.CreateNewInstance();

  companyRef = 0;
  selectedStatus: number = 1;
  modalOpen = false;
  isLoading = false;


  readonly LeaveRequestTypeEnum = LeaveRequestType;

  statusOptions = [
    { label: 'Approved', value: 1 },
    { label: 'Pending', value: 0 },
    { label: 'Rejected', value: 2 },
  ];

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManagement: AppStateManageService,
    private dateService: DateconversionService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadLeaveRequestsIfEmployeeExists();
  }

  ionViewWillEnter = async () => {
    await this.loadLeaveRequestsIfEmployeeExists();
    // console.log('Leave request refreshed on view enter');
  };

  ngOnDestroy(): void {
    // cleanup logic if needed later
  }

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadLeaveRequestsIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async loadLeaveRequestsIfEmployeeExists(): Promise<void> {
    const employeeRef = this.appStateManagement.getEmployeeRef();
    this.Entity.p.EmployeeRef = employeeRef;
    this.companyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));

    if (employeeRef > 0) {
      await this.getLeaveRequests();
    } else {
      await this.uiUtils.showErrorToster('Employee not selected');
    }
  }


  formatDate = (date: string | Date): string =>
    this.dateService.formatDate(date);

  async getLeaveRequests(): Promise<void> {
    this.isLoading = true;
    this.LeaveRequestList = [];

    try {
      if (this.Entity.p.EmployeeRef <= 0) {
        await this.uiUtils.showErrorToster('Employee not selected');
        return;
      }

      this.LeaveRequestList = await LeaveRequest.FetchEntireListByEmployeeRef(
        this.Entity.p.EmployeeRef,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );

      this.filterLeaveRequests();
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      this.isLoading = false;
    }
  }

  filterLeaveRequests(): void {
    this.filteredLeaveRequestData = this.LeaveRequestList.filter(({ p }) => {
      const { IsApproved, IsCancelled } = p;

      if (this.selectedStatus === 1) return IsApproved === 1;
      if (this.selectedStatus === 0) return IsApproved === 0 && IsCancelled !== 1;
      if (this.selectedStatus === 2) return IsCancelled === 1;

      return true;
    });
  }


  openModal(leave: LeaveRequest): void {
    this.SelectedLeaveRequest = leave;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.SelectedLeaveRequest = LeaveRequest.CreateNewInstance();
  }

  async onDeleteClicked(request: LeaveRequest): Promise<void> {
    try {
      await this.uiUtils.showConfirmationMessage(
        'Delete',
        `This process is <strong>IRREVERSIBLE!</strong> <br/>Are you sure you want to DELETE this Leave Request?`,
        async () => {
          await request.DeleteInstance(async () => {
            await this.uiUtils.showSuccessToster(
              `Leave request for ${request.p.EmployeeName} deleted!`
            );
            await this.getLeaveRequests();
          });
        }
      );
    } catch (error) {
      // console.error('Error deleting leave requests:', error);
      await this.uiUtils.showErrorMessage('Error', 'Unable to deleting leave requests.');
    }

  }

  async addLeaveRequest() {
    try {
      if (this.companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        // console.log('Company not Selected :', this.companyRef);
        return;
      }
      this.router.navigate([
        '/app_homepage/tabs/attendance-management/add-leave-request',
      ]);
    } catch (error) {
      console.error('Error to move to add leave requests:', error);
      await this.uiUtils.showErrorMessage('Error', 'Unable to move to add leave requests.');
    }
  }
}
