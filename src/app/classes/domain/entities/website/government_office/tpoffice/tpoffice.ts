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
import { ApplicableTypeProps } from "../siteworkmaster/siteworkmaster";
import { TPOfficeFetchRequest } from "./tpofficefetchrequest";


export class TPOfficeProps {
  public readonly Db_Table_Name = "GovernmentTPOffice";
  public IsNewlyCreated: boolean = false;
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public SiteRef: number = 0;
  public SiteName: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';

  public IsTentativeLayoutSubmit: boolean = false;
  public TentativeLayoutInwardNo: string = '';
  public TentativeLayoutInwardDate: string = '';
  public IsTentativeLayoutScrutinyFeesSubmit: boolean = false;
  public IsSurveyRemarkSubmit: boolean = false;
  public IsATPSiteVisitSubmit: boolean = false;
  public IsADTPSiteVisitSubmit: boolean = false;
  public IsDDTPSiteVisitSubmit: boolean = false;
  public IsProposalSanctionSubmit: boolean = false;
  public IsDevelopmentChargesSubmit: boolean = false;
  public IsSubmitToTahsildar: boolean = false;
  public ParishisthaNaUlcInwardNo: string = '';
  public ParishisthaNaUlcInwardDate: string = '';
  public IsSubmitToUpadhaykshaAndBhumiAdhilekh: boolean = false;
  public MojniInwardNo: string = '';
  public MojniInwardDate: string = '';
  public IsGramSevakSubmit: boolean = false;
  public GramSevakInwardNo: string = '';
  public GramSevakInwardDate: string = '';
  public IsULCSubmit: boolean = false;
  public ULCInwardNo: string = '';
  public ULCInwardDate: string = '';
  public ReportNOCAirportNOC: boolean = false;
  public IsReportNOCSubmit: boolean = false;
  public ReportNOCInwardNo: string = '';
  public ReportNOCInwardDate: string = '';
  public IsAirportNOCSubmit: boolean = false;
  public AirportNOCInwardNo: string = '';
  public AirportNOCInwardDate: string = '';

  public IsTPOfficeComplete: boolean = false;


  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new TPOfficeProps(true);
  }
}

export class TPOffice implements IPersistable<TPOffice> {
  TransactionJson(TransactionJson: any) {
    throw new Error('Method not implemented.');
  }

  public IsComplete: boolean = false;

  public static readonly Db_Table_Name: string = 'GovernmentTPOffice';

  private constructor(public readonly p: TPOfficeProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): TPOffice {
    let newState: TPOfficeProps = Utils.GetInstance().DeepCopy(this.p);
    return TPOffice.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new TPOffice(TPOfficeProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new TPOffice(data as TPOfficeProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.SiteRef == 0) vra.add('SiteWorkRef', 'Site Name cannot be blank.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company cannot be blank.');
    // if (this.p.TransactionJson == '') vra.add('TransactionJson', 'Transaction cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, TPOffice.Db_Table_Name, this.p);
  }

  private static m_currentInstance: TPOffice = TPOffice.CreateNewInstance();

  public static GetCurrentInstance() {
    return TPOffice.m_currentInstance;
  }

  public static SetCurrentInstance(value: TPOffice) {
    TPOffice.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): TPOffice {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, TPOffice.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, TPOffice.Db_Table_Name)!.Entries) {
        return TPOffice.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): TPOffice[] {
    let result: TPOffice[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, TPOffice.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, TPOffice.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(TPOffice.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): TPOffice[] {
    return TPOffice.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: TPOfficeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new TPOfficeFetchRequest();
    req.GovernmentTransationRefs.push(ref);

    let tdResponse = await TPOffice.FetchTransportData(req, errorHandler) as TransportData;
    return TPOffice.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: TPOfficeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await TPOffice.FetchTransportData(req, errorHandler) as TransportData;
    return TPOffice.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new TPOfficeFetchRequest();
    let tdResponse = await TPOffice.FetchTransportData(req, errorHandler) as TransportData;
    return TPOffice.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new TPOfficeFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await TPOffice.FetchTransportData(req, errorHandler) as TransportData;
    return TPOffice.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBySiteRef(SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new TPOfficeFetchRequest();
    req.SiteRefs.push(SiteRef)
    let tdResponse = await TPOffice.FetchTransportData(req, errorHandler) as TransportData;
    return TPOffice.ListFromTransportData(tdResponse);
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
