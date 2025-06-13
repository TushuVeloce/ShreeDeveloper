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
import { OrderMaterialFetchRequest } from "./ordermaterialfetchrequest";


export class OrderMaterialDetailProps {
  public readonly Db_Table_Name = "MaterialStockOrderDetails";
  public Ref: number = 0;

  public MaterialRequisitionDetailsRef: number = 0;
  public MaterialRequisitionDetailsName: string = '';
  public MaterialName: string = '';
  public UnitName: string = '';
  public EstimatedQty: number = 0;
  public OrderedQty: number = 0;
  public ExtraOrderedQty: number = 0;
  public RequiredRemainingQuantity: number = 0;
  public Rate: number = 0;
  public DiscountedRate: number = 0;
  public Gst: number = 0;
  public DeliveryCharges: number = 0;
  public ExpectedDeliveryDate: string = '';
  public NetAmount: number = 0;
  public TotalAmount: number = 0;
  public MaterialStockOrderRef: number = 0;

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  public constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new OrderMaterialDetailProps(true);
  }
}

export class OrderMaterial implements IPersistable<OrderMaterial> {
  public static readonly Db_Table_Name: string = 'MaterialStockOrderDetails';

  public constructor(public readonly p: OrderMaterialDetailProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): OrderMaterial {
    let newState: OrderMaterialDetailProps = Utils.GetInstance().DeepCopy(this.p);
    return OrderMaterial.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new OrderMaterial(OrderMaterialDetailProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new OrderMaterial(data as OrderMaterialDetailProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, OrderMaterial.Db_Table_Name, this.p);
  }

  private static m_currentInstance: OrderMaterial = OrderMaterial.CreateNewInstance();

  public static GetCurrentInstance() {
    return OrderMaterial.m_currentInstance;
  }

  public static SetCurrentInstance(value: OrderMaterial) {
    OrderMaterial.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): OrderMaterial {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, OrderMaterial.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, OrderMaterial.Db_Table_Name)!.Entries) {
        return OrderMaterial.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): OrderMaterial[] {
    let result: OrderMaterial[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, OrderMaterial.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, OrderMaterial.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(OrderMaterial.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): OrderMaterial[] {
    return OrderMaterial.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: OrderMaterialFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new OrderMaterialFetchRequest();
    req.OrderMaterialRefs.push(ref);

    let tdResponse = await OrderMaterial.FetchTransportData(req, errorHandler) as TransportData;
    return OrderMaterial.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: OrderMaterialFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await OrderMaterial.FetchTransportData(req, errorHandler) as TransportData;
    return OrderMaterial.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new OrderMaterialFetchRequest();
    let tdResponse = await OrderMaterial.FetchTransportData(req, errorHandler) as TransportData;
    return OrderMaterial.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRefAndSiteRef(CompanyRef: number, SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new OrderMaterialFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    req.SiteManagementRefs.push(SiteRef)
    let tdResponse = await OrderMaterial.FetchTransportData(req, errorHandler) as TransportData;
    return OrderMaterial.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBySiteRef(siteref: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new OrderMaterialFetchRequest();
    req.SiteManagementRefs.push(siteref)
    let tdResponse = await OrderMaterial.FetchTransportData(req, errorHandler) as TransportData;
    return OrderMaterial.ListFromTransportData(tdResponse);
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
