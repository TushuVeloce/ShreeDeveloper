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
import { StockSummaryFetchRequest } from "./stocksummaryfetchrequest";


export class StockSummaryProps {
  public readonly Db_Table_Name = "StockSummary";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public SiteRef: number = 0;
  public SiteName: string = '';
  public MaterialRef: number = 0;
  public MaterialName: string = '';
  public PurchaseOrderDate: string = '';
  public TotalExtraOrderQty: number = 0;
  public TotalOrderQtyPerMaterial: number = 0;
  public TotalOrderQty: number = 0;
  public TotalInwardQty: number = 0;
  public TotalTransferredInQty: number = 0;
  public TotalTransferredOutQty : number = 0;
  public EffectiveInwardQty : number = 0;
  public TotalConsumedQty  : number = 0;
  public CurrentStock: number = 0;
  public RemainingQty: number = 0;
  public UnitRef: number = 0;
  public UnitName: string = '';
  public GST: number = 0;
  public CompanyRef: number = 0;
  public CompanyName: string = '';


  public readonly IsNewlyCreated: boolean = false;
  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new StockSummaryProps(true);
  }
}

export class StockSummary implements IPersistable<StockSummary> {
  public static readonly Db_Table_Name: string = 'StockSummary';

  public constructor(public readonly p: StockSummaryProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): StockSummary {
    let newState: StockSummaryProps = Utils.GetInstance().DeepCopy(this.p);
    return StockSummary.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new StockSummary(StockSummaryProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new StockSummary(data as StockSummaryProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    // if (this.p.TransferredQuantity == 0) vra.add('TransferredQuantity', 'Transferred Quantity cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, StockSummary.Db_Table_Name, this.p);
  }

  private static m_currentInstance: StockSummary = StockSummary.CreateNewInstance();

  public static GetCurrentInstance() {
    return StockSummary.m_currentInstance;
  }

  public static SetCurrentInstance(value: StockSummary) {
    StockSummary.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): StockSummary {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, StockSummary.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, StockSummary.Db_Table_Name)!.Entries) {
        return StockSummary.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): StockSummary[] {
    let result: StockSummary[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, StockSummary.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, StockSummary.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(StockSummary.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): StockSummary[] {
    return StockSummary.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: StockSummaryFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new StockSummaryFetchRequest();
    req.StockSummaryManagementRefs.push(ref);

    let tdResponse = await StockSummary.FetchTransportData(req, errorHandler) as TransportData;
    return StockSummary.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: StockSummaryFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await StockSummary.FetchTransportData(req, errorHandler) as TransportData;
    return StockSummary.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new StockSummaryFetchRequest();
    let tdResponse = await StockSummary.FetchTransportData(req, errorHandler) as TransportData;
    return StockSummary.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new StockSummaryFetchRequest();
    req.CompanyRef = CompanyRef
    let tdResponse = await StockSummary.FetchTransportData(req, errorHandler) as TransportData;
    return StockSummary.ListFromTransportData(tdResponse);
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
