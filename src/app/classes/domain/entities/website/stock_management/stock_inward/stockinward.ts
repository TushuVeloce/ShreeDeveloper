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
import { StockInwardFetchRequest } from "./stockinwardfetchrequest";
import { InwardMaterialDetailProps } from "./inwardmaterial/inwardmaterial";
import { MaterialInwardAgainstPOStatusFetchRequest } from "./materialinwardagainstpostatusfetchrequest";

export class StockInwardProps {
  public readonly Db_Table_Name = "MaterialInward";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public CreatedDate: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: string = '';
  public UpdatedDate: string = '';
  // public MaterialInwardRef: number = 0;
  public Ref: number = 0;
  public SiteRef: number = 0;
  public readonly SiteName: string = '';
  public PurchaseOrderDate: string = '';
  public InwardDate: string = '';
  public VendorRef: number = 0;
  public readonly VendorName: string = '';
  public MaterialPurchaseOrderRef: number = 0;
  public MaterialInwardStatus: number = 0;
  public DisplayPurchaseOrderId: string = '';
  public VendorTradeName: string = '';
  public VendorPhoneNo: string = '';
  public VendorAddress: string = '';
  public ChalanNo: number = 0
  public VehicleNo: string = ''
  public RemainingQty: number = 0
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public CompanyPhoneNo: string = '';
  public CompanyAddressLine1: string = '';
  public CompanyAddressLine2: string = '';
  public SiteAddressLine1: string = '';
  public SiteAddressLine2: string = '';
  public MaterialInwardInvoicePath: string = "";
  public MaterialInwardDetailsArray: InwardMaterialDetailProps[] = [];



  public readonly IsNewlyCreated: boolean = false;
  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new StockInwardProps(true);
  }
}

export class StockInward implements IPersistable<StockInward> {
  public static readonly Db_Table_Name: string = 'MaterialInward';

  public constructor(public readonly p: StockInwardProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): StockInward {
    let newState: StockInwardProps = Utils.GetInstance().DeepCopy(this.p);
    return StockInward.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new StockInward(StockInwardProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new StockInward(data as StockInwardProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company Name cannot be blank.');
    if (this.p.SiteRef == 0) vra.add('SiteRef', 'Site Name cannot be blank.');

  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, StockInward.Db_Table_Name, this.p);
  }

  private static m_currentInstance: StockInward = StockInward.CreateNewInstance();

  public static GetCurrentInstance() {
    return StockInward.m_currentInstance;
  }

  public static SetCurrentInstance(value: StockInward) {
    StockInward.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): StockInward {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, StockInward.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, StockInward.Db_Table_Name)!.Entries) {
        return StockInward.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): StockInward[] {
    let result: StockInward[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, StockInward.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, StockInward.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(StockInward.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): StockInward[] {
    return StockInward.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: StockInwardFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new StockInwardFetchRequest();
    req.StockInwardManagementRefs.push(ref);
    req.CompanyRefs.push(companyRef);

    let tdResponse = await StockInward.FetchTransportData(req, errorHandler) as TransportData;
    return StockInward.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: StockInwardFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await StockInward.FetchTransportData(req, errorHandler) as TransportData;
    return StockInward.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new StockInwardFetchRequest();
    let tdResponse = await StockInward.FetchTransportData(req, errorHandler) as TransportData;
    return StockInward.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new StockInwardFetchRequest();
    req.CompanyRef = CompanyRef;
    let tdResponse = await StockInward.FetchTransportData(req, errorHandler) as TransportData;
    return StockInward.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRefSiteAndVendorRef(CompanyRef: number, SiteRef: number, VendorRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new StockInwardFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    SiteRef && req.SiteRefs.push(SiteRef)
    VendorRef && req.VendorRefs.push(VendorRef)
    let tdResponse = await StockInward.FetchTransportData(req, errorHandler) as TransportData;
    return StockInward.ListFromTransportData(tdResponse);
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
