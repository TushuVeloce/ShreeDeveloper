import { Component, OnInit, OnDestroy, effect } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveRequestType } from 'src/app/classes/domain/domainenums/domainenums';
import { LeaveRequest } from 'src/app/classes/domain/entities/website/request/leaverequest/leaverequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
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

  companyRef = this.companyState.SelectedCompanyRef;
  selectedStatus = 1;
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
    private appState: AppStateManageService,
    private companyState: CompanyStateManagement,
    private dtu: DTU,
    private dateService: DateconversionService
  ) { }

  async ngOnInit(): Promise<void> {
    this.Entity.p.EmployeeRef = this.appState.getEmployeeRef();
    if (this.Entity.p.EmployeeRef > 0) {
      await this.getLeaveRequests();
    }

    // Auto update filtered data on state change
    // effect(() => {
    //   this.filterLeaveRequests();
    // });
  }

  ngOnDestroy(): void {
    // Optional cleanup logic
  }

  formatDate = (date: string | Date): string =>
    this.dateService.formatDate(date);

  handleRefresh(event: CustomEvent): void {
    setTimeout(async () => {
      await this.getLeaveRequests();
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

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
    this.filteredLeaveRequestData = this.LeaveRequestList.filter((leave) => {
      const { IsApproved, IsCancelled } = leave.p;

      switch (this.selectedStatus) {
        case 1: return IsApproved === 1;
        case 0: return IsApproved === 0 && IsCancelled !== 1;
        case 2: return IsCancelled === 1;
        default: return true;
      }
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
  }

  addLeaveRequest(): void {
    this.router.navigate([
      '/app_homepage/tabs/attendance-management/add-leave-request',
    ]);
  }
}
