import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttendanceLogType, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLogsCount } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogcount/attendancelogsCount';
import { AttendanceLogs, AttendanceLogsProps } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogs';
import { WebAttendaneLog } from 'src/app/classes/domain/entities/website/HR_and_Payroll/web_attendance_log/web_attendance_log/webattendancelog';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-employee-attendance-logs',
  templateUrl: './employee-attendance-logs.component.html',
  styleUrls: ['./employee-attendance-logs.component.scss'],
  standalone: false,
})
export class EmployeeAttendanceLogsComponent implements OnInit {
  Entity: WebAttendaneLog = WebAttendaneLog.CreateNewInstance();
  AttendanceLogCount: AttendanceLogsCount = AttendanceLogsCount.CreateNewInstance();
  MasterList: WebAttendaneLog[] = [];
  DisplayMasterList: WebAttendaneLog[] = [];
  SelectedAttendance: WebAttendaneLog = WebAttendaneLog.CreateNewInstance();

  // headers as per required
  baseHeaders: string[] = ['Sr. no', 'Date', 'First Check In', 'Last Check Out', 'Total Time', 'Is Late', 'Is Half Day'];

  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  SearchString: string = '';

  employeeDataList: [] = []

  AttendanceLogTypeList = DomainEnums.AttendanceLogTypeList(
    true,
    '--Select Attendance Log Type--'
  );

  MonthList = DomainEnums.MonthList(
    true,
    '--Select Month List--'
  );

  EmployeeList: Employee[] = [];

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  ToDispayMonthlyRequirement: boolean = false
  ToDisplayWeeklyRequirement: boolean = false
  isTodayAttendanceView: boolean = false;

  isShowMonthlyData: boolean = false;
  isDaysShow: boolean = false;
  isDaysShowMonth: boolean = false;

  IsEmployeeDisable: boolean = false;

  constructor(
    private uiUtils: UIUtils,
    private screenSizeService: ScreenSizeService, private companystatemanagement: CompanyStateManagement,
    private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService,
    private DateconversionService: DateconversionService,
    private router: Router,
    private appStateManage: AppStateManageService,
    private utils: Utils,
  ) {
    effect(async () => {
      await this.getEmployeeListByCompanyRef();
    });
  }

  ngOnInit() {
    this.loadPaginationData();
    this.appStateManage.setDropdownDisabled();
    // this.pageSize = this.screenSizeService.getPageSize('withoutDropdown') - 5;
    // this.isTodayAttendanceView = true;
    this.getViewStatus();
  }

  convertTo12Hour = (time24: string): string => {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    hour = hour === 0 ? 12 : hour; // Handle midnight (0 -> 12 AM) and noon (12 -> 12 PM)

    return `${hour}:${minute} ${ampm}`;
  }

  setTodayViewStatus = () => {
    this.appStateManage.StorageKey.setItem('todispaymonthlyrequirement', JSON.stringify(false));
    this.appStateManage.StorageKey.setItem('todisplayweeklyrequirement', JSON.stringify(false));
    this.appStateManage.StorageKey.setItem('istodayattendanceview', JSON.stringify(true));

    this.appStateManage.StorageKey.setItem('isshowmonthlydata', JSON.stringify(false));
    this.appStateManage.StorageKey.setItem('isdaysshow', JSON.stringify(false));
    this.appStateManage.StorageKey.setItem('isdaysshowmonth', JSON.stringify(false));
  }

  setWeeklyViewStatus = () => {
    this.appStateManage.StorageKey.setItem('todispaymonthlyrequirement', JSON.stringify(false));
    this.appStateManage.StorageKey.setItem('todisplayweeklyrequirement', JSON.stringify(true));
    this.appStateManage.StorageKey.setItem('istodayattendanceview', JSON.stringify(false));

    this.appStateManage.StorageKey.setItem('isshowmonthlydata', JSON.stringify(false));
    this.appStateManage.StorageKey.setItem('isdaysshow', JSON.stringify(true));
    this.appStateManage.StorageKey.setItem('isdaysshowmonth', JSON.stringify(false));
  }

