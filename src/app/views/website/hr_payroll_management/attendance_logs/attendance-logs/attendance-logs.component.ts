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
  selector: 'app-attendance-logs',
  templateUrl: './attendance-logs.component.html',
  styleUrls: ['./attendance-logs.component.scss'],
  standalone: false,
})
export class AttendanceLogsComponent implements OnInit {
  Entity: WebAttendaneLog = WebAttendaneLog.CreateNewInstance();
  AttendanceLogCount: AttendanceLogsCount = AttendanceLogsCount.CreateNewInstance();
  MasterList: WebAttendaneLog[] = [];
  DisplayMasterList: WebAttendaneLog[] = [];
  SelectedAttendance: WebAttendaneLog = WebAttendaneLog.CreateNewInstance();

  // headers as per required
  baseHeaders: string[] = ['Sr. no', 'Employee Name', 'Date', 'First Check In Time', 'Last Check Out Time', 'Total Time'];

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
    private DateconversionService: DateconversionService,
    private router: Router,
    private appStateManage: AppStateManageService,
    private utils: Utils,
  ) {
    effect(async () => {
      await this.getTodayAttendanceLogByAttendanceListType(); this.getEmployeeListByCompanyRef();
    });
  }

  ngOnInit() {
    this.loadPaginationData();
    this.appStateManage.setDropdownDisabled();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
    this.isTodayAttendanceView = true;
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
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let TodaysAttendanceLog = await WebAttendaneLog.FetchEntireListByCompanyRefAndAttendanceLogType(this.companyRef(), AttendanceLogType.TodaysAttendanceLog, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = TodaysAttendanceLog
    this.getAttendanceCount(AttendanceLogType.TodaysAttendanceLog)
  }

  // On Week Selected
  selectWeek = async () => {
    this.Entity.p.EmployeeRef = 0;
    this.AttendanceLogCount.p.TotalDaysInWeek = 0;
    this.AttendanceLogCount.p.TotalDaysInMonth = 0;
    this.AttendanceLogCount.p.Present = 0;
    this.AttendanceLogCount.p.Absent = 0;
    this.AttendanceLogCount.p.OnLeave = 0;
    this.DisplayMasterList = [];
    this.ToDispayMonthlyRequirement = false;
    this.ToDisplayWeeklyRequirement = true;
    this.isTodayAttendanceView = false;
    this.isShowMonthlyData = false
    this.isDaysShow = true
    this.isDaysShowMonth = false
  }

  ChangeAttendanceStatus = async (Entity: WebAttendaneLog) => {
    await this.uiUtils.showConfirmationMessage(
      'Approval',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to Approve this Attendance?`,
      async () => {
        this.Entity = Entity;
        this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
        this.Entity.p.IsAttendanceVerified = true;
        let entityToSave = this.Entity.GetEditableVersion();
        let entitiesToSave = [entityToSave]
        let tr = await this.utils.SavePersistableEntities(entitiesToSave);
        if (!tr.Successful) {
          this.uiUtils.showErrorMessage('Error', tr.Message);
          Entity.p.IsAttendanceVerified = false;
          return
        }
        else {
          if (this.isTodayAttendanceView) {
            this.getTodayAttendanceLogByAttendanceListType()
          } else if (this.ToDisplayWeeklyRequirement) {
            this.getWeekWiseAttendanceLogByAttendanceListType();
          } else if (this.ToDispayMonthlyRequirement) {
            this.getMonthWiseAttendanceLogByAttendanceListType();
          }
          await this.uiUtils.showSuccessToster('Attendance Updated successfully');
        }
      }
    );
  }

  getWeekWiseAttendanceLogByAttendanceListType = async () => {
    this.resetSummaryStats();
    this.ToDispayMonthlyRequirement = false;
    this.isTodayAttendanceView = false;
    this.isShowMonthlyData = false;

    let employeeref = this.Entity.p.EmployeeRef

    let WeeklyAttendanceLog = await WebAttendaneLog.FetchEntireListByCompanyRefAndAttendanceLogTypeAndEmployee(this.companyRef(), AttendanceLogType.WeeklyAttendanceLog, employeeref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = WeeklyAttendanceLog
    this.getAttendanceCount(AttendanceLogType.WeeklyAttendanceLog);
  }
  // On Month selected
  onEmployeeChange(): void {
    this.Entity.p.Months = 0;
  }

  selectMonth = async () => {
    this.Entity.p.EmployeeRef = 0;
    this.AttendanceLogCount.p.TotalDaysInWeek = 0;
    this.AttendanceLogCount.p.TotalDaysInMonth = 0;
    this.AttendanceLogCount.p.Present = 0;
    this.AttendanceLogCount.p.Absent = 0;
    this.AttendanceLogCount.p.OnLeave = 0;
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

    let MonthlyAttendanceLog = await WebAttendaneLog.FetchEntireListByCompanyRefAndAttendanceLogTypeAndMonth(this.companyRef(), AttendanceLogType.MonthlyAttendanceLog,
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

  onEditClicked = async (item: WebAttendaneLog) => {
    this.SelectedAttendance = item.GetEditableVersion();
    WebAttendaneLog.SetCurrentInstance(this.SelectedAttendance);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    this.router.navigate(['/homepage/Website/Attendance_Details']);
  };

  get headers(): string[] {
    // if (this.isTodayAttendanceView || this.ToDisplayWeeklyRequirement) {
    //   return [...this.baseHeaders, 'On Leave', 'Leave Type', 'Status', 'Action'];
    // }
    // return this.baseHeaders;
    return [...this.baseHeaders, 'On Leave', 'Leave Type', 'Status', 'Action'];
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  // CustomFetchRequest
  // getAttendanceCount = async (AttendanceLogType: number) => {
  //   // let tranDate = this.dtu.ConvertStringDateToFullFormat(this.Date!)
  //   let req = new AttendanceLogCountCustomRequest();
  //   // req.TransDateTime = tranDate;
  //   req.CompanyRef = this.companyRef();
  //   req.EmployeeRef = this.Entity.p.EmployeeRef;
  //   req.Months = this.Entity.p.Months
  //   req.AttendanceLogTypes = AttendanceLogType

  //   let td = req.FormulateTransportData();
  //   let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
  //   let tr = await this.serverCommunicator.sendHttpRequest(pkt);

  //   if (!tr.Successful) {
  //     await this.uiUtils.showErrorMessage('Error', tr.Message);
  //     return;
  //   }
  //   let tdResult = JSON.parse(tr.Tag) as TransportData;
  //   let res = AttendanceLogCountCustomRequest.FromTransportData(tdResult);

  //   const summaryCollection = tdResult.MainData?.Collections?.find((c: any) =>
  //     c?.Name === '' && c?.Entries?.length > 0
  //   );

  //   if (summaryCollection && summaryCollection.Entries.length > 0) {
  //     let DailyRecord: AttendanceLogsProps[] = res.Data as AttendanceLogsProps[];
  //     Object.assign(this.Entity.p, summaryCollection.Entries[0]);

  //   }
  // }


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
    this.router.navigate(['/homepage/Website/Attendance_Details']);
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
