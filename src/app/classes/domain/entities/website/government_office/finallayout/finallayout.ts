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
import { FinalLayoutFetchRequest } from "./finallayoutfetchrequest";


export class FinalLayoutProps {
  public readonly Db_Table_Name = "GovernmentFinalLayout";
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

  public IsFromSubmit: boolean = false;
  public IsSaatBaaraUtaraSubmit: boolean = false;
  public IsTentativeOrdervaNakashaSubmit: boolean = false;
  public IsSanadBinshetiSubmit: boolean = false;
  public IsKaPratSubmit: boolean = false;
  public IsULCSubmit: boolean = false;
  public IsHamiPatraSubmit: boolean = false;
  public IsBandhPatraSubmit: boolean = false;
  public IsRastavaKhuliJagaKabjepattiSubmit: boolean = false;
  public IsRoadNOCSubmit: boolean = false;

  public IsArjInwardSubmit: boolean = false;
  public ArjInwardNo: string = '';
  public ArjInwardDate: string = '';
  public IsRoadNOCSaatBaaraUtaraSubmit: boolean = false;
  public IsRoadNOCTentativeOrdervaNakashaSubmit: boolean = false;

  public IsSurveyarRemarkSubmit: boolean = false;
  public IsATPSiteVisitSubmit: boolean = false;
  public IsADTPSiteVisitSubmit: boolean = false;

  public OutwardNo: string = '';
  public OutwardDate: string = '';

  public IsGramSevakSubmit: boolean = false;
  public GramSevakInwardNo: string = '';
  public GramSevakInwardDate: string = '';
  public IsTahshilSubmit: boolean = false;
  public TahsilInwardNo: string = '';
  public TahsilInwardDate: string = '';
  public IsMojniSubmit: boolean = false;
  public MojniInwardNo: string = '';
  public MojniInwardDate: string = '';
  public IsCopyReceiveSubmit: boolean = false;

  public IsFinalLayoutCompleted: boolean = false;


  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new FinalLayoutProps(true);
  }
}

export class FinalLayout implements IPersistable<FinalLayout> {
  TransactionJson(TransactionJson: any) {
    throw new Error('Method not implemented.');
  }

  public IsComplete: boolean = false;

  public static readonly Db_Table_Name: string = 'GovernmentFinalLayout';

  private constructor(public readonly p: FinalLayoutProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): FinalLayout {
    let newState: FinalLayoutProps = Utils.GetInstance().DeepCopy(this.p);
    return FinalLayout.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new FinalLayout(FinalLayoutProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new FinalLayout(data as FinalLayoutProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.SiteRef == 0) vra.add('SiteWorkRef', 'Site Name cannot be blank.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company cannot be blank.');
    // if (this.p.TransactionJson == '') vra.add('TransactionJson', 'Transaction cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, FinalLayout.Db_Table_Name, this.p);
  }

  private static m_currentInstance: FinalLayout = FinalLayout.CreateNewInstance();

  public static GetCurrentInstance() {
    return FinalLayout.m_currentInstance;
  }

  public static SetCurrentInstance(value: FinalLayout) {
    FinalLayout.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): FinalLayout {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, FinalLayout.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, FinalLayout.Db_Table_Name)!.Entries) {
        return FinalLayout.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): FinalLayout[] {
    let result: FinalLayout[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, FinalLayout.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, FinalLayout.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(FinalLayout.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): FinalLayout[] {
    return FinalLayout.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: FinalLayoutFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new FinalLayoutFetchRequest();
    req.GovernmentTransationRefs.push(ref);

    let tdResponse = await FinalLayout.FetchTransportData(req, errorHandler) as TransportData;
    return FinalLayout.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: FinalLayoutFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await FinalLayout.FetchTransportData(req, errorHandler) as TransportData;
    return FinalLayout.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new FinalLayoutFetchRequest();
    let tdResponse = await FinalLayout.FetchTransportData(req, errorHandler) as TransportData;
    return FinalLayout.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new FinalLayoutFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await FinalLayout.FetchTransportData(req, errorHandler) as TransportData;
    return FinalLayout.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBySiteRef(SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new FinalLayoutFetchRequest();
    req.SiteRefs.push(SiteRef)
    let tdResponse = await FinalLayout.FetchTransportData(req, errorHandler) as TransportData;
    return FinalLayout.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyAndSiteRef(CompanyRef: number, SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new FinalLayoutFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    req.SiteRefs.push(SiteRef)
    let tdResponse = await FinalLayout.FetchTransportData(req, errorHandler) as TransportData;
    return FinalLayout.ListFromTransportData(tdResponse);
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
