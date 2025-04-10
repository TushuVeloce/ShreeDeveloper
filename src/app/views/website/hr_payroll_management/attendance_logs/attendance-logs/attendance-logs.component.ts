import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttendanceLogs } from 'src/app/classes/domain/entities/website/HR_and_Payroll/hr_payroll_management/attendancelogs';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
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

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService
  ) { }

  ngOnInit() { }

  headers: string[] = ['Sr. no','Employee Name', 'Date', 'Check In', 'Check Out', 'Total Time'];

  // async AddOfficeTime() {
  //   this.router.navigate(['/homepage/Website/Office_Duty_Time_Details']);
  // }

  filterTable = () => { };

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };
}
