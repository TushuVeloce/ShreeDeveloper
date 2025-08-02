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
import { DealCancelledCustomerFetchRequest } from "./dealcancelledcustomerfetchrequest";
import { ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";


export class DealCancelledCustomerProps {
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public CustomerName: string = '';
  public Address: string = '';
  public ContactNos : string = '';
  public CityName: string = '';
  public PlotNo: string = '';
  public SiteRef: number = 0;
  public SiteName: string = '';
  public Reason: string = '';


  public readonly IsNewlyCreated: boolean = false;

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new DealCancelledCustomerProps(true);
  }
}

export class DealCancelledCustomer implements IPersistable<DealCancelledCustomer> {
  public static readonly Db_Table_Name: string = 'DealCancelledCustomer';

  private constructor(public readonly p: DealCancelledCustomerProps, public readonly AllowEdit: boolean) {

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

  public GetEditableVersion(): DealCancelledCustomer {
    let newState: DealCancelledCustomerProps = Utils.GetInstance().DeepCopy(this.p);
    return DealCancelledCustomer.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new DealCancelledCustomer(DealCancelledCustomerProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new DealCancelledCustomer(data as DealCancelledCustomerProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, DealCancelledCustomer.Db_Table_Name, this.p);
  }

  private static m_currentInstance: DealCancelledCustomer = DealCancelledCustomer.CreateNewInstance();

  public static GetCurrentInstance() {
    return DealCancelledCustomer.m_currentInstance;
  }

  public static SetCurrentInstance(value: DealCancelledCustomer) {
    DealCancelledCustomer.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): DealCancelledCustomer {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, DealCancelledCustomer.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, DealCancelledCustomer.Db_Table_Name)!.Entries) {
        return DealCancelledCustomer.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): DealCancelledCustomer[] {
    let result: DealCancelledCustomer[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, DealCancelledCustomer.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, DealCancelledCustomer.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(DealCancelledCustomer.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): DealCancelledCustomer[] {
    return DealCancelledCustomer.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: DealCancelledCustomerFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new DealCancelledCustomerFetchRequest();
    req.DealCancelledCustomerRefs.push(ref);

    let tdResponse = await DealCancelledCustomer.FetchTransportData(req, errorHandler) as TransportData;
    return DealCancelledCustomer.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: DealCancelledCustomerFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await DealCancelledCustomer.FetchTransportData(req, errorHandler) as TransportData;
    return DealCancelledCustomer.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new DealCancelledCustomerFetchRequest();
    let tdResponse = await DealCancelledCustomer.FetchTransportData(req, errorHandler) as TransportData;
    return DealCancelledCustomer.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new DealCancelledCustomerFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await DealCancelledCustomer.FetchTransportData(req, errorHandler) as TransportData;
    return DealCancelledCustomer.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBySiteRef(SiteRef: number, CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new DealCancelledCustomerFetchRequest();
    req.CompanyRef = CompanyRef
    if(SiteRef){
      req.SiteRef = SiteRef
    }
    let tdResponse = await DealCancelledCustomer.FetchTransportData(req, errorHandler) as TransportData;
    return DealCancelledCustomer.ListFromTransportData(tdResponse);
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
