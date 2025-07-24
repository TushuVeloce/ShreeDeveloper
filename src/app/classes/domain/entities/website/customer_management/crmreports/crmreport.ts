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
import { CRMReportsFetchRequest } from "./crmreportfetchrequest";


export class CRMReportsProps {
  public Ref: number = 0;
  public CustomerEnquiryRef: number = 0;
  public RegisterDate: string = '';
  public CustID: string = '';
  public SiteName: string = '';
  public CustomerName: string = '';
  public CustomerAddress: string = '';
  public ContactNos: string = '';
  public Reference: string = '';
  public AdharNo: string = '';
  public PANNo: string = '';
  public PlotNo: string = '';
  public LeadSourceName: string = '';
  public RegisterCustomerBookingRemarkName: string = '';
  public AreaInSqm: number = 0;
  public AreaInSqft: number = 0;
  public BasicRate: number = 0;
  public DiscountedRateOnArea: number = 0;
  public DiscountOnTotalPlotAmount: number = 0;
  public TotalPlotAmount: number = 0;
  public GovernmentValue: number = 0;
  public GovernmentRecknor: number = 0;
  public StampDuties: number = 0;
  public RegistrationFees: number = 0;
  public LegalCharges: number = 0;
  public TotalExtraCharges: number = 0;
  public GrandTotal: number = 0;
  public ValueOfAgreement: number = 0;
  public TaxValueInPercentage: number = 0
  public GovermentRatePerSqm: number = 0;
  public RegTaxValueInPercentage: number = 0;
  public GoodsServicesTax: number = 0;
  public GstToatalAmount: number = 0;
  public TotalChequeRecieved: number = 0;
  public TotalCashRecieved: number = 0;
  public TotalAmountRecieved: number = 0;
  public TotalChequeBalance: number = 0;
  public TotalCashBalance: number = 0;
  public TotalBalance: number = 0;
  public RemainingAmount: number = 0;
  public BrokerName: string = '';
  public LeadHandleByName: string = '';



  public readonly IsNewlyCreated: boolean = false;

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new CRMReportsProps(true);
  }
}

export class CRMReports implements IPersistable<CRMReports> {
  public static readonly Db_Table_Name: string = 'CustomerSummarry';

  private constructor(public readonly p: CRMReportsProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public static async getPrimaryKeysWithValidValues(): Promise<number> {
    const newRefs = await IdProvider.GetInstance().GetNextEntityId();
    // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
    let newRef = newRefs[0];
    if (newRef <= 0) throw new Error("Cannot assign Id. Please try again");
    return newRef
  }

  public GetEditableVersion(): CRMReports {
    let newState: CRMReportsProps = Utils.GetInstance().DeepCopy(this.p);
    return CRMReports.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new CRMReports(CRMReportsProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new CRMReports(data as CRMReportsProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, CRMReports.Db_Table_Name, this.p);
  }

  private static m_currentInstance: CRMReports = CRMReports.CreateNewInstance();

  public static GetCurrentInstance() {
    return CRMReports.m_currentInstance;
  }

  public static SetCurrentInstance(value: CRMReports) {
    CRMReports.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): CRMReports {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, CRMReports.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, CRMReports.Db_Table_Name)!.Entries) {
        return CRMReports.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): CRMReports[] {
    let result: CRMReports[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, CRMReports.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, CRMReports.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(CRMReports.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): CRMReports[] {
    return CRMReports.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: CRMReportsFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new CRMReportsFetchRequest();
    req.CRMReportsRefs.push(ref);

    let tdResponse = await CRMReports.FetchTransportData(req, errorHandler) as TransportData;
    return CRMReports.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: CRMReportsFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await CRMReports.FetchTransportData(req, errorHandler) as TransportData;
    return CRMReports.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CRMReportsFetchRequest();
    let tdResponse = await CRMReports.FetchTransportData(req, errorHandler) as TransportData;
    return CRMReports.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CRMReportsFetchRequest();
    req.CompanyRef = CompanyRef
    let tdResponse = await CRMReports.FetchTransportData(req, errorHandler) as TransportData;
    return CRMReports.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyAndSiteRef(CompanyRef: number, SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CRMReportsFetchRequest();
    req.CompanyRef = CompanyRef
    req.SiteRef = SiteRef
    let tdResponse = await CRMReports.FetchTransportData(req, errorHandler) as TransportData;
    return CRMReports.ListFromTransportData(tdResponse);
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
