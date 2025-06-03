import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttendanceLogType, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLogCountCustomRequest } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogcountcustomrequest';
import { AttendanceLogs, AttendanceLogsProps } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogs';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

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

  pageSize: number = 10; // Items per page
  currentPage: number = 1; // Initialize current page
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

  constructor(
    private uiUtils: UIUtils,
    private screenSizeService: ScreenSizeService, private companystatemanagement: CompanyStateManagement,
    private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService,
    private router: Router,
  ) {
    effect(async () => {
      await this.getTodayAttendanceLogByAttendanceListType();
    });
  }

  ngOnInit() {
    this.loadPaginationData();
    this.getEmployeeListByCompanyRef()
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
    this.isTodayAttendanceView = true;
  }

  getEmployeeListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
  }

  getTodayAttendanceLogByAttendanceListType = async () => {
    this.isDaysShowMonth = false
    this.isDaysShow = false
    this.resetSummaryStats();
    this.ToDispayMonthlyRequirement = false;
    this.ToDisplayWeeklyRequirement = false;
    this.isTodayAttendanceView = true;
    this.isShowMonthlyData = false;

    let TodaysAttendanceLog = await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogType(this.companyRef(), AttendanceLogType.TodaysAttendanceLog, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = TodaysAttendanceLog
    this.getAttendanceCount(AttendanceLogType.TodaysAttendanceLog)
  }

  // On Week Selected
  selectWeek = async () => {
    this.Entity.p.EmployeeRef = 0;
    this.DisplayMasterList = [];
    this.ToDispayMonthlyRequirement = false;
    this.ToDisplayWeeklyRequirement = true;
    this.isTodayAttendanceView = false;
    this.isShowMonthlyData = false
    this.isDaysShow = true
    this.isDaysShowMonth = false
  }

  getWeekWiseAttendanceLogByAttendanceListType = async () => {
    this.resetSummaryStats();
    this.ToDispayMonthlyRequirement = false;
    this.isTodayAttendanceView = false;
    this.isShowMonthlyData = false;

    let employeeref = this.Entity.p.EmployeeRef

    let WeeklyAttendanceLog = await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogTypeAndEmployee(this.companyRef(), AttendanceLogType.WeeklyAttendanceLog, employeeref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = WeeklyAttendanceLog
    this.getAttendanceCount(AttendanceLogType.WeeklyAttendanceLog);
  }
  // On Month selected
  onEmployeeChange(): void {
    this.Entity.p.Months = 0;
  }

  selectMonth = async () => {
    this.Entity.p.EmployeeRef = 0;
    this.Entity.p.Months = 0;
    this.DisplayMasterList = [];
    this.ToDispayMonthlyRequirement = true;
    this.ToDisplayWeeklyRequirement = false;
    this.isTodayAttendanceView = false;
    this.isShowMonthlyData = true
    this.isDaysShow = false
    this.isDaysShowMonth = true
  }

  getMonthWiseAttendanceLogByAttendanceListType = async () => {
    this.resetSummaryStats();
    this.DisplayMasterList = [];
    this.ToDispayMonthlyRequirement = true;
    this.ToDisplayWeeklyRequirement = false;
    this.isTodayAttendanceView = false;

    const month = this.Entity.p.Months;
    const employeeref = this.Entity.p.EmployeeRef;

    let MonthlyAttendanceLog = await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogTypeAndMonth(this.companyRef(), AttendanceLogType.MonthlyAttendanceLog,
      month, employeeref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = MonthlyAttendanceLog
    this.getAttendanceCount(AttendanceLogType.MonthlyAttendanceLog)
  }

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  }

  get paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  }

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

  // headers as per required
  baseHeaders: string[] = ['Sr. no', 'Employee Name', 'Date', 'Check In Time', 'Check Out Time', 'Total Time', 'In OfficeHours'];
  get headers(): string[] {
    if (this.isTodayAttendanceView) {
      return [...this.baseHeaders, 'On Leave', 'Leave Type'];
    }
    return this.baseHeaders;
  }

  // CustomFetchRequest
  getAttendanceCount = async (AttendanceLogType: number) => {
    // let tranDate = this.dtu.ConvertStringDateToFullFormat(this.Date!)
    let req = new AttendanceLogCountCustomRequest();
    // req.TransDateTime = tranDate;
    req.CompanyRef = this.companyRef();
    req.EmployeeRef = this.Entity.p.EmployeeRef;
    req.Months = this.Entity.p.Months
    req.AttendanceLogTypes = AttendanceLogType

    let td = req.FormulateTransportData();
    let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
    let tr = await this.serverCommunicator.sendHttpRequest(pkt);

    if (!tr.Successful) {
      await this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    }
    let tdResult = JSON.parse(tr.Tag) as TransportData;
    let res = AttendanceLogCountCustomRequest.FromTransportData(tdResult);

    const summaryCollection = tdResult.MainData?.Collections?.find((c: any) =>
      c?.Name === '' && c?.Entries?.length > 0
    );

    if (summaryCollection && summaryCollection.Entries.length > 0) {
      let DailyRecord: AttendanceLogsProps[] = res.Data as AttendanceLogsProps[];
      Object.assign(this.Entity.p, summaryCollection.Entries[0]);

    }
  }

  AddAttendance = () => {
    this.router.navigate(['/homepage/Website/Attendance_Details']);
  }

  resetSummaryStats() {
    this.Entity.p.TeamSize = 0;
    this.Entity.p.Present = 0;
    this.Entity.p.Absent = 0;
    this.Entity.p.OnLeaveDaily = 0;
    this.Entity.p.TotalDaysInWeek = 0;
    this.Entity.p.TotalDaysInMonth = 0;
  }
}
