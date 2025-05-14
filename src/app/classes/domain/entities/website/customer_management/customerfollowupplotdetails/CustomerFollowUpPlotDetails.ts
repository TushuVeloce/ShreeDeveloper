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
import { CustomerFollowUpPlotDetailsFetchRequest } from "./CustomerFollowUpPlotDetailsfetchrequest";

export class CustomerFollowUpPlotDetailsProps {
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public CustomerFollowUpRef: number = 0;
  public SiteRef: number = 0;
  public PlotRef: number = 0;
  public CustomerStatus: number = 0;
  public CustomerStatusName: string = '';
  public PlotAreaInSqm: number = 0;
  public PlotAreaInSqft: number = 0;
  // public Remark: string = '';
  public Reason: string = '';

  public readonly IsNewlyCreated: boolean = false;
  public SiteName: string = '';

  public PlotName: string = '';

  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new CustomerFollowUpPlotDetailsProps(true);
  }
}

export class CustomerFollowUpPlotDetails implements IPersistable<CustomerFollowUpPlotDetails> {
  public static readonly Db_Table_Name: string = 'CustomerFollowUpPlotDetailsMaster';

  private constructor(public readonly p: CustomerFollowUpPlotDetailsProps, public readonly AllowEdit: boolean) {

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

  public GetEditableVersion(): CustomerFollowUpPlotDetails {
    let newState: CustomerFollowUpPlotDetailsProps = Utils.GetInstance().DeepCopy(this.p);
    return CustomerFollowUpPlotDetails.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new CustomerFollowUpPlotDetails(CustomerFollowUpPlotDetailsProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new CustomerFollowUpPlotDetails(data as CustomerFollowUpPlotDetailsProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.PlotRef == 0) vra.add('PlotDetailsRef', 'PlotDetails cannot be blank.');
    if (this.p.CustomerStatus == 0) vra.add('CustomerStatus', 'CustomerStatus cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, CustomerFollowUpPlotDetails.Db_Table_Name, this.p);
  }

  private static m_currentInstance: CustomerFollowUpPlotDetails = CustomerFollowUpPlotDetails.CreateNewInstance();

  public static GetCurrentInstance() {
    return CustomerFollowUpPlotDetails.m_currentInstance;
  }

  public static SetCurrentInstance(value: CustomerFollowUpPlotDetails) {
    CustomerFollowUpPlotDetails.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): CustomerFollowUpPlotDetails {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, CustomerFollowUpPlotDetails.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, CustomerFollowUpPlotDetails.Db_Table_Name)!.Entries) {
        return CustomerFollowUpPlotDetails.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): CustomerFollowUpPlotDetails[] {
    let result: CustomerFollowUpPlotDetails[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, CustomerFollowUpPlotDetails.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, CustomerFollowUpPlotDetails.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(CustomerFollowUpPlotDetails.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): CustomerFollowUpPlotDetails[] {
    return CustomerFollowUpPlotDetails.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: CustomerFollowUpPlotDetailsFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new CustomerFollowUpPlotDetailsFetchRequest();
    req.CustomerFollowUpPlotDetailsRefs.push(ref);

    let tdResponse = await CustomerFollowUpPlotDetails.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerFollowUpPlotDetails.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: CustomerFollowUpPlotDetailsFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await CustomerFollowUpPlotDetails.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerFollowUpPlotDetails.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CustomerFollowUpPlotDetailsFetchRequest();
    let tdResponse = await CustomerFollowUpPlotDetails.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerFollowUpPlotDetails.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByCustomerFollowUpPlotDetailsRef(CustomerFollowUpPlotDetailsRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CustomerFollowUpPlotDetailsFetchRequest();
    req.CustomerFollowUpPlotDetailsRefs.push(CustomerFollowUpPlotDetailsRef)
    let tdResponse = await CustomerFollowUpPlotDetails.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerFollowUpPlotDetails.ListFromTransportData(tdResponse);
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
