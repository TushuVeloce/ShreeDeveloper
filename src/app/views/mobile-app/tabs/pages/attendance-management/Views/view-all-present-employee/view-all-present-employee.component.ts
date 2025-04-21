import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttendenceLogType } from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLogs } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogs';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-view-all-present-employee',
  templateUrl: './view-all-present-employee.component.html',
  styleUrls: ['./view-all-present-employee.component.scss'],
  standalone: false
})
export class ViewAllPresentEmployeeComponent implements OnInit {
  Entity: AttendanceLogs = AttendanceLogs.CreateNewInstance();
  TodayAttendanceLogList: AttendanceLogs[] = [];
  FilteredTodayAttendanceLogList: AttendanceLogs[] = [];
  SelectedAttendanceLogs: AttendanceLogs = AttendanceLogs.CreateNewInstance();
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  modalOpen: boolean = false;

  constructor(
    private router: Router,
    private companystatemanagement: CompanyStateManagement,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService,
    private dateconversionService: DateconversionService
  ) { }


  ngOnInit() {
    this.getTodayAttendanceLogByAttendanceListType();
  // let strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
   }

  formatDate(date: string | Date): string {
    return this.dateconversionService.formatDate(date);
  }
  getTodayAttendanceLogByAttendanceListType = async () => {
    let TodaysAttendanceLog = await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogType(this.companyRef(), AttendenceLogType.TodaysAttendanceLog, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.TodayAttendanceLogList = TodaysAttendanceLog
  }

  openModal(Attendance: AttendanceLogs): void {
    this.SelectedAttendanceLogs = Attendance;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.SelectedAttendanceLogs = AttendanceLogs.CreateNewInstance();
  }
  
  get attendanceInfo() {
    const p = this.SelectedAttendanceLogs.p;
    return [
      { label: 'Employee Name:', value: p.EmployeeName || '-' },
      { label: 'Date:', value: this.formatDate(p.TransDateTime) || '-' },
      { label: 'First Check In:', value: p.FirstCheckInTime || '-' },
      { label: 'Last Check Out:', value: p.LastCheckOutTime || '-' },
      { label: 'Working Hours:', value: p.TotalWorkingHrs || '-' },
      { label: 'Overtime Hours:', value: p.TotalOvertimeHours || '-' },
      { label: 'Photo 1:', value: p.attendacelogpath1 || '-' },
      { label: 'Photo 2:', value: p.attendacelogpath2 || '-' }
    ];
  }

}
