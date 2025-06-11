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
import { QuotationFetchRequest } from "./quotationfetchrequest";
import { QuotedMaterialDetailProps } from "./QuotatedMaterial/quotatedmaterial";



export class QuotationProps {
  public readonly Db_Table_Name = "MaterialQuotation";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public SiteRef: number = 0;
  public SiteName: string = '';
  public MaterialQuotationStatus: number = 0;
  public Date: string = '';
  public VendorRef: number = 0;
  public VendorName: string = '';
  public VendorTradeName: string = '';
  public AddressLine1: string = '';
  public GrandTotal: number = 0;
  public InvoicePath: string = "";
  public MaterialQuotationDetailsArray: QuotedMaterialDetailProps[] = [];


  public readonly IsNewlyCreated: boolean = false;
  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new QuotationProps(true);
  }
}

export class Quotation implements IPersistable<Quotation> {
  public static readonly Db_Table_Name: string = 'MaterialQuotation';

  public constructor(public readonly p: QuotationProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Quotation {
    let newState: QuotationProps = Utils.GetInstance().DeepCopy(this.p);
    return Quotation.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Quotation(QuotationProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Quotation(data as QuotationProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    // if (this.p.Name == '') vra.add('Name', 'Quotation Name cannot be blank.'); else if (!new RegExp(ValidationPatterns.NameWithoutNos).test(this.p.Name)) {
    //   vra.add('Name', ValidationMessages.NameWithoutNosMsg);
    // }
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Quotation.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Quotation = Quotation.CreateNewInstance();

  public static GetCurrentInstance() {
    return Quotation.m_currentInstance;
  }

  public static SetCurrentInstance(value: Quotation) {
    Quotation.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Quotation {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Quotation.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Quotation.Db_Table_Name)!.Entries) {
        return Quotation.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): Quotation[] {
    let result: Quotation[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Quotation.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Quotation.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Quotation.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Quotation[] {
    return Quotation.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: QuotationFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new QuotationFetchRequest();
    req.QuotationRefs.push(ref);

    let tdResponse = await Quotation.FetchTransportData(req, errorHandler) as TransportData;
    return Quotation.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: QuotationFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Quotation.FetchTransportData(req, errorHandler) as TransportData;
    return Quotation.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new QuotationFetchRequest();
    let tdResponse = await Quotation.FetchTransportData(req, errorHandler) as TransportData;
    return Quotation.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new QuotationFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await Quotation.FetchTransportData(req, errorHandler) as TransportData;
    return Quotation.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRefAndSiteRef(CompanyRef: number, SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new QuotationFetchRequest();
    req.SiteRefs.push(SiteRef)
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await Quotation.FetchTransportData(req, errorHandler) as TransportData;
    return Quotation.ListFromTransportData(tdResponse);
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
