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
import { LabourTimeFetchRequest } from "./labourtimefetchrequest";


export class LabourTimeProps {
  public readonly Db_Table_Name = "LabourTimeDetails";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public LabourType : number = 0;
  public LabourQty: number = 0;
  public LabourRate: number = 0;
  public LabourAmount : number = 0;
  public LabourFromTime: string = '';
  public LabourToTime: string = '';
  // public WorkedHours: number = 0;
  // public Total: number = 0;
  public InvoiceRef: number = 0;

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  public constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new LabourTimeProps(true);
  }
}

export class LabourTime implements IPersistable<LabourTime> {
  public static readonly Db_Table_Name: string = 'LabourTimeDetails';

  public constructor(public readonly p: LabourTimeProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): LabourTime {
    let newState: LabourTimeProps = Utils.GetInstance().DeepCopy(this.p);
    return LabourTime.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new LabourTime(LabourTimeProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new LabourTime(data as LabourTimeProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, LabourTime.Db_Table_Name, this.p);
  }

  private static m_currentInstance: LabourTime = LabourTime.CreateNewInstance();

  public static GetCurrentInstance() {
    return LabourTime.m_currentInstance;
  }

  public static SetCurrentInstance(value: LabourTime) {
    LabourTime.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): LabourTime {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, LabourTime.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, LabourTime.Db_Table_Name)!.Entries) {
        return LabourTime.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
   sortPropertyName: string = ""): LabourTime[] {
    let result: LabourTime[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, LabourTime.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, LabourTime.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(LabourTime.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): LabourTime[] {
    return LabourTime.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: LabourTimeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new LabourTimeFetchRequest();
    req.LabourTimeRefs.push(ref);

    let tdResponse = await LabourTime.FetchTransportData(req, errorHandler) as TransportData;
    return LabourTime.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: LabourTimeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await LabourTime.FetchTransportData(req, errorHandler) as TransportData;
    return LabourTime.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new LabourTimeFetchRequest();
    let tdResponse = await LabourTime.FetchTransportData(req, errorHandler) as TransportData;
    return LabourTime.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRefAndSiteRef(CompanyRef: number, SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new LabourTimeFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    req.SiteManagementRefs.push(SiteRef)
    let tdResponse = await LabourTime.FetchTransportData(req, errorHandler) as TransportData;
    return LabourTime.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBySiteRef(siteref: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new LabourTimeFetchRequest();
    req.SiteManagementRefs.push(siteref)
    let tdResponse = await LabourTime.FetchTransportData(req, errorHandler) as TransportData;
    return LabourTime.ListFromTransportData(tdResponse);
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
