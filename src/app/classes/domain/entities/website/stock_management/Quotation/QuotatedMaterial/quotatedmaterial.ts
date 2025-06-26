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
import { CountryStateCityRefs } from "src/app/classes/domain/constants";
import { QuotedMaterialFetchRequest } from "./quotatedmaterialfetchrequest";


export class QuotedMaterialDetailProps {
  public readonly Db_Table_Name = "QuotedMaterialDetails";
  public Ref: number = 0;

  public MaterialRequisitionDetailsRef: number = 0;
  public MaterialRequisitionDetailsName: string = '';
  public MaterialName: string = '';
  public UnitName: string = '';
  public RequisitionQty: number = 0;
  public QuotationOrderedQty: number = 0;
  public RequisitionRemainingQty: number = 0;
  public Rate: number = 0;
  public DiscountedRate: number = 0;
  public Gst: number = 0;
  public DeliveryCharges: number = 0;
  public ExpectedDeliveryDate: string = '';
  public NetAmount: number = 0;
  public TotalAmount: number = 0;
  public MaterialQuotationRef: number = 0;
  public MaterialQuotationDetailsRef: number = 0;

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  public constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new QuotedMaterialDetailProps(true);
  }
}

export class QuotedMaterial implements IPersistable<QuotedMaterial> {
  public static readonly Db_Table_Name: string = 'QuotedMaterialDetails';

  public constructor(public readonly p: QuotedMaterialDetailProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): QuotedMaterial {
    let newState: QuotedMaterialDetailProps = Utils.GetInstance().DeepCopy(this.p);
    return QuotedMaterial.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new QuotedMaterial(QuotedMaterialDetailProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new QuotedMaterial(data as QuotedMaterialDetailProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, QuotedMaterial.Db_Table_Name, this.p);
  }

  private static m_currentInstance: QuotedMaterial = QuotedMaterial.CreateNewInstance();

  public static GetCurrentInstance() {
    return QuotedMaterial.m_currentInstance;
  }

  public static SetCurrentInstance(value: QuotedMaterial) {
    QuotedMaterial.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): QuotedMaterial {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, QuotedMaterial.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, QuotedMaterial.Db_Table_Name)!.Entries) {
        return QuotedMaterial.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): QuotedMaterial[] {
    let result: QuotedMaterial[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, QuotedMaterial.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, QuotedMaterial.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(QuotedMaterial.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): QuotedMaterial[] {
    return QuotedMaterial.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: QuotedMaterialFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new QuotedMaterialFetchRequest();
    req.QuotedMaterialRefs.push(ref);

    let tdResponse = await QuotedMaterial.FetchTransportData(req, errorHandler) as TransportData;
    return QuotedMaterial.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: QuotedMaterialFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await QuotedMaterial.FetchTransportData(req, errorHandler) as TransportData;
    return QuotedMaterial.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new QuotedMaterialFetchRequest();
    let tdResponse = await QuotedMaterial.FetchTransportData(req, errorHandler) as TransportData;
    return QuotedMaterial.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRefAndSiteRef(CompanyRef: number, SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new QuotedMaterialFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    req.SiteManagementRefs.push(SiteRef)
    let tdResponse = await QuotedMaterial.FetchTransportData(req, errorHandler) as TransportData;
    return QuotedMaterial.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBySiteRef(siteref: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new QuotedMaterialFetchRequest();
    req.SiteManagementRefs.push(siteref)
    let tdResponse = await QuotedMaterial.FetchTransportData(req, errorHandler) as TransportData;
    return QuotedMaterial.ListFromTransportData(tdResponse);
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
