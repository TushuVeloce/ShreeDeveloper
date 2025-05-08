import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveRequest } from 'src/app/classes/domain/entities/website/request/leaverequest/leaverequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { EmployeeMasterComponent } from '../../../Masters/employee/employee-master/employee-master.component';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { LeaveRequestType } from 'src/app/classes/domain/domainenums/domainenums';

@Component({
  selector: 'app-leave-request',
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
  LeaveRequesttype = LeaveRequestType;


  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Leave Request Type', 'Description', 'Date', 'Days', 'Approval Status', 'Action'];
  constructor(private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement,
    private DateconversionService: DateconversionService
  ) {
    effect(async () => {
      await this.getLeaveRequestListByEmployeeRef();
    });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    this.Entity.p.EmployeeRef = this.appStateManage.getEmployeeRef();
    this.getLeaveRequestListByEmployeeRef()
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
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

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  onDeleteClicked = async (leaverequest: LeaveRequest) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Leave Request?`,
      async () => {
        await leaverequest.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Leave Request of ${leaverequest.p.EmployeeName} has been deleted!`
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
        return data.p.LeaveRequestName.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
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
