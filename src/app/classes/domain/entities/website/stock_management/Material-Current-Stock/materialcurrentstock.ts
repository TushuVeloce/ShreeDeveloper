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
import { MaterialCurrentStockFetchRequest } from "./materialcurrentstockferfetchrequest";


export class MaterialCurrentStockProps {
  public readonly Db_Table_Name = "MaterialCurrentStock";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public MaterialRef: number = 0;
  public readonly MaterialName: string = '';
  public UnitRef: number = 0;
  public UnitName: string = '';
  public CurrentQuantity: number = 0;

  public readonly IsNewlyCreated: boolean = false;
  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new MaterialCurrentStockProps(true);
  }
}

export class MaterialCurrentStock implements IPersistable<MaterialCurrentStock> {
  public static readonly Db_Table_Name: string = 'MaterialCurrentStock';
  public constructor(public readonly p: MaterialCurrentStockProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): MaterialCurrentStock {
    let newState: MaterialCurrentStockProps = Utils.GetInstance().DeepCopy(this.p);
    return MaterialCurrentStock.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new MaterialCurrentStock(MaterialCurrentStockProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new MaterialCurrentStock(data as MaterialCurrentStockProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, MaterialCurrentStock.Db_Table_Name, this.p);
  }

  private static m_currentInstance: MaterialCurrentStock = MaterialCurrentStock.CreateNewInstance();

  public static GetCurrentInstance() {
    return MaterialCurrentStock.m_currentInstance;
  }

  public static SetCurrentInstance(value: MaterialCurrentStock) {
    MaterialCurrentStock.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): MaterialCurrentStock {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, MaterialCurrentStock.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, MaterialCurrentStock.Db_Table_Name)!.Entries) {
        return MaterialCurrentStock.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): MaterialCurrentStock[] {
    let result: MaterialCurrentStock[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, MaterialCurrentStock.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, MaterialCurrentStock.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(MaterialCurrentStock.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): MaterialCurrentStock[] {
    return MaterialCurrentStock.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: MaterialCurrentStockFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new MaterialCurrentStockFetchRequest();
    req.MaterialCurrentStockRef.push(ref);

    let tdResponse = await MaterialCurrentStock.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialCurrentStock.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: MaterialCurrentStockFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await MaterialCurrentStock.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialCurrentStock.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialCurrentStockFetchRequest();
    let tdResponse = await MaterialCurrentStock.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialCurrentStock.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialCurrentStockFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await MaterialCurrentStock.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialCurrentStock.ListFromTransportData(tdResponse);
  }

  public static async FetchMaterialData(SiteRef:number,MaterialRef:number,CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialCurrentStockFetchRequest();
    req.SiteRef = SiteRef
    req.MaterialRef = MaterialRef
    req.CompanyRef = CompanyRef
    let tdResponse = await MaterialCurrentStock.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialCurrentStock.ListFromTransportData(tdResponse);
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
