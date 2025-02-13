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
import { MarketingFetchRequest } from "./marketingfetchrequest";


export class MarketingProps {
  public readonly Db_Table_Name = "MarketingMaster";
  public Ref: number = 0;
  public MarketingModes: string = '';
  public MarketingType: string = '';


  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new MarketingProps(true);
  }
}

export class Marketing implements IPersistable<Marketing> {
  public static readonly Db_Table_Name: string = 'MarketingMaster';

  private constructor(public readonly p: MarketingProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Marketing {
    let newState: MarketingProps = Utils.GetInstance().DeepCopy(this.p);
    return Marketing.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Marketing(MarketingProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Marketing(data as MarketingProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.MarketingModes == '') vra.add('Marketing Modes', 'Marketing Modes cannot be blank.');
    if (this.p.MarketingType == '') vra.add('Marketing Type', 'Marketing Type cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Marketing.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Marketing = Marketing.CreateNewInstance();

  public static GetCurrentInstance() {
    return Marketing.m_currentInstance;
  }

  public static SetCurrentInstance(value: Marketing) {
    Marketing.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Marketing {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Marketing.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Marketing.Db_Table_Name)!.Entries) {
        return Marketing.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): Marketing[] {
    let result: Marketing[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Marketing.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Marketing.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Marketing.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Marketing[] {
    return Marketing.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: MarketingFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new MarketingFetchRequest();
    req.MarketingRef.push(ref);

    let tdResponse = await Marketing.FetchTransportData(req, errorHandler) as TransportData;
    return Marketing.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: MarketingFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Marketing.FetchTransportData(req, errorHandler) as TransportData;
    return Marketing.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new MarketingFetchRequest();
    let tdResponse = await Marketing.FetchTransportData(req, errorHandler) as TransportData;
    return Marketing.ListFromTransportData(tdResponse);
  }
  // public static async FetchEntireListByProjectRef(ProjectRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
  //   let req = new MarketingFetchRequest();
  //   req.GAAProjectRefs.push(ProjectRef)
  //   let tdResponse = await Marketing.FetchTransportData(req, errorHandler) as TransportData;
  //   return Marketing.ListFromTransportData(tdResponse);
  // }

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
