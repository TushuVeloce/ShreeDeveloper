import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveRequest } from 'src/app/classes/domain/entities/website/request/leaverequest/leaverequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { Utils } from 'src/app/services/utils.service';
import { LeaveRequestType } from 'src/app/classes/domain/domainenums/domainenums';

@Component({
  selector: 'app-leave-approval',
  standalone: false,
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.scss'],

})

export class LeaveApprovalComponent implements OnInit {
  Entity: LeaveRequest = LeaveRequest.CreateNewInstance();
  MasterList: LeaveRequest[] = [];
  DisplayMasterList: LeaveRequest[] = [];
  SearchString: string = '';
  isSaveDisabled: boolean = false;
  CustomerRef: number = 0;
  EmployeeList: Employee[] = [];
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  LeaveRequesttype = LeaveRequestType;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Employee', 'Leave Request Type', 'Description', 'Date', 'Days', 'Approval Status'];

  constructor(
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement,
    private DateconversionService: DateconversionService,
    private utils: Utils,
  ) {
    effect(async () => {
      await this.getEmployeeListByCompanyRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withDropdown');
    this.getLeaveApprovalListByCompanyRef();
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  getEmployeeListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
  }

  getLeaveApprovalListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await LeaveRequest.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;

    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  getLeaveApprovalListByEmployeeRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.Entity.p.EmployeeRef <= 0) {
      this.getLeaveApprovalListByCompanyRef();
      return;
    }
    let lst = await LeaveRequest.FetchEntireListByEmployeeRef(this.Entity.p.EmployeeRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;

    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  handleApproval = async (leaveapproval: LeaveRequest) => {
    await this.uiUtils.showStatusConfirmationMessage(
      'Update Leave Status',
      `Please confirm the new status for this leave request.`,
      ['Approved', 'Rejected', 'Cancel'],
      // Order matters: Confirm, Deny, Cancel
      async (selectedStatus: string) => {
        // Exit when select cancle
        if (selectedStatus === 'Cancel') {
          await this.uiUtils.showErrorToster('Request Cancelled');
          return;
        }
        this.Entity = leaveapproval;
        // Save original state in case backend fails
        const originalApprovalStatus = this.Entity.p.IsApproved;
        const originalCancelStatus = this.Entity.p.IsCancelled;
        const originalApprovedBy = this.Entity.p.LeaveApprovedBy;
        const originalCancelledBy = this.Entity.p.LeaveCancelledBy;

        const currentEmployeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
        this.Entity.p.LeaveApprovedBy = currentEmployeeRef;
        this.Entity.p.LeaveCancelledBy = currentEmployeeRef;

        if (selectedStatus === 'Approved') {
          this.Entity.p.IsApproved = 1;
          this.Entity.p.LeaveApprovedBy = currentEmployeeRef
          this.Entity.p.LeaveCancelledBy = currentEmployeeRef
          this.Entity.p.IsCancelled = 0;
        }
        else if (selectedStatus === 'Rejected') {
          this.Entity.p.IsApproved = 0;
          this.Entity.p.LeaveApprovedBy = currentEmployeeRef
          this.Entity.p.LeaveCancelledBy = currentEmployeeRef
          this.Entity.p.IsCancelled = 1;
        }
        const entityToSave = this.Entity.GetEditableVersion();
        const tr = await this.utils.SavePersistableEntities([entityToSave]);
        if (!tr.Successful) {
          this.Entity.p.IsApproved = originalApprovalStatus;
          this.Entity.p.IsCancelled = originalCancelStatus;
          this.Entity.p.LeaveApprovedBy = originalApprovedBy;
          this.Entity.p.LeaveCancelledBy = originalCancelledBy;
          this.uiUtils.showErrorMessage('Error', tr.Message);
          return;
        } else {
          if (selectedStatus === 'Approved') {
            await this.uiUtils.showSuccessToster(`Leave has been approved successfully`);
          }
          else if (selectedStatus === 'Rejected') {
            await this.uiUtils.showSuccessToster(`Leave has been rejected  successfully`);
          }
          this.getLeaveApprovalListByEmployeeRef();
        }
      }
    );
  }

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };
}