  setMonthlyViewStatus = () => {
    this.appStateManage.StorageKey.setItem('todispaymonthlyrequirement', JSON.stringify(true));
    this.appStateManage.StorageKey.setItem('todisplayweeklyrequirement', JSON.stringify(false));
    this.appStateManage.StorageKey.setItem('istodayattendanceview', JSON.stringify(false));

    this.appStateManage.StorageKey.setItem('isshowmonthlydata', JSON.stringify(true));
    this.appStateManage.StorageKey.setItem('isdaysshow', JSON.stringify(false));
    this.appStateManage.StorageKey.setItem('isdaysshowmonth', JSON.stringify(true));
  }


  getViewStatus = () => {
    this.ToDispayMonthlyRequirement = JSON.parse(this.appStateManage.StorageKey.getItem('todispaymonthlyrequirement') || 'false')
    this.ToDisplayWeeklyRequirement = JSON.parse(this.appStateManage.StorageKey.getItem('todisplayweeklyrequirement') || 'false')
    this.isTodayAttendanceView = JSON.parse(this.appStateManage.StorageKey.getItem('istodayattendanceview') || 'false')

    this.isShowMonthlyData = JSON.parse(this.appStateManage.StorageKey.getItem('isshowmonthlydata') || 'false')
    this.isDaysShow = JSON.parse(this.appStateManage.StorageKey.getItem('isdaysshow') || 'false')
    this.isDaysShowMonth = JSON.parse(this.appStateManage.StorageKey.getItem('isdaysshowmonth') || 'false')
  }

  convertFractionTimeToHM = (fractionTime: number) => {
    const hours = Math.floor(fractionTime);
    const fractionalMinutes = fractionTime - hours;

    // Convert fractional part (base 100) to minutes (base 60)
    const minutes = Math.round(fractionalMinutes * 100 * 60 / 100);

    // Pad minutes with leading zero if needed
    const paddedMinutes = String(minutes).padStart(2, '0');

    return `${hours}h ${paddedMinutes}m`;
  }

  getEmployeeListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    const LoginEmployeeRef = Number(this.appStateManage.StorageKey.getItem("LoginEmployeeRef"))
    const IsDefaultUser = Number(this.appStateManage.StorageKey.getItem("IsDefaultUser"))

    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
    let SingleRecord = lst.filter((data) => data.p.Ref == LoginEmployeeRef)
    if (IsDefaultUser == 0 && LoginEmployeeRef) {
      this.Entity.p.EmployeeRef = LoginEmployeeRef;
      if (SingleRecord.length > 0) {
        this.Entity.p.EmployeeName = SingleRecord[0].p.Name;
      }
      this.IsEmployeeDisable = true
    }

