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
import { ProgressReportFetchRequest } from "./progressreportfetchrequest";


export class ProgressReportProps {
  public readonly Db_Table_Name = "ProgressReport";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public SiteRef: number = 0;
  public SiteName: string = '';
  public IsTPOfficeComplete: boolean = false;
  public IsParishisthaNaComplete: boolean = false;
  public IsMojniCompleted: boolean = false;
  public IsGovernmentUlcComplete: boolean = false;
  public IsFinalLayoutCompleted: boolean = false;
  public IsKajapaComplete: boolean = false;

  public IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new ProgressReportProps(true);
  }
}

export class ProgressReport implements IPersistable<ProgressReport> {
  public static readonly Db_Table_Name: string = 'ProgressReport';

  private constructor(public readonly p: ProgressReportProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): ProgressReport {
    let newState: ProgressReportProps = Utils.GetInstance().DeepCopy(this.p);
    return ProgressReport.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new ProgressReport(ProgressReportProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new ProgressReport(data as ProgressReportProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, ProgressReport.Db_Table_Name, this.p);
  }

  private static m_currentInstance: ProgressReport = ProgressReport.CreateNewInstance();

  public static GetCurrentInstance() {
    return ProgressReport.m_currentInstance;
  }

  public static SetCurrentInstance(value: ProgressReport) {
    ProgressReport.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): ProgressReport {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, ProgressReport.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, ProgressReport.Db_Table_Name)!.Entries) {
        return ProgressReport.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): ProgressReport[] {
    let result: ProgressReport[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, ProgressReport.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, ProgressReport.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(ProgressReport.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): ProgressReport[] {
    return ProgressReport.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: ProgressReportFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new ProgressReportFetchRequest();
    req.ProgressReportRefs.push(ref);

    let tdResponse = await ProgressReport.FetchTransportData(req, errorHandler) as TransportData;
    return ProgressReport.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: ProgressReportFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await ProgressReport.FetchTransportData(req, errorHandler) as TransportData;
    return ProgressReport.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ProgressReportFetchRequest();
    let tdResponse = await ProgressReport.FetchTransportData(req, errorHandler) as TransportData;
    return ProgressReport.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByProgressReportRef(ProgressReportRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ProgressReportFetchRequest();
    req.ProgressReportRefs.push(ProgressReportRef)
    let tdResponse = await ProgressReport.FetchTransportData(req, errorHandler) as TransportData;
    return ProgressReport.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ProgressReportFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await ProgressReport.FetchTransportData(req, errorHandler) as TransportData;
    return ProgressReport.ListFromTransportData(tdResponse);
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
