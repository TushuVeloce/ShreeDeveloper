import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveRequest } from 'src/app/classes/domain/entities/website/request/leaverequest/leaverequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { EmployeeMasterComponent } from '../../../Masters/employee/employee-master/employee-master.component';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';

@Component({
  selector: 'app-leaverequest-master',
  standalone: false,
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss'],

})

export class LeaveRequestComponent implements OnInit {
  Entity: LeaveRequest = LeaveRequest.CreateNewInstance();
  MasterList: LeaveRequest[] = [];
  DisplayMasterList: LeaveRequest[] = [];
  SearchString: string = '';
  SelectedLeaveRequest: LeaveRequest = LeaveRequest.CreateNewInstance();
  CustomerRef: number = 0;
  EmployeeList: Employee[] = [];
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Leave Request Type', 'From Date', 'To Date', 'Days', 'Hours', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
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

  getEmployeeListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
    this.Entity.p.EmployeeRef = this.EmployeeList[0].p.Ref
  }

  getLeaveRequestListByEmployeeRef = async () => {
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

  onEditClicked = async (item: LeaveRequest) => {
    this.SelectedLeaveRequest = item.GetEditableVersion();
    LeaveRequest.SetCurrentInstance(this.SelectedLeaveRequest);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Leave_Request_Details']);
  };

  onDeleteClicked = async (leaverequest: LeaveRequest) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this LeaveRequest?`,
      async () => {
        await leaverequest.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `LeaveRequest ${leaverequest.p.EmployeeName} has been deleted!`
          );
          await this.getLeaveRequestListByEmployeeRef();
          this.SearchString = '';
          this.loadPaginationData();
        });
      }
    );
  };

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
        return data.p.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }

  AddLeaveRequest = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Leave_Request_Details']);
  }
}
