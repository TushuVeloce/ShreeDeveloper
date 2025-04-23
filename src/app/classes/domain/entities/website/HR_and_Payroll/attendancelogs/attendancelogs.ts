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
import { AttendanceLogsFetchRequest } from "./attendancelogsfetchrequest";


export class AttendanceLogsProps {
  public readonly Db_Table_Name = "AttendanceLogsMaster";
  public Ref: number = 0;
  public EmployeeRef: number = 0;
  public TransDateTime: string = '';
  public FirstCheckInTime: string = '';
  public LastCheckOutTime: string = '';
  public TotalWorkingHrs: string = '';
  public TotalOvertimeHours: string = '';
  public InOfficeHrs: string = '';
  public OnLeave: string = '';
  public LeaveType: string = '';

  public TeamSize: number = 0;
  public Present: number = 0;
  public Absent: number = 0;
  public OnLeaveDaily: number = 0;

  public Months: number = 0;

  // for photo uploaded
  public attendacelogpath1 : string = '';
  public attendacelogpath2 : string = '';

  public readonly IsNewlyCreated: boolean = false;
  public readonly EmployeeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new AttendanceLogsProps(true);
  }
}

export class AttendanceLogs implements IPersistable<AttendanceLogs> {
  public static readonly Db_Table_Name: string = 'AttendanceLog';

  private constructor(public readonly p: AttendanceLogsProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): AttendanceLogs {
    let newState: AttendanceLogsProps = Utils.GetInstance().DeepCopy(this.p);
    return AttendanceLogs.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new AttendanceLogs(AttendanceLogsProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new AttendanceLogs(data as AttendanceLogsProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.FirstCheckInTime == '') vra.add('CheckInTime', 'Check In Time cannot be blank.');
    if (this.p.LastCheckOutTime == '') vra.add('CheckOutTime', 'Check Out Time cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, AttendanceLogs.Db_Table_Name, this.p);
  }

  private static m_currentInstance: AttendanceLogs = AttendanceLogs.CreateNewInstance();

  public static GetCurrentInstance() {
    return AttendanceLogs.m_currentInstance;
  }

  public static SetCurrentInstance(value: AttendanceLogs) {
    AttendanceLogs.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): AttendanceLogs {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, AttendanceLogs.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, AttendanceLogs.Db_Table_Name)!.Entries) {
        return AttendanceLogs.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): AttendanceLogs[] {
    let result: AttendanceLogs[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, AttendanceLogs.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, AttendanceLogs.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(AttendanceLogs.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): AttendanceLogs[] {
    return AttendanceLogs.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: AttendanceLogsFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new AttendanceLogsFetchRequest();
    req.AttendanceLogTypes.push(ref);

    let tdResponse = await AttendanceLogs.FetchTransportData(req, errorHandler) as TransportData;
    return AttendanceLogs.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: AttendanceLogsFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await AttendanceLogs.FetchTransportData(req, errorHandler) as TransportData;
    return AttendanceLogs.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new AttendanceLogsFetchRequest();
    let tdResponse = await AttendanceLogs.FetchTransportData(req, errorHandler) as TransportData;
    return AttendanceLogs.ListFromTransportData(tdResponse);
  }

 public static async FetchEntireListByCompanyRef(CompanyRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new AttendanceLogsFetchRequest();
    req.CompanyRefs.push(CompanyRef);
    let tdResponse = await AttendanceLogs.FetchTransportData(req, errorHandler) as TransportData;
    return AttendanceLogs.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByCompanyRefAndAttendanceLogType(CompanyRef:number,AttendanceLogTypes:number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new AttendanceLogsFetchRequest();
    req.CompanyRefs.push(CompanyRef);
    req.AttendanceLogTypes.push(AttendanceLogTypes);
    let tdResponse = await AttendanceLogs.FetchTransportData(req, errorHandler) as TransportData;
    return AttendanceLogs.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRefAndAttendanceLogTypeAndMonth(CompanyRef:number,AttendanceLogTypeRef:number, monthref:number, employeeref:number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new AttendanceLogsFetchRequest();
    req.CompanyRefs.push(CompanyRef);
    req.AttendanceLogTypes.push(AttendanceLogTypeRef);
    req.Months.push(monthref);
    req.EmployeeRefs.push(employeeref);
    let tdResponse = await AttendanceLogs.FetchTransportData(req, errorHandler) as TransportData;
    return AttendanceLogs.ListFromTransportData(tdResponse);
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
