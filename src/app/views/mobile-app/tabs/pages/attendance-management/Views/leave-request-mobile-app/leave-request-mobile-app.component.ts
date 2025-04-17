import { Component, OnInit, effect, OnDestroy } from '@angular/core';
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
  standalone: false
})
export class LeaveRequestMobileAppComponent implements OnInit, OnDestroy {
  SelectedLeaveRequest: LeaveRequest = LeaveRequest.CreateNewInstance();
  Entity: LeaveRequest = LeaveRequest.CreateNewInstance();
  LeaveRequestList: LeaveRequest[] = [];
  filteredLeaveRequestData: LeaveRequest[] = [];

  // LocalFromDate: string = '';
  // LocalToDate: string = '';
  // localDate: string = '';

  CustomerRef: number = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  selectedStatus: number = 1;
  modalOpen: boolean = false;
  // selectedLeave: LeaveRequest | = null;

  statusOptions = [
    { label: 'Approved', value: 1 },
    { label: 'Pending', value: 0 },
    { label: 'Rejected', value: 2 }
  ];

  LeaveRequestTypeEnum = LeaveRequestType;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
    private DateconversionService: DateconversionService
  ) { }

  async ngOnInit(): Promise<void> {
    this.Entity.p.EmployeeRef = this.appStateManage.getEmployeeRef();
    await this.getLeaveRequestListByEmployeeRef();

    // Automatically react to any future changes if needed
    effect(async () => {
      this.filterApprovedLeaveData();
    });

    // // While Edit Converting From date String into Date Format //
    // if (this.Entity.p.FromDate) {
    //   this.LocalFromDate = this.dtu.ConvertStringDateToShortFormat(
    //     this.Entity.p.FromDate
    //   );
    // }

    // // While Edit Converting To date String into Date Format //
    // if (this.Entity.p.ToDate) {
    //   this.LocalToDate = this.dtu.ConvertStringDateToShortFormat(
    //     this.Entity.p.ToDate
    //   );
    // }

    // // While Edit Converting To date String into Date Format //
    // if (this.Entity.p.HalfDayDate) {
    //   this.localDate = this.dtu.ConvertStringDateToShortFormat(
    //     this.Entity.p.HalfDayDate
    //   );
    // }

  }

    // Extracted from services date conversion //
    formatDate = (date: string | Date): string => {
      return this.DateconversionService.formatDate(date);
    }

  async getLeaveRequestListByEmployeeRef(): Promise<void> {
    this.LeaveRequestList = [];

    if (this.Entity.p.EmployeeRef <= 0) {
      await this.uiUtils.showErrorToster('Employee not Selected');
      return;
    }

    this.LeaveRequestList = await LeaveRequest.FetchEntireListByEmployeeRef(
      this.Entity.p.EmployeeRef,
      async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    this.filterApprovedLeaveData();
  }

  filterApprovedLeaveData(): void {
    this.filteredLeaveRequestData = this.LeaveRequestList.filter(leave => {
      const isApproved = leave.p.IsApproved === 1;
      const isPending = leave.p.IsApproved === 0 && leave.p.IsCancelled !== 1;
      const isRejected = leave.p.IsCancelled === 1;

      if (this.selectedStatus === 1) return isApproved;
      if (this.selectedStatus === 0) return isPending;
      if (this.selectedStatus === 2) return isRejected;

      return true;
    });
  }

  openModal(leave: LeaveRequest): void {
    this.SelectedLeaveRequest = leave;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.SelectedLeaveRequest.DeleteInstance;
  }

  async onDeleteClicked(request: LeaveRequest): Promise<void> {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>Are you sure that you want to DELETE this Leave Request?`,
      async () => {
        await request.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Leave Request of ${request.p.EmployeeName} has been deleted!`
          );
          await this.getLeaveRequestListByEmployeeRef();
        });
      }
    );
  }

  addLeaveRequest(): void {
    this.router.navigate(['/app_homepage/tabs/attendance-management/add-leave-request']);
  }

  ngOnDestroy(): void {
    // Cleanup logic if needed
  }

}
