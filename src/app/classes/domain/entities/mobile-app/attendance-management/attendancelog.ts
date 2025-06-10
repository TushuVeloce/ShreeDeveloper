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
import { AttendanceLogFetchRequest } from "./attendancelogfetchrequest";
import { AttendanceLocationType } from "../../../domainenums/domainenums";


export class AttendanceLogProps {
  public Ref: number = 0;
  public EmployeeRef: number = 0;
  public CompanyRef: number = 0;
  public TransDateTime: string = '';
  public SiteRef: number = 0;
  public TotalWorkingHrs: number = 0;
  public IsLateMark: number = 0;
  public TotalLateMarkHrs: number = 0;
  public IsOverTime: number = 0;
  public TotalOvertimeHrs: number = 0;
  public FirstCheckInTime: string = '';
  public CheckOutTime: string = '';
  public CheckInTime: string = '';
  public LastCheckOutTime: string = '';
  public AttendanceLogPath1: string = '';
  public AttendanceLogPath2: string = '';
  public FromTime: string = '';
  public IsLeave: number = 0;
  public IsHalfDay: number = 0;
  public AttendanceLocationType: number = 0;
  public WorkingHrs: number = 0;
  public HandleBy: number = 0;
  public CreatedBy: number = 0;
  public UpdatedBy: number = 0;
  public readonly EmployeeName: string = '';
  public readonly SiteName: string = '';
  public readonly CompanyName: string = '';
  public IsCheckIn = false;

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new AttendanceLogProps(true);
  }
}

export class AttendanceLog implements IPersistable<AttendanceLog> {
  public static readonly Db_Table_Name: string = 'AttendanceLog';

  private constructor(public readonly p: AttendanceLogProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): AttendanceLog {
    let newState: AttendanceLogProps = Utils.GetInstance().DeepCopy(this.p);
    return AttendanceLog.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new AttendanceLog(AttendanceLogProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new AttendanceLog(data as AttendanceLogProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company cannot be blank.');
    if (this.p.EmployeeRef == 0) vra.add('EmployeeRef', 'Employee cannot be blank.');
    // if (this.p.FromTime == '') vra.add('FromTime', 'From Date cannot be blank.');
    // if (this.p.AttendanceLocationType == 0) vra.add('AttendanceLocationType', 'Attendance Location Type cannot be blank.');
    if (this.p.AttendanceLocationType == AttendanceLocationType.Site && this.p.SiteRef == 0) vra.add('SiteRef', 'Site cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, AttendanceLog.Db_Table_Name, this.p);
  }

  private static m_currentInstance: AttendanceLog = AttendanceLog.CreateNewInstance();

  public static GetCurrentInstance() {
    return AttendanceLog.m_currentInstance;
  }

  public static SetCurrentInstance(value: AttendanceLog) {
    AttendanceLog.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): AttendanceLog {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, AttendanceLog.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, AttendanceLog.Db_Table_Name)!.Entries) {
        return AttendanceLog.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): AttendanceLog[] {
    let result: AttendanceLog[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, AttendanceLog.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, AttendanceLog.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(AttendanceLog.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): AttendanceLog[] {
    return AttendanceLog.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: AttendanceLogFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new AttendanceLogFetchRequest();
    req.CompanyRefs.push(ref);

    let tdResponse = await AttendanceLog.FetchTransportData(req, errorHandler) as TransportData;
    return AttendanceLog.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: AttendanceLogFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await AttendanceLog.FetchTransportData(req, errorHandler) as TransportData;
    return AttendanceLog.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new AttendanceLogFetchRequest();
    let tdResponse = await AttendanceLog.FetchTransportData(req, errorHandler) as TransportData;
    return AttendanceLog.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(employeeRef: number, CompanyRef: number, TransDateTime: string, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new AttendanceLogFetchRequest();
    req.CompanyRefs.push(CompanyRef);
    req.EmployeeRefs.push(employeeRef);
    req.TransDateTime = TransDateTime;
    let tdResponse = await AttendanceLog.FetchTransportData(req, errorHandler) as TransportData;
    return AttendanceLog.ListFromTransportData(tdResponse);
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
