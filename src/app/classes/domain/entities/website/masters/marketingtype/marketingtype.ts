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
import { MarketingTypeFetchRequest } from "./marketingtypefetchrequest";


export class MarketingTypeProps {
  public readonly Db_Table_Name = "MarketingTypeMaster";
  public Ref: number = 0;
  public Description: string = '';
  public MarketingMode: number = 0;
  public readonly MarketingModeName: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';

  public readonly IsNewlyCreated: boolean = false;

  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new MarketingTypeProps(true);
  }
}

export class MarketingType implements IPersistable<MarketingType> {
  public static readonly Db_Table_Name: string = 'MarketingTypeMaster';

  private constructor(public readonly p: MarketingTypeProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): MarketingType {
    let newState: MarketingTypeProps = Utils.GetInstance().DeepCopy(this.p);
    return MarketingType.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new MarketingType(MarketingTypeProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new MarketingType(data as MarketingTypeProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.MarketingMode == 0) vra.add('Marketing Modes', 'Marketing Modes cannot be blank.');
    if (this.p.Description == '') vra.add('Description', 'Description cannot be blank.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company Name cannot be blank.');

  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, MarketingType.Db_Table_Name, this.p);
  }

  private static m_currentInstance: MarketingType = MarketingType.CreateNewInstance();

  public static GetCurrentInstance() {
    return MarketingType.m_currentInstance;
  }

  public static SetCurrentInstance(value: MarketingType) {
    MarketingType.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): MarketingType {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, MarketingType.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, MarketingType.Db_Table_Name)!.Entries) {
        return MarketingType.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): MarketingType[] {
    let result: MarketingType[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, MarketingType.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, MarketingType.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(MarketingType.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): MarketingType[] {
    return MarketingType.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: MarketingTypeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new MarketingTypeFetchRequest();
    req.MarketingTypeRefs.push(ref);

    let tdResponse = await MarketingType.FetchTransportData(req, errorHandler) as TransportData;
    return MarketingType.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: MarketingTypeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await MarketingType.FetchTransportData(req, errorHandler) as TransportData;
    return MarketingType.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MarketingTypeFetchRequest();
    let tdResponse = await MarketingType.FetchTransportData(req, errorHandler) as TransportData;
    return MarketingType.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByCompanyRef(CompanyRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MarketingTypeFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await MarketingType.FetchTransportData(req, errorHandler) as TransportData;
    return MarketingType.ListFromTransportData(tdResponse);
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
