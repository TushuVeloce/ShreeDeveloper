import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttendanceLogs } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogs';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-attendance-logs',
  templateUrl: './attendance-logs.component.html',
  styleUrls: ['./attendance-logs.component.scss'],
  standalone: false,
})
export class AttendanceLogsComponent implements OnInit {
  Entity: AttendanceLogs = AttendanceLogs.CreateNewInstance();
  MasterList: AttendanceLogs[] = [];
  DisplayMasterList: AttendanceLogs[] = [];
  SelectedAttendanceLogs: AttendanceLogs = AttendanceLogs.CreateNewInstance();

  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  SearchString: string = '';
  headers: string[] = ['Sr. no', 'Employee Name', 'Date', 'Check In', 'Check Out', 'Total Time'];

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService, private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      await this.getattendancelogbycompanyref();
    });
  }

  ngOnInit() {
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  getattendancelogbycompanyref = async () => {
    let lst = await AttendanceLogs.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    console.log(this.DisplayMasterList);

    this.loadPaginationData();
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
