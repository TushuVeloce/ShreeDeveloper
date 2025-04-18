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

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Leave Request Type', 'Description', 'Date', 'Days', 'Approval Status'];
  // headers: string[] = ['Sr.No.', 'Leave Request Type', 'Date', 'Days', 'Approval Status'];
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
    this.appStateManage.setDropdownDisabled(false);
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
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
    // this.Entity.p.EmployeeRef = this.EmployeeList[0].p.Ref
    // this.getLeaveApprovalListByEmployeeRef();
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
      await this.uiUtils.showErrorToster('Employee not Selected');
      return;
    }
    let lst = await LeaveRequest.FetchEntireListByEmployeeRef(this.Entity.p.EmployeeRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;

    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }


  // handleApproval = async (leaveapproval: LeaveRequest) => {
  //   await this.uiUtils.showConfirmationMessage(
  //     'Approval',
  //     `This process is <strong>IRREVERSIBLE!</strong> <br/>
  //   Are you sure that you want to Approve this Leave?`,
  //     async () => {
  //       this.Entity = leaveapproval;
  //       this.Entity.p.IsApproved = 1;
  //       this.Entity.p.LeaveApprovedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
  //       this.Entity.p.LeaveCancelledBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
  //       let entityToSave = this.Entity.GetEditableVersion();

  //       let entitiesToSave = [entityToSave];
  //       let tr = await this.utils.SavePersistableEntities(entitiesToSave);

  //       if (!tr.Successful) {
  //         this.isSaveDisabled = false;
  //         this.uiUtils.showErrorMessage('Error', tr.Message);
  //         return;
  //       } else {
  //         this.isSaveDisabled = false;
  //         await this.uiUtils.showSuccessToster('Leave Request Successfully Approved');
  //         this.getLeaveApprovalListByEmployeeRef();
  //       }
  //     }
  //   );
  // }


  handleApproval = async (leaveapproval: LeaveRequest) => {
    await this.uiUtils.showStatusConfirmationMessage(
      'Update Leave Status',
      `Please confirm the new status for this leave request.`,
      ['Approved', 'Rejected', 'Cancel'],
      // Order matters: Confirm, Deny, Cancel
      async (selectedStatus: string) => {
        // Exit when select cancle
        if (selectedStatus === 'Cancel') {
          return;
        }
        this.Entity = leaveapproval;
        if (selectedStatus === 'Approved') {
          this.Entity.p.IsApproved = 1;
          this.Entity.p.LeaveApprovedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
          this.Entity.p.LeaveCancelledBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
          this.Entity.p.IsCancelled = 0;
        }
        else if (selectedStatus === 'Rejected') {
          this.Entity.p.IsApproved = 0;
          this.Entity.p.LeaveApprovedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
          this.Entity.p.LeaveCancelledBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
          this.Entity.p.IsCancelled = 1;
        }
        const entityToSave = this.Entity.GetEditableVersion();
        console.log(entityToSave);

        const tr = await this.utils.SavePersistableEntities([entityToSave]);

        if (!tr.Successful) {
          this.uiUtils.showErrorMessage('Error', tr.Message);
        } else {
          await this.uiUtils.showSuccessToster(`Leave marked as ${selectedStatus}`);
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

  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.LeaveRequestName.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }
}
