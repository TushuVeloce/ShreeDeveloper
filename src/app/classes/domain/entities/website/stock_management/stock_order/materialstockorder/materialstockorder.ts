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
import { MaterialStockOrderFetchRequest } from "./materialstockorderfetchrequest";


export class MaterialStockOrderProps {
  public readonly Db_Table_Name = "MaterialStockOrderDetails";
  public Ref: number = 0;
  public MaterialRequisitionDetailsRef: number = 0;
  public MaterialRequisitionDetailsName: string = '';
  public MaterialName: string = '';
  public UnitName: string = '';
  
  public RequisitionQty: number = 0;
  public QuotedQty: number = 0;
  public OrderedQty: number = 0;
  public RequisitionRemainingQty: number = 0;
  public QuotationRemainingQty: number = 0;
  public QuotationOrderedQty: number = 0;
  public TotalOrderedQty: number = 0;
  public ExtraOrderedQty: number = 0;

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

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new MaterialStockOrderProps(true);
  }
}

export class MaterialStockOrder implements IPersistable<MaterialStockOrder> {
  public static readonly Db_Table_Name: string = 'MaterialStockOrderDetails';

  private constructor(public readonly p: MaterialStockOrderProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): MaterialStockOrder {
    let newState: MaterialStockOrderProps = Utils.GetInstance().DeepCopy(this.p);
    return MaterialStockOrder.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new MaterialStockOrder(MaterialStockOrderProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new MaterialStockOrder(data as MaterialStockOrderProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.MaterialName == '') {
      vra.add('Name', 'Name cannot be blank.');
    }
    // else if (!new RegExp(ValidationPatterns.NameWithNosAndSpace).test(this.p.Name)) {
    //   vra.add('Name', ValidationMessages.NameWithNosAndSpaceMsg + ' for Name');
    // }
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, MaterialStockOrder.Db_Table_Name, this.p);
  }

  private static m_currentInstance: MaterialStockOrder = MaterialStockOrder.CreateNewInstance();

  public static GetCurrentInstance() {
    return MaterialStockOrder.m_currentInstance;
  }

  public static SetCurrentInstance(value: MaterialStockOrder) {
    MaterialStockOrder.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): MaterialStockOrder {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, MaterialStockOrder.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, MaterialStockOrder.Db_Table_Name)!.Entries) {
        return MaterialStockOrder.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): MaterialStockOrder[] {
    let result: MaterialStockOrder[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, MaterialStockOrder.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, MaterialStockOrder.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(MaterialStockOrder.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): MaterialStockOrder[] {
    return MaterialStockOrder.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: MaterialStockOrderFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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

  public static async FetchInstance(ref: number, companyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialStockOrderFetchRequest();
    req.MaterialStockOrderDetailsRefs.push(ref);
    req.CompanyRefs.push(companyRef);

    let tdResponse = await MaterialStockOrder.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialStockOrder.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: MaterialStockOrderFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await MaterialStockOrder.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialStockOrder.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialStockOrderFetchRequest();
    let tdResponse = await MaterialStockOrder.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialStockOrder.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialStockOrderFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await MaterialStockOrder.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialStockOrder.ListFromTransportData(tdResponse);
  }

  public static async FetchOrderedMaterials(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialStockOrderFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await MaterialStockOrder.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialStockOrder.ListFromTransportData(tdResponse);
  }
  public static async FetchMaterialQuantity(ref: number, CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialStockOrderFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    req.MaterialStockOrderDetailsRefs.push(ref)
    let tdResponse = await MaterialStockOrder.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialStockOrder.ListFromTransportData(tdResponse);
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
