import { Component, OnInit } from '@angular/core';
import { AttendenceLogType, DomainEnums, LeaveRequestType } from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLogs } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogs';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-attendance-details',
  templateUrl: './attendance-details.component.html',
  styleUrls: ['./attendance-details.component.scss'],
  standalone:false
})
export class AttendanceDetailsComponent implements OnInit {
  selectedMonth: number = new Date().getMonth();
  months: any[] = [];

  Entity: AttendanceLogs = AttendanceLogs.CreateNewInstance();
  monthlyAttendanceLogsList: AttendanceLogs[] = [];
  filteredMonthlyAttendanceLogsList: AttendanceLogs[] = [];
  SelectedAttendanceLogs: AttendanceLogs = AttendanceLogs.CreateNewInstance();
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  leaveTypeEnum = LeaveRequestType;

  constructor(
    private uiUtils: UIUtils,
    private companystatemanagement: CompanyStateManagement,
  ) { }

  ngOnInit() {
    this.getDataByMonth(this.selectedMonth);
    this.months = DomainEnums.MonthList();
  }

  async getDataByMonth(month: any): Promise<void> {
    if (month === undefined) return;
    this.selectedMonth = month;
    this.Entity.p.Months = month;
    await this.getMonthWiseAttendanceLogByAttendanceListType();
  }

  getMonthWiseAttendanceLogByAttendanceListType = async () => {
    this.filteredMonthlyAttendanceLogsList = [];
    this.monthlyAttendanceLogsList = [];
    const month = this.Entity.p.Months;
    const employeeref = this.Entity.p.EmployeeRef;

    const MonthlyAttendanceLog = await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogTypeAndMonth(
      this.companyRef(),
      AttendenceLogType.MonthlyAttendanceLog,
      month,
      employeeref,
      async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    this.monthlyAttendanceLogsList = MonthlyAttendanceLog;
    this.filteredMonthlyAttendanceLogsList = MonthlyAttendanceLog;
  };
}
