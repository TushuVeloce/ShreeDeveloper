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
import { StockTransferFetchRequest } from "./stocktransferfetchrequest";


export class StockTransferProps {
  public readonly Db_Table_Name = "MaterialTrasfer";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public FromSiteRef: number = 0;
  public readonly FromSiteName: string = '';
  public ToSiteRef: number = 0;
  public readonly ToSiteName: string = '';
  public Date: string = '';
  public MaterialRef: number = 0;
  public readonly MaterialName: string = '';
  public UnitRef: number = 0;
  public UnitName: string = '';
  public CurrentQuantity: number = 0;
  public TransferredQuantity: number = 0;
  public Rate: number = 0;
  public GST: number = 0;
  public Amount: number = 0;
  public RemainingQuantity: number = 0;
  public CompanyRef: number = 0;
  public CompanyName: string = '';


  public readonly IsNewlyCreated: boolean = false;
  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new StockTransferProps(true);
  }
}

export class StockTransfer implements IPersistable<StockTransfer> {
  public static readonly Db_Table_Name: string = 'MaterialTrasfer';

  public constructor(public readonly p: StockTransferProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): StockTransfer {
    let newState: StockTransferProps = Utils.GetInstance().DeepCopy(this.p);
    return StockTransfer.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new StockTransfer(StockTransferProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new StockTransfer(data as StockTransferProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, StockTransfer.Db_Table_Name, this.p);
  }

  private static m_currentInstance: StockTransfer = StockTransfer.CreateNewInstance();

  public static GetCurrentInstance() {
    return StockTransfer.m_currentInstance;
  }

  public static SetCurrentInstance(value: StockTransfer) {
    StockTransfer.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): StockTransfer {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, StockTransfer.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, StockTransfer.Db_Table_Name)!.Entries) {
        return StockTransfer.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): StockTransfer[] {
    let result: StockTransfer[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, StockTransfer.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, StockTransfer.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(StockTransfer.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): StockTransfer[] {
    return StockTransfer.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: StockTransferFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new StockTransferFetchRequest();
    req.StockTransferManagementRefs.push(ref);

    let tdResponse = await StockTransfer.FetchTransportData(req, errorHandler) as TransportData;
    return StockTransfer.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: StockTransferFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await StockTransfer.FetchTransportData(req, errorHandler) as TransportData;
    return StockTransfer.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new StockTransferFetchRequest();
    let tdResponse = await StockTransfer.FetchTransportData(req, errorHandler) as TransportData;
    return StockTransfer.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new StockTransferFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await StockTransfer.FetchTransportData(req, errorHandler) as TransportData;
    return StockTransfer.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByAllFilters(CompanyRef: number, Status: number, SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new StockTransferFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    if (Status) {
      req.StockTransferStatus.push(Status)
    }
    if (SiteRef) {
      req.SiteRefs.push(SiteRef)
    }
    let tdResponse = await StockTransfer.FetchTransportData(req, errorHandler) as TransportData;
    return StockTransfer.ListFromTransportData(tdResponse);
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
