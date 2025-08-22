import { IPersistable } from "src/app/classes/infrastructure/IPersistable";
import { DataContainer } from "src/app/classes/infrastructure/datacontainer";
import { DataContainerService } from "src/app/classes/infrastructure/datacontainer.service";
import { PayloadPacketFacade } from "src/app/classes/infrastructure/payloadpacket/payloadpacketfacade";
import { TransportData } from "src/app/classes/infrastructure/transportdata";
import { ValidationResultAccumulator } from "src/app/classes/infrastructure/validationresultaccumulator";
import { IdProvider } from "src/app/services/idprovider.service";
import { ServerCommunicatorService } from "src/app/services/server-communicator.service";
import { Utils } from "src/app/services/utils.service";
import { isNullOrUndefined } from "src/tools";
import { UIUtils } from "src/app/services/uiutils.service";
import { RequestTypes } from "src/app/classes/infrastructure/enums";
import { WebAttendaneLogFetchRequest } from "./webattendancelogfetchrequest";
import { WebAttendaneLogDetailsLogProps } from "../web_attendance_log_details/webattendancelogdetails";


export class WebAttendaneLogProps {
  public readonly Db_Table_Name = "AttendanceLog";

  public CreatedBy: number = 0;
  public CreatedDate: string = '';
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedDate: string = '';
  public UpdatedByName: number = 0;

  public Months: number = 0;

  public AttendanceLogPath1: string = '';
  public AttendanceLogPath2: string = '';

  public Ref: number = 0;
  public EmployeeRef: number = 0;
  public EmployeeName: string = '';
  public CompanyRef: number = 0;
  public readonly CompanyName: string = '';
  public TransDateTime: string = '';

  public TotalWorkingHrs: number = 0;
  public DisplayTotalWorkingHrs: string = '0h 00m';

  public IsAttendanceVerified: boolean = false;

  public IsLateMark: boolean = false;
  public TotalLateMarkHrs: number = 0;
  public DisplayTotalLateMarkHrs: string = '0h 00m';

  public FirstCheckInTime: string = '';
  public LastCheckOutTime: string = '';

  public IsAbsent: boolean = false;
  public IsEntryNonEditable: boolean = false;

  public IsLeave: boolean = false;
  public IsHalfDay: number = 0;
  public LeaveType: number = 0;
  public LeaveTypeName: string = '';
  public OnLeave: number = 0;
  public AttendanceLogDetailsArray: WebAttendaneLogDetailsLogProps[] = [];

  public TeamSize: number = 0;
  public Present: number = 0;
  public Absent: number = 0;
  public OnLeaveDaily: number = 0;
  public TotalDaysInWeek: number = 0;
  public TotalDaysInMonth: number = 0;


  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new WebAttendaneLogProps(true);
  }
}

export class WebAttendaneLog implements IPersistable<WebAttendaneLog> {
  public static readonly Db_Table_Name: string = 'AttendanceLog';

  constructor(public readonly p: WebAttendaneLogProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): WebAttendaneLog {
    let newState: WebAttendaneLogProps = Utils.GetInstance().DeepCopy(this.p);
    return WebAttendaneLog.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new WebAttendaneLog(WebAttendaneLogProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new WebAttendaneLog(data as WebAttendaneLogProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, WebAttendaneLog.Db_Table_Name, this.p);
  }

  private static m_currentInstance: WebAttendaneLog = WebAttendaneLog.CreateNewInstance();

  public static GetCurrentInstance() {
    return WebAttendaneLog.m_currentInstance;
  }

  public static SetCurrentInstance(value: WebAttendaneLog) {
    WebAttendaneLog.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): WebAttendaneLog {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, WebAttendaneLog.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, WebAttendaneLog.Db_Table_Name)!.Entries) {
        return WebAttendaneLog.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): WebAttendaneLog[] {
    let result: WebAttendaneLog[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, WebAttendaneLog.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, WebAttendaneLog.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(WebAttendaneLog.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): WebAttendaneLog[] {
    return WebAttendaneLog.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: WebAttendaneLogFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdRequest = req.FormulateTransportData();
    let pktRequest = PayloadPacketFacade.GetInstance().CreateNewPayloadPacket2(tdRequest);

    let tr = await ServerCommunicatorService.GetInstance().sendHttpRequest(pktRequest);
    if (!tr.Successful) {
      if (!isNullOrUndefined(errorHandler)) await errorHandler(tr.Message);
      return null;
    }

    let tdResponse = JSON.parse(tr.Tag) as TransportData;
    return tdResponse;
  }

  public static async FetchInstance(ref: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new WebAttendaneLogFetchRequest();
    req.WebAttendaneLogRefs.push(ref);

    let tdResponse = await WebAttendaneLog.FetchTransportData(req, errorHandler) as TransportData;
    return WebAttendaneLog.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: WebAttendaneLogFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await WebAttendaneLog.FetchTransportData(req, errorHandler) as TransportData;
    return WebAttendaneLog.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new WebAttendaneLogFetchRequest();
    let tdResponse = await WebAttendaneLog.FetchTransportData(req, errorHandler) as TransportData;
    return WebAttendaneLog.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new WebAttendaneLogFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await WebAttendaneLog.FetchTransportData(req, errorHandler) as TransportData;
    return WebAttendaneLog.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRefAndAttendanceLogType(CompanyRef: number, AttendanceLogTypes: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new WebAttendaneLogFetchRequest();
    req.CompanyRefs.push(CompanyRef);
    req.AttendanceLogTypes.push(AttendanceLogTypes);
    let tdResponse = await WebAttendaneLog.FetchTransportData(req, errorHandler) as TransportData;
    return WebAttendaneLog.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRefAndAttendanceLogTypeAndEmployee(CompanyRef: number, AttendanceLogTypes: number, EmployeeRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new WebAttendaneLogFetchRequest();
    req.CompanyRefs.push(CompanyRef);
    req.EmployeeRefs.push(EmployeeRef);
    req.AttendanceLogTypes.push(AttendanceLogTypes);
    let tdResponse = await WebAttendaneLog.FetchTransportData(req, errorHandler) as TransportData;
    return WebAttendaneLog.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRefAndAttendanceLogTypeAndMonth(CompanyRef: number, AttendanceLogTypeRef: number, monthref: number, employeeref: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new WebAttendaneLogFetchRequest();
    req.CompanyRefs.push(CompanyRef);
    req.AttendanceLogTypes.push(AttendanceLogTypeRef);
    if (monthref) {
      req.Months.push(monthref);
    }
    req.EmployeeRefs.push(employeeref);
    let tdResponse = await WebAttendaneLog.FetchTransportData(req, errorHandler) as TransportData;
    return WebAttendaneLog.ListFromTransportData(tdResponse);
  }

  public async DeleteInstance(successHandler: () => Promise<void> = null!, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdRequest = new TransportData();
    tdRequest.RequestType = RequestTypes.Deletion;

    this.MergeIntoTransportData(tdRequest);
    let pktRequest = PayloadPacketFacade.GetInstance().CreateNewPayloadPacket2(tdRequest);

    let tr = await ServerCommunicatorService.GetInstance().sendHttpRequest(pktRequest);
    if (!tr.Successful) {
      if (!isNullOrUndefined(errorHandler)) await errorHandler(tr.Message);
    }
    else {
      if (!isNullOrUndefined(successHandler)) await successHandler();
    }
  }

}
