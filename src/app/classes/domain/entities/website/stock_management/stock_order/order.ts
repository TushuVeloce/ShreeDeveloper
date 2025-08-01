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
import { OrderFetchRequest } from "./orderfetchrequest";
import { OrderMaterialDetailProps } from "./OrderMaterial/ordermaterial";



export class OrderProps {
  public readonly Db_Table_Name = "MaterialPurchaseOrder";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;

  public Ref: number = 0;
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public SiteRef: number = 0;
  public SiteName: string = '';
  public MaterialPurchaseOrderStatus: number = 0;
  public MaterialQuotationRef: number = 0;
  public PurchaseOrderDate: string = '';
  public DisplayPurchaseOrderId: string = '';
  public VendorRef: number = 0;
  public VendorName: string = '';
  public VendorTradeName: string = '';
  public AddressLine1: string = '';
  public TransDateTime: string = '';
  public RequisitionQty: number = 0;
  public GrandTotal: number = 0;
  public MaterialPurchaseInvoicePath: string = "";
  public MaterialPurchaseOrderDetailsArray: OrderMaterialDetailProps[] = [];

  public LedgerRef: number = 0;
  public LedgerName: string = '';
  public SubLedgerRef: number = 0;
  public SubLedgerName: string = '';
  public Description: string = '';
  public Reason: string = '';
  public Narration: string = '';


  public readonly IsNewlyCreated: boolean = false;
  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new OrderProps(true);
  }
}

export class Order implements IPersistable<Order> {
  public static readonly Db_Table_Name: string = 'MaterialPurchaseOrder';

  public constructor(public readonly p: OrderProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Order {
    let newState: OrderProps = Utils.GetInstance().DeepCopy(this.p);
    return Order.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Order(OrderProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Order(data as OrderProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company Name cannot be blank.');
    if (this.p.SiteRef == 0) vra.add('SiteRef', 'Site Name cannot be blank.');
    if (this.p.LedgerRef == 0) vra.add('LedgerRef', 'Ledger cannot be blank.');
    if (this.p.SubLedgerRef == 0) vra.add('SubLedgerRef', 'Sub Ledger cannot be blank.');
    if (this.p.Description == '') vra.add('Description', 'Description cannot be blank.');
    if (this.p.Reason == '') vra.add('Reason', 'Reason cannot be blank.');
    if (this.p.MaterialPurchaseOrderDetailsArray.length < 1) vra.add('MaterialPurchaseOrderDetailsArray', 'Material table cannot be blank.');

  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Order.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Order = Order.CreateNewInstance();

  public static GetCurrentInstance() {
    return Order.m_currentInstance;
  }

  public static SetCurrentInstance(value: Order) {
    Order.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Order {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Order.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Order.Db_Table_Name)!.Entries) {
        return Order.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): Order[] {
    let result: Order[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Order.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Order.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Order.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Order[] {
    return Order.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: OrderFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new OrderFetchRequest();
    req.OrderRefs.push(ref);

    let tdResponse = await Order.FetchTransportData(req, errorHandler) as TransportData;
    return Order.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: OrderFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Order.FetchTransportData(req, errorHandler) as TransportData;
    return Order.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new OrderFetchRequest();
    let tdResponse = await Order.FetchTransportData(req, errorHandler) as TransportData;
    return Order.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new OrderFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await Order.FetchTransportData(req, errorHandler) as TransportData;
    return Order.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRefAndSiteRef(CompanyRef: number, SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new OrderFetchRequest();
    req.SiteRefs.push(SiteRef)
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await Order.FetchTransportData(req, errorHandler) as TransportData;
    return Order.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanySiteAndVendorRef(CompanyRef: number, SiteRef: number, VendorRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new OrderFetchRequest();
    req.SiteRefs.push(SiteRef)
    req.CompanyRefs.push(CompanyRef)
    req.VendorRefs.push(VendorRef)
    let tdResponse = await Order.FetchTransportData(req, errorHandler) as TransportData;
    return Order.ListFromTransportData(tdResponse);
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
