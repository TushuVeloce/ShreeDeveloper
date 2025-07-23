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
import { InwardMaterialDetailProps } from "./inwardmaterial/inwardmaterial";
import { MaterialInwardAgainstPOStatusFetchRequest } from "./materialinwardagainstpostatusfetchrequest";

export class MaterialInwardAgainstPOStatusProps {
  public readonly Db_Table_Name = "MaterialInwardAgainstPOStatus";

  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public CreatedDate: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public UpdatedDate: number = 0;
  public MaterialInwardRef: number = 0;
  public Ref: number = 0;
  public SiteRef: number = 0;
  public SiteName: string = '';
  public PurchaseOrderRef: number = 0;
  public MaterialRef: number = 0;
  public MaterialName: string = '';
  public UnitName: string = '';
  public OrderedQty: number = 0;
  public TotalInwardQty: number = 0;
  public BalanceQty: number = 0;
  public Status: string = '';
  public InwardRef: number = 0;
  public ChalanNo: number = 0;
  public PurchaseOrderDate: string = '';
  public SiteAddressLine1: string = '';
  public SiteAddressLine2: string = '';
  public VendorRef: number = 0;
  public VendorName: string = '';
  public VendorTradeName: string = '';
  public VendorAddressLine1: string = '';
  public VendorAddressLine2: string = '';
  public VendorPhoneNo: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public CompanyAddressLine1: string = '';
  public CompanyAddressLine2: string = '';
  public CompanyPhoneNo: string = '';

  public readonly IsNewlyCreated: boolean = false;
  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new MaterialInwardAgainstPOStatusProps(true);
  }
}

export class MaterialInwardAgainstPOStatus implements IPersistable<MaterialInwardAgainstPOStatus> {
  public static readonly Db_Table_Name: string = 'MaterialInwardAgainstPOStatus';

  public constructor(public readonly p: MaterialInwardAgainstPOStatusProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.MaterialInwardRef === undefined || this.p.MaterialInwardRef === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.MaterialInwardRef = newRefs[0];
      if (this.p.MaterialInwardRef <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): MaterialInwardAgainstPOStatus {
    let newState: MaterialInwardAgainstPOStatusProps = Utils.GetInstance().DeepCopy(this.p);
    return MaterialInwardAgainstPOStatus.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new MaterialInwardAgainstPOStatus(MaterialInwardAgainstPOStatusProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new MaterialInwardAgainstPOStatus(data as MaterialInwardAgainstPOStatusProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company Name cannot be blank.');
    if (this.p.SiteRef == 0) vra.add('SiteRef', 'Site Name cannot be blank.');

  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, MaterialInwardAgainstPOStatus.Db_Table_Name, this.p);
  }

  private static m_currentInstance: MaterialInwardAgainstPOStatus = MaterialInwardAgainstPOStatus.CreateNewInstance();

  public static GetCurrentInstance() {
    return MaterialInwardAgainstPOStatus.m_currentInstance;
  }

  public static SetCurrentInstance(value: MaterialInwardAgainstPOStatus) {
    MaterialInwardAgainstPOStatus.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): MaterialInwardAgainstPOStatus {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, MaterialInwardAgainstPOStatus.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, MaterialInwardAgainstPOStatus.Db_Table_Name)!.Entries) {
        return MaterialInwardAgainstPOStatus.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): MaterialInwardAgainstPOStatus[] {
    let result: MaterialInwardAgainstPOStatus[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, MaterialInwardAgainstPOStatus.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, MaterialInwardAgainstPOStatus.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(MaterialInwardAgainstPOStatus.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): MaterialInwardAgainstPOStatus[] {
    return MaterialInwardAgainstPOStatus.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: MaterialInwardAgainstPOStatusFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new MaterialInwardAgainstPOStatusFetchRequest();
    req.StockInwardManagementRefs.push(ref);

    let tdResponse = await MaterialInwardAgainstPOStatus.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialInwardAgainstPOStatus.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: MaterialInwardAgainstPOStatusFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await MaterialInwardAgainstPOStatus.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialInwardAgainstPOStatus.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialInwardAgainstPOStatusFetchRequest();
    let tdResponse = await MaterialInwardAgainstPOStatus.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialInwardAgainstPOStatus.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialInwardAgainstPOStatusFetchRequest();
    req.CompanyRef = CompanyRef;
    let tdResponse = await MaterialInwardAgainstPOStatus.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialInwardAgainstPOStatus.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRefAndSiteRef(CompanyRef: number, SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialInwardAgainstPOStatusFetchRequest();
    req.SiteRefs.push(SiteRef)
    req.CompanyRef = CompanyRef;
    let tdResponse = await MaterialInwardAgainstPOStatus.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialInwardAgainstPOStatus.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRefSiteAndVendorRef(CompanyRef: number, SiteRef: number, VendorRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MaterialInwardAgainstPOStatusFetchRequest();
    if (SiteRef) {
      req.SiteRef = SiteRef
    }
    if (VendorRef) {
      req.VendorRef = VendorRef;
    }
    req.CompanyRef = CompanyRef;
    let tdResponse = await MaterialInwardAgainstPOStatus.FetchTransportData(req, errorHandler) as TransportData;
    return MaterialInwardAgainstPOStatus.ListFromTransportData(tdResponse);
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
