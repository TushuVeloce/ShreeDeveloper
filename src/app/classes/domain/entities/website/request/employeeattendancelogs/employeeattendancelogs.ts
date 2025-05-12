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
import { EmployeeAttendanceLogsFetchRequest } from "./employeeattendancelogsfetchrequest";


export class EmployeeAttendanceLogsProps {
  public readonly Db_Table_Name = "EmployeeAttendanceLogsMaster";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public EmployeeRef: number = 0;
  public TransDateTime: string = '';
  public CheckInTime: string = '';
  public CheckOutTime: string = '';
  public TotalWorkingHours: string = '';
  public TotalOvertimeHours: string = '';

  // for photo uploaded
  public attendacelogpath1: string = '';
  public attendacelogpath2: string = '';

  public readonly IsNewlyCreated: boolean = false;
  public readonly EmployeeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new EmployeeAttendanceLogsProps(true);
  }
}

export class EmployeeAttendanceLogs implements IPersistable<EmployeeAttendanceLogs> {
  public static readonly Db_Table_Name: string = 'EmployeeAttendanceLogsMaster';

  private constructor(public readonly p: EmployeeAttendanceLogsProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): EmployeeAttendanceLogs {
    let newState: EmployeeAttendanceLogsProps = Utils.GetInstance().DeepCopy(this.p);
    return EmployeeAttendanceLogs.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new EmployeeAttendanceLogs(EmployeeAttendanceLogsProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new EmployeeAttendanceLogs(data as EmployeeAttendanceLogsProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.CheckInTime == '') vra.add('CheckInTime', 'Check In Time cannot be blank.');
    if (this.p.CheckOutTime == '') vra.add('CheckOutTime', 'Check Out Time cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, EmployeeAttendanceLogs.Db_Table_Name, this.p);
  }

  private static m_currentInstance: EmployeeAttendanceLogs = EmployeeAttendanceLogs.CreateNewInstance();

  public static GetCurrentInstance() {
    return EmployeeAttendanceLogs.m_currentInstance;
  }

  public static SetCurrentInstance(value: EmployeeAttendanceLogs) {
    EmployeeAttendanceLogs.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): EmployeeAttendanceLogs {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, EmployeeAttendanceLogs.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, EmployeeAttendanceLogs.Db_Table_Name)!.Entries) {
        return EmployeeAttendanceLogs.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): EmployeeAttendanceLogs[] {
    let result: EmployeeAttendanceLogs[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, EmployeeAttendanceLogs.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, EmployeeAttendanceLogs.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(EmployeeAttendanceLogs.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): EmployeeAttendanceLogs[] {
    return EmployeeAttendanceLogs.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: EmployeeAttendanceLogsFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new EmployeeAttendanceLogsFetchRequest();
    req.EmployeeAttendanceLogsRefs.push(ref);

    let tdResponse = await EmployeeAttendanceLogs.FetchTransportData(req, errorHandler) as TransportData;
    return EmployeeAttendanceLogs.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: EmployeeAttendanceLogsFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await EmployeeAttendanceLogs.FetchTransportData(req, errorHandler) as TransportData;
    return EmployeeAttendanceLogs.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new EmployeeAttendanceLogsFetchRequest();
    let tdResponse = await EmployeeAttendanceLogs.FetchTransportData(req, errorHandler) as TransportData;
    return EmployeeAttendanceLogs.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new EmployeeAttendanceLogsFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await EmployeeAttendanceLogs.FetchTransportData(req, errorHandler) as TransportData;
    return EmployeeAttendanceLogs.ListFromTransportData(tdResponse);
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
