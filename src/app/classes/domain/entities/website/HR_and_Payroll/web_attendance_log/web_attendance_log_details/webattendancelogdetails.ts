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
import { WebAttendaneLogDetailsLogFetchRequest } from "./webattendancelogdetailsfetchrequest";


export class WebAttendaneLogDetailsLogProps {
  public readonly Db_Table_Name = "AttendanceLogDetails";

  public CompanyRef: number = 0;
  public readonly CompanyName: string = '';
  public CreatedBy: number = 0;
  public CreatedDate: string = '';
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedDate: string = '';
  public UpdatedByName: number = 0;

  public Ref: number = 0;
  public AttendanceLogRef: number = 0;
  public CheckInTime: string = '';
  public CheckOutTime: string = '';
  public AttendanceLogPath1: string = '';
  public AttendanceLogPath2: string = '';
  public AttendenceLocationType: number = 0;
  public SiteRef: number = 0;
  public SiteName: string = '';
  public WorkingHrs: number = 0;
  public DisplayWorkingHrs: string = '';
  public CheckOutMode: number = 0;
  public IsCheckOutDone: number = 0;
  public Latitude: string = '';
  public Longitude: string = '';

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new WebAttendaneLogDetailsLogProps(true);
  }
}

export class WebAttendaneLogDetailsLog implements IPersistable<WebAttendaneLogDetailsLog> {
  public static readonly Db_Table_Name: string = 'AttendanceLogDetails';

  constructor(public readonly p: WebAttendaneLogDetailsLogProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): WebAttendaneLogDetailsLog {
    let newState: WebAttendaneLogDetailsLogProps = Utils.GetInstance().DeepCopy(this.p);
    return WebAttendaneLogDetailsLog.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new WebAttendaneLogDetailsLog(WebAttendaneLogDetailsLogProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new WebAttendaneLogDetailsLog(data as WebAttendaneLogDetailsLogProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, WebAttendaneLogDetailsLog.Db_Table_Name, this.p);
  }

  private static m_currentInstance: WebAttendaneLogDetailsLog = WebAttendaneLogDetailsLog.CreateNewInstance();

  public static GetCurrentInstance() {
    return WebAttendaneLogDetailsLog.m_currentInstance;
  }

  public static SetCurrentInstance(value: WebAttendaneLogDetailsLog) {
    WebAttendaneLogDetailsLog.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): WebAttendaneLogDetailsLog {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, WebAttendaneLogDetailsLog.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, WebAttendaneLogDetailsLog.Db_Table_Name)!.Entries) {
        return WebAttendaneLogDetailsLog.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): WebAttendaneLogDetailsLog[] {
    let result: WebAttendaneLogDetailsLog[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, WebAttendaneLogDetailsLog.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, WebAttendaneLogDetailsLog.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(WebAttendaneLogDetailsLog.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): WebAttendaneLogDetailsLog[] {
    return WebAttendaneLogDetailsLog.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: WebAttendaneLogDetailsLogFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new WebAttendaneLogDetailsLogFetchRequest();
    req.WebAttendaneLogDetailsLogRefs.push(ref);

    let tdResponse = await WebAttendaneLogDetailsLog.FetchTransportData(req, errorHandler) as TransportData;
    return WebAttendaneLogDetailsLog.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: WebAttendaneLogDetailsLogFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await WebAttendaneLogDetailsLog.FetchTransportData(req, errorHandler) as TransportData;
    return WebAttendaneLogDetailsLog.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new WebAttendaneLogDetailsLogFetchRequest();
    let tdResponse = await WebAttendaneLogDetailsLog.FetchTransportData(req, errorHandler) as TransportData;
    return WebAttendaneLogDetailsLog.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new WebAttendaneLogDetailsLogFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await WebAttendaneLogDetailsLog.FetchTransportData(req, errorHandler) as TransportData;
    return WebAttendaneLogDetailsLog.ListFromTransportData(tdResponse);
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
