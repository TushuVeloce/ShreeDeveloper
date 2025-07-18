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
import { NaLetterFetchRequest } from "./naletterfetchrequest";


export class NaLetterProps {
  public readonly Db_Table_Name = "GovernmentParishisthaNA";
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

  public IsTPPatraSubmit: boolean = false;
  public TPPatraInwardNo: string = '';
  public TPPatraInwardDate: string = '';
  public IsPradhikaranOfficePatraSubmit: boolean = false;
  public IsTentativeOrderMapSubmit: boolean = false;
  public IsZoneDakhalaMapSubmit: boolean = false;
  public IsEkonisheEkonPanasPasuncheSatbaraVaFerfarSubmit: boolean = false;
  public IsEPatrakSubmit: boolean = false;
  public IsInamPatraSubmit: boolean = false;
  public IsInamPatraSubmitTwo: boolean = false;

  public IsArjSubmit: boolean = false;
  public ArjInwardNo: string = '';
  public ArjInwardDate: string = '';
  public IsInamEkonisheEkonPanasPasuncheSatbaraVaFerfarSubmit: boolean = false;
  public IsInamZoneDakhalaMapSubmit: boolean = false;
  public IsPratijnaPatraSubmit: boolean = false;
  public IsValuationReportSubmit: boolean = false;
  public IsInamPatraSubmitThree: boolean = false;
  public IsChalanSubmit: boolean = false;
  public IsvargDonTeVargEkChaAadeshSubmit: boolean = false;
  
  public IsTPOfficeSubmit: boolean = false;
  public TPOfficeInwardNo: string = '';
  public TPOfficeInwardDate: string = '';
  public IsTalathiOfficeSubmit: boolean = false;
  public TalathiOfficeNo: string = '';
  public TalathiOfficeDate: string = '';

  public IsParishisthaNaComplete: boolean = false;


  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new NaLetterProps(true);
  }
}

export class NaLetter implements IPersistable<NaLetter> {
  TransactionJson(TransactionJson: any) {
    throw new Error('Method not implemented.');
  }

  public IsComplete: boolean = false;

  public static readonly Db_Table_Name: string = 'GovernmentNaLetter';

  private constructor(public readonly p: NaLetterProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): NaLetter {
    let newState: NaLetterProps = Utils.GetInstance().DeepCopy(this.p);
    return NaLetter.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new NaLetter(NaLetterProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new NaLetter(data as NaLetterProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.SiteRef == 0) vra.add('SiteWorkRef', 'Site Name cannot be blank.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company cannot be blank.');
    // if (this.p.TransactionJson == '') vra.add('TransactionJson', 'Transaction cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, NaLetter.Db_Table_Name, this.p);
  }

  private static m_currentInstance: NaLetter = NaLetter.CreateNewInstance();

  public static GetCurrentInstance() {
    return NaLetter.m_currentInstance;
  }

  public static SetCurrentInstance(value: NaLetter) {
    NaLetter.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): NaLetter {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, NaLetter.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, NaLetter.Db_Table_Name)!.Entries) {
        return NaLetter.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): NaLetter[] {
    let result: NaLetter[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, NaLetter.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, NaLetter.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(NaLetter.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): NaLetter[] {
    return NaLetter.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: NaLetterFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new NaLetterFetchRequest();
    req.GovernmentTransationRefs.push(ref);

    let tdResponse = await NaLetter.FetchTransportData(req, errorHandler) as TransportData;
    return NaLetter.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: NaLetterFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await NaLetter.FetchTransportData(req, errorHandler) as TransportData;
    return NaLetter.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new NaLetterFetchRequest();
    let tdResponse = await NaLetter.FetchTransportData(req, errorHandler) as TransportData;
    return NaLetter.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new NaLetterFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await NaLetter.FetchTransportData(req, errorHandler) as TransportData;
    return NaLetter.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBySiteRef(SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new NaLetterFetchRequest();
    req.SiteRefs.push(SiteRef)
    let tdResponse = await NaLetter.FetchTransportData(req, errorHandler) as TransportData;
    return NaLetter.ListFromTransportData(tdResponse);
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
