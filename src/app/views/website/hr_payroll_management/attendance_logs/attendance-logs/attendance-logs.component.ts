import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttendenceLogType, DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { AttendanceLogCountCustomRequest } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogcountcustomrequest';
import { AttendanceLogs, AttendanceLogsProps } from 'src/app/classes/domain/entities/website/HR_and_Payroll/attendancelogs/attendancelogs';
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

  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  SearchString: string = '';
  headers: string[] = ['Sr. no', 'Employee Name', 'Date', 'Check In Time', 'Check Out Time', 'Total Time','In OfficeHours','On leave',''];

  employeeDataList : [] = []

  AttendanceLogTypeList = DomainEnums.AttendenceLogTypeList(
    true,
    '--Select Attendance Log Type--'
  );

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  ToDispayMonthlyRequirement: boolean = false
  ToDispayWeeklyRequirement: boolean = false
  isTodayView: boolean = false;

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService, private companystatemanagement: CompanyStateManagement,
    private utils: Utils, private dtu: DTU,
    private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService
  ) {
    effect(async () => {
      await this.getattendancelogbycompanyref();
    });
  }

  ngOnInit() {
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
    this.getAttendanceCount()
    this.isTodayView = true;
  }

  getattendancelogbycompanyref = async () => {
    let lst = await AttendanceLogs.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    console.log(this.DisplayMasterList);
    this.loadPaginationData();
  }
  getTodayAttendanceLogByAttendanceListType = async () => {
    this.ToDispayMonthlyRequirement = false;
    this.ToDispayWeeklyRequirement = false;
    this.isTodayView = true;
    let TodaysAttendanceLog = await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogType(this.companyRef(), AttendenceLogType.TodaysAttendanceLog, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = TodaysAttendanceLog
  }

  getWeekWiseAttendanceLogByAttendanceListType = async () => {
    this.ToDispayMonthlyRequirement = false;
    this.ToDispayWeeklyRequirement = true;
    this.isTodayView = false;
    let WeeklyAttendanceLog = await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogType(this.companyRef(), AttendenceLogType.WeeklyAttendanceLog, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = WeeklyAttendanceLog
  }
  getMonthWiseAttendanceLogByAttendanceListType = async () => {
    this.ToDispayMonthlyRequirement = true;
    this.ToDispayWeeklyRequirement = false;
    this.isTodayView = false;
    let MonthlyAttendanceLog = await AttendanceLogs.FetchEntireListByCompanyRefAndAttendanceLogType(this.companyRef(), AttendenceLogType.MonthlyAttendanceLog, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = MonthlyAttendanceLog
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

  // CustomFetchRequest
  attendanceCount: number = 0;
  getAttendanceCount = async () => {
    // let tranDate = this.dtu.ConvertStringDateToFullFormat(this.Date!)
    let req = new AttendanceLogCountCustomRequest();
    // req.TransDateTime = tranDate;
    req.CompanyRef = this.companyRef();
    // req.EmployeeRef = this.employeeRef;

    let td = req.FormulateTransportData();
    let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
    let tr = await this.serverCommunicator.sendHttpRequest(pkt);

    if (!tr.Successful) {
      await this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    }
    let tdResult = JSON.parse(tr.Tag) as TransportData;
    let res = AttendanceLogCountCustomRequest.FromTransportData(tdResult)

    console.log("Total Attendance Logs:", res.Count);
    // You can also bind this count to your component state
    this.attendanceCount = res.Count;
  }
}
