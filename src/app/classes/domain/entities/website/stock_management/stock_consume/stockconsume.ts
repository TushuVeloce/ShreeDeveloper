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
import { StockConsumeFetchRequest } from "./stockconsumefetchrequest";


export class StockConsumeProps {
  public readonly Db_Table_Name = "StockConsume";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public Date: string = '';
  public SiteRef: number = 0;
  public readonly SiteName: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public Status: number = 0
  // public StockConsumeDetailsArray: RequiredMaterialDetailProps[] = [];


  public readonly IsNewlyCreated: boolean = false;
  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new StockConsumeProps(true);
  }
}

export class StockConsume implements IPersistable<StockConsume> {
  public static readonly Db_Table_Name: string = 'StockConsume';

  public constructor(public readonly p: StockConsumeProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): StockConsume {
    let newState: StockConsumeProps = Utils.GetInstance().DeepCopy(this.p);
    return StockConsume.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new StockConsume(StockConsumeProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new StockConsume(data as StockConsumeProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, StockConsume.Db_Table_Name, this.p);
  }

  private static m_currentInstance: StockConsume = StockConsume.CreateNewInstance();

  public static GetCurrentInstance() {
    return StockConsume.m_currentInstance;
  }

  public static SetCurrentInstance(value: StockConsume) {
    StockConsume.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): StockConsume {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, StockConsume.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, StockConsume.Db_Table_Name)!.Entries) {
        return StockConsume.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
   sortPropertyName: string = ""): StockConsume[] {
    let result: StockConsume[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, StockConsume.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, StockConsume.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(StockConsume.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): StockConsume[] {
    return StockConsume.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: StockConsumeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new StockConsumeFetchRequest();
    req.StockConsumeManagementRefs.push(ref);

    let tdResponse = await StockConsume.FetchTransportData(req, errorHandler) as TransportData;
    return StockConsume.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: StockConsumeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await StockConsume.FetchTransportData(req, errorHandler) as TransportData;
    return StockConsume.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new StockConsumeFetchRequest();
    let tdResponse = await StockConsume.FetchTransportData(req, errorHandler) as TransportData;
    return StockConsume.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new StockConsumeFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await StockConsume.FetchTransportData(req, errorHandler) as TransportData;
    return StockConsume.ListFromTransportData(tdResponse);
  }

   public static async FetchEntireListByAllFilters(CompanyRef: number, Status: number, SiteRef: number,  errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
        let req = new StockConsumeFetchRequest();
        req.CompanyRefs.push(CompanyRef)
        if (Status) {
          req.StockConsumeStatus.push(Status)
        }
        if (SiteRef) {
          req.SiteRefs.push(SiteRef)
        }
        let tdResponse = await StockConsume.FetchTransportData(req, errorHandler) as TransportData;
        return StockConsume.ListFromTransportData(tdResponse);
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
