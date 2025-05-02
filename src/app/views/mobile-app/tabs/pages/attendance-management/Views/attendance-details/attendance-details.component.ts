import { Component, OnInit } from '@angular/core';
import { AttendenceLogType, DomainEnums, LeaveRequestType } from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLogs } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogs';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-attendance-details',
  templateUrl: './attendance-details.component.html',
  styleUrls: ['./attendance-details.component.scss'],
  standalone: false
})
export class AttendanceDetailsComponent implements OnInit {
  selectedMonth: number = new Date().getMonth();
  months: any[] = [];
  isLoading:boolean = false;

  Entity: AttendanceLogs = AttendanceLogs.CreateNewInstance();
  monthlyAttendanceLogsList: AttendanceLogs[] = [];
  filteredMonthlyAttendanceLogsList: AttendanceLogs[] = [];
  SelectedAttendanceLogs: AttendanceLogs = AttendanceLogs.CreateNewInstance();
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  leaveTypeEnum = LeaveRequestType;


  constructor(
    private uiUtils: UIUtils,
    private companystatemanagement: CompanyStateManagement, private appState: AppStateManageService,
    private dateConversionService: DateconversionService
  ) {
    // this.filteredMonthlyAttendanceLogsList = [
    //   {
    //     p: {
    //       TransDateTime: '2025-04-01T00:00:00',
    //       FirstCheckInTime: '09:05 AM',
    //       LastCheckOutTime: '05:30 PM',
    //       TotalWorkingHrs: '8:25',
    //       OnLeave: '',
    //       LeaveType: '',
    //     }
    //   },
    //   {
    //     p: {
    //       TransDateTime: '2025-04-02T00:00:00',
    //       FirstCheckInTime: '09:20 AM',
    //       LastCheckOutTime: '05:10 PM',
    //       TotalWorkingHrs: '7:50',
    //       OnLeave: '',
    //       LeaveType: '',
    //     }
    //   },
    //   {
    //     p: {
    //       TransDateTime: '2025-04-03T00:00:00',
    //       FirstCheckInTime: '',
    //       LastCheckOutTime: '',
    //       TotalWorkingHrs: '',
    //       OnLeave: 'Sick Leave',
    //       LeaveType: 'Sick',
    //     }
    //   },
    //   {
    //     p: {
    //       TransDateTime: '2025-04-04T00:00:00',
    //       FirstCheckInTime: '',
    //       LastCheckOutTime: '',
    //       TotalWorkingHrs: '',
    //       OnLeave: '',
    //       LeaveType: '',
    //     }
    //   }
    // ];
  }

  async ngOnInit(): Promise<void> {
    await this.loadAttendanceDetailsIfEmployeeExists();
  }

  ionViewWillEnter = async () => {
    await this.loadAttendanceDetailsIfEmployeeExists();
    // console.log('Leave request refreshed on view enter');
  };

  ngOnDestroy(): void {
    // cleanup logic if needed later
  }
  private async loadAttendanceDetailsIfEmployeeExists(): Promise<void> {
    try {
      this.isLoading = true;
      this.Entity.p.EmployeeRef = this.appState.getEmployeeRef();
      if (this.Entity.p.EmployeeRef > 0) {
        this.getDataByMonth(this.selectedMonth);
        this.months = DomainEnums.MonthList();
      } else {
        await this.uiUtils.showErrorToster('Employee not selected');
      } 
    } catch (error) {
    // console.log('error :', error);
    }finally{
      this.isLoading = false;
    }
  }

  formatDate(date: string | Date): string {
    return this.dateConversionService.formatDate(date);
  }

  async getDataByMonth(month: any): Promise<void> {
    try {
      if (month === undefined) return;
      this.selectedMonth = month;
      this.Entity.p.Months = month;
      await this.getMonthWiseAttendanceLogByAttendanceListType(); 
    } catch (error) {
    // console.log('error :', error);
    }
  }

  getMonthWiseAttendanceLogByAttendanceListType = async () => {
    try {
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
      // console.log('MonthlyAttendanceLog :', MonthlyAttendanceLog, month, employeeref); 
    } catch (error) {
    // console.log('error :', error);
    }
  };
}
