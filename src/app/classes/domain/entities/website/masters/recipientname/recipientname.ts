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
import { CountryStateCityRefs, ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";
import { RecipientFetchRequest } from "./recipientnamefetchrequest";


export class RecipientProps {
  public readonly Db_Table_Name = "RecipientMaster";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public Name: string = '';

  public readonly IsNewlyCreated: boolean = false;

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new RecipientProps(true);
  }
}

export class Recipient implements IPersistable<Recipient> {
  public static readonly Db_Table_Name: string = 'RecipientMaster';

  private constructor(public readonly p: RecipientProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Recipient {
    let newState: RecipientProps = Utils.GetInstance().DeepCopy(this.p);
    return Recipient.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Recipient(RecipientProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Recipient(data as RecipientProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') { vra.add('Name', 'Name cannot be blank.'); }
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company Name cannot be blank.');

  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Recipient.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Recipient = Recipient.CreateNewInstance();

  public static GetCurrentInstance() {
    return Recipient.m_currentInstance;
  }

  public static SetCurrentInstance(value: Recipient) {
    Recipient.m_currentInstance = value;
  }

  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Recipient {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Recipient.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Recipient.Db_Table_Name)!.Entries) {
        return Recipient.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): Recipient[] {
    let result: Recipient[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Recipient.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Recipient.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Recipient.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Recipient[] {
    return Recipient.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: RecipientFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new RecipientFetchRequest();
    req.RecipientRefs.push(ref);

    let tdResponse = await Recipient.FetchTransportData(req, errorHandler) as TransportData;
    return Recipient.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: RecipientFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Recipient.FetchTransportData(req, errorHandler) as TransportData;
    return Recipient.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new RecipientFetchRequest();
    let tdResponse = await Recipient.FetchTransportData(req, errorHandler) as TransportData;
    return Recipient.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new RecipientFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await Recipient.FetchTransportData(req, errorHandler) as TransportData;
    return Recipient.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByStageRef(StageRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new RecipientFetchRequest();
    req.StageRefs.push(StageRef)
    let tdResponse = await Recipient.FetchTransportData(req, errorHandler) as TransportData;
    return Recipient.ListFromTransportData(tdResponse);
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
