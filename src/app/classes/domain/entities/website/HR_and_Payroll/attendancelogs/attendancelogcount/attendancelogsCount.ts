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
import { AttendanceLogCountFetchRequest } from "./attendancelogcountfetchrequest";


export class AttendanceLogsCountProps {
  public readonly Db_Table_Name = "AttendanceEvaluator";
  public Ref: number = 0;
  public TeamSize: number = 0;
  public Present: number = 0;
  public Absent: number = 0;
  public OnLeave: number = 0;
  public TotalDaysInWeek: number = 0;
  public TotalDaysInMonth: number = 0;

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
    return new AttendanceLogsCountProps(true);
  }
}

export class AttendanceLogsCount implements IPersistable<AttendanceLogsCount> {
  public static readonly Db_Table_Name: string = 'AttendanceEvaluator';

  private constructor(public readonly p: AttendanceLogsCountProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): AttendanceLogsCount {
    let newState: AttendanceLogsCountProps = Utils.GetInstance().DeepCopy(this.p);
    return AttendanceLogsCount.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new AttendanceLogsCount(AttendanceLogsCountProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new AttendanceLogsCount(data as AttendanceLogsCountProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, AttendanceLogsCount.Db_Table_Name, this.p);
  }

  private static m_currentInstance: AttendanceLogsCount = AttendanceLogsCount.CreateNewInstance();

  public static GetCurrentInstance() {
    return AttendanceLogsCount.m_currentInstance;
  }

  public static SetCurrentInstance(value: AttendanceLogsCount) {
    AttendanceLogsCount.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): AttendanceLogsCount {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, AttendanceLogsCount.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, AttendanceLogsCount.Db_Table_Name)!.Entries) {
        return AttendanceLogsCount.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
   sortPropertyName: string = ""): AttendanceLogsCount[] {
    let result: AttendanceLogsCount[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, AttendanceLogsCount.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, AttendanceLogsCount.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(AttendanceLogsCount.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): AttendanceLogsCount[] {
    return AttendanceLogsCount.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: AttendanceLogCountFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new AttendanceLogCountFetchRequest();
    req.AttendanceLogTypes = ref;

    let tdResponse = await AttendanceLogsCount.FetchTransportData(req, errorHandler) as TransportData;
    return AttendanceLogsCount.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: AttendanceLogCountFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await AttendanceLogsCount.FetchTransportData(req, errorHandler) as TransportData;
    return AttendanceLogsCount.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new AttendanceLogCountFetchRequest();
    let tdResponse = await AttendanceLogsCount.FetchTransportData(req, errorHandler) as TransportData;
    return AttendanceLogsCount.ListFromTransportData(tdResponse);
  }

//  public static async FetchEntireListByCompanyRefAndAttendanceLogType(CompanyRef:number,AttendanceLogTypes:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
//     let req = new AttendanceLogCountFetchRequest();
//     req.CompanyRefs.push(CompanyRef);
//     req.AttendanceLogTypes.push(AttendanceLogTypes);
//     let tdResponse = await AttendanceLogsCount.FetchTransportData(req, errorHandler) as TransportData;
//     return AttendanceLogsCount.ListFromTransportData(tdResponse);
//   }

  // public static async FetchEntireListByCompanyRefAndAttendanceLogTypeAndEmployee(CompanyRef:number,AttendanceLogTypes:number,EmployeeRef:number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
  //   let req = new AttendanceLogCountFetchRequest();
  //   req.CompanyRefs.push(CompanyRef);
  //   req.EmployeeRefs.push(EmployeeRef);
  //   req.AttendanceLogTypes.push(AttendanceLogTypes);
  //   let tdResponse = await AttendanceLogsCount.FetchTransportData(req, errorHandler) as TransportData;
  //   return AttendanceLogsCount.ListFromTransportData(tdResponse);
  // }

  public static async FetchEntireListByCompanyRefAndAttendanceLogTypeAndMonth(CompanyRef:number,AttendanceLogTypeRef:number, monthref:number, employeeref:number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new AttendanceLogCountFetchRequest();
    req.CompanyRef = CompanyRef;
    req.AttendanceLogTypes =  AttendanceLogTypeRef;
    req.Months = monthref;
    req.EmployeeRef = employeeref;
    let tdResponse = await AttendanceLogsCount.FetchTransportData(req, errorHandler) as TransportData;
    return AttendanceLogsCount.ListFromTransportData(tdResponse);
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