    if (this.isTodayAttendanceView) {
      this.getTodayAttendanceLogByAttendanceListType()
    } else if (this.ToDisplayWeeklyRequirement) {
      this.getWeekWiseAttendanceLogByAttendanceListType();
    } else if (this.ToDispayMonthlyRequirement) {
      this.getMonthWiseAttendanceLogByAttendanceListType();
    }
  }

  getTodayAttendanceLogByAttendanceListType = async () => {
    this.resetSummaryStats();

    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.isTodayAttendanceView == false) {
      return;
    }
    let TodaysAttendanceLog = await WebAttendaneLog.FetchEntireListByCompanyRefAndAttendanceLogType(this.companyRef(), AttendanceLogType.TodaysAttendanceLog, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = TodaysAttendanceLog.filter((data) => data.p.EmployeeRef == this.Entity.p.EmployeeRef)
  }

  // On Week Selected
  selectWeek = async () => {
    this.AttendanceLogCount.p.TotalDaysInWeek = 0;
    this.AttendanceLogCount.p.TotalDaysInMonth = 0;
    this.AttendanceLogCount.p.Present = 0;
    this.AttendanceLogCount.p.Absent = 0;
    this.AttendanceLogCount.p.OnLeave = 0;
    this.DisplayMasterList = [];
  }

  getWeekWiseAttendanceLogByAttendanceListType = async () => {
    this.resetSummaryStats();

    if (this.Entity.p.EmployeeRef <= 0) {
      await this.uiUtils.showErrorToster('Employee not Selected');
      return;
    }

    let WeeklyAttendanceLog = await WebAttendaneLog.FetchEntireListByCompanyRefAndAttendanceLogTypeAndEmployee(this.companyRef(), AttendanceLogType.WeeklyAttendanceLog, this.Entity.p.EmployeeRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = WeeklyAttendanceLog
    this.getAttendanceCount(AttendanceLogType.WeeklyAttendanceLog);
  }
  // On Month selected
  onEmployeeChange(): void {
    this.Entity.p.Months = 0;
  }

  selectMonth = async () => {
    this.AttendanceLogCount.p.TotalDaysInWeek = 0;
    this.AttendanceLogCount.p.TotalDaysInMonth = 0;
    this.AttendanceLogCount.p.Present = 0;
    this.AttendanceLogCount.p.Absent = 0;
    this.AttendanceLogCount.p.OnLeave = 0;
    this.Entity.p.Months = 0;
    this.DisplayMasterList = [];
  }

  getMonthWiseAttendanceLogByAttendanceListType = async () => {
    this.resetSummaryStats();
    this.DisplayMasterList = [];

    if (this.Entity.p.EmployeeRef <= 0) {
      await this.uiUtils.showErrorToster('Employee not Selected');
      return;
    }
    if (this.Entity.p.Months <= 0) {
      return;
    }
    let MonthlyAttendanceLog = await WebAttendaneLog.FetchEntireListByCompanyRefAndAttendanceLogTypeAndMonth(this.companyRef(), AttendanceLogType.MonthlyAttendanceLog,
      this.Entity.p.Months, this.Entity.p.EmployeeRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = MonthlyAttendanceLog
    this.getAttendanceCount(AttendanceLogType.MonthlyAttendanceLog)
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
        return data.p.EmployeeName.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }

  onEditClicked = async (item: WebAttendaneLog) => {
    if (item.p.IsEntryNonEditable) {
      this.uiUtils.showWarningToster("This Record Can't be Editable");
      return;
    }
    this.SelectedAttendance = item.GetEditableVersion();
    WebAttendaneLog.SetCurrentInstance(this.SelectedAttendance);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    this.router.navigate(['/homepage/Website/Attendance_Logs_Details']);
  };

  get headers(): string[] {
    // if (this.isTodayAttendanceView || this.ToDisplayWeeklyRequirement) {
    //   return [...this.baseHeaders, 'On Leave', 'Leave Type', 'Status', 'Action'];
    // }
    // return this.baseHeaders;
    return [...this.baseHeaders, 'Leave Type', 'Status'];
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  getAttendanceCount = async (AttendanceLogType: number) => {
    this.AttendanceLogCount.p.TeamSize = 0
    this.AttendanceLogCount.p.Present = 0
    this.AttendanceLogCount.p.Absent = 0
    this.AttendanceLogCount.p.OnLeave = 0
    this.AttendanceLogCount.p.TotalDaysInMonth = 0
    this.AttendanceLogCount.p.TotalDaysInWeek = 0
    let lst = await AttendanceLogsCount.FetchEntireListByCompanyRefAndAttendanceLogTypeAndMonth(this.companyRef(), AttendanceLogType, this.Entity.p.Months, this.Entity.p.EmployeeRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.AttendanceLogCount.p.TeamSize = lst[0]?.p?.TeamSize
    this.AttendanceLogCount.p.Present = lst[0]?.p?.Present
    this.AttendanceLogCount.p.Absent = lst[0]?.p?.Absent
    this.AttendanceLogCount.p.OnLeave = lst[0]?.p?.OnLeave
    this.AttendanceLogCount.p.TotalDaysInMonth = lst[0]?.p?.TotalDaysInMonth
    this.AttendanceLogCount.p.TotalDaysInWeek = lst[0]?.p?.TotalDaysInWeek
  }

  AddAttendance = () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showWarningToster('Please select company');
      return;
    }
    this.router.navigate(['/homepage/Website/Attendance_Logs_Details']);
  }

  resetSummaryStats() {
    this.Entity.p.TeamSize = 0;
    this.Entity.p.Present = 0;
    this.Entity.p.Absent = 0;
    this.Entity.p.OnLeave = 0;
    this.Entity.p.TotalDaysInWeek = 0;
    this.Entity.p.TotalDaysInMonth = 0;
  }
}
