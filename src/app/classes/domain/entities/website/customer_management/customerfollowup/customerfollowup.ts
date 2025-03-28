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
import { CustomerFollowUpFetchRequest } from "./customerfollowupfetchrequest";
import { CustomerFollowUpPlotDetailsProps } from "../customerfollowupplotdetails/CustomerFollowUpPlotDetails";


export class CustomerFollowUpProps {
  public Ref: number = 0;
  public CustomerEnquiryRef: number = 0;
  public CustomerRequirement: string = '';
  public LeadSource: number = 0;
  public LeadHandleBy: number = 0;
  public BrokerName: string = '';
  public ContactMode: number = 0;
  public CustomerStatus: number = 0;
  public SiteVisitDate: string = '';
  public OfficeVisitDate: string = '';
  public TransDateTime: string = '';
  public Reason: string = '';
  public Remark: string = '';

  public CustomerStatusName: string = '';
  public ReminderDate: string = '';
  public ContactNos: string = '';
  public CustomerName: string = '';
  public CountryName: string = '';
  public StateName: string = '';
  public CityName: string = '';
  public Address: string = '';
  public PinCode: string = '';

  public CompanyRef: number = 0;

  public CustomerFollowUpPlotDetails: CustomerFollowUpPlotDetailsProps[] = [];

  public IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new CustomerFollowUpProps(true);
  }
}

export class CustomerFollowUp implements IPersistable<CustomerFollowUp> {
  public static readonly Db_Table_Name: string = 'CustomerFollowUp';

  private constructor(public readonly p: CustomerFollowUpProps, public readonly AllowEdit: boolean) {

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

  public GetEditableVersion(): CustomerFollowUp {
    let newState: CustomerFollowUpProps = Utils.GetInstance().DeepCopy(this.p);
    return CustomerFollowUp.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new CustomerFollowUp(CustomerFollowUpProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new CustomerFollowUp(data as CustomerFollowUpProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.CustomerEnquiryRef == 0) vra.add('CustomerEnquiryRef', 'CustomerEnquiry Name cannot be blank.');
    // if (this.p.CustomerRequirement == '') vra.add('CustomerRequirement', 'CustomerRequirement cannot be blank.');
    if (this.p.LeadSource == 0) vra.add('LeadSource ', 'LeadSource  cannot be blank.');
    if (this.p.LeadHandleBy == 0) vra.add('LeadHandelBy', 'LeadHandelBy  cannot be blank.');
    // if (this.p.BrokerName == '') vra.add('BrokerName', 'BrokerName cannot be blank.');
    if (this.p.ContactMode == 0) vra.add('CustomerFollowUpType', 'ContactMode cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, CustomerFollowUp.Db_Table_Name, this.p);
  }

  private static m_currentInstance: CustomerFollowUp = CustomerFollowUp.CreateNewInstance();

  public static GetCurrentInstance() {
    return CustomerFollowUp.m_currentInstance;
  }

  public static SetCurrentInstance(value: CustomerFollowUp) {
    CustomerFollowUp.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): CustomerFollowUp {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, CustomerFollowUp.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, CustomerFollowUp.Db_Table_Name)!.Entries) {
        return CustomerFollowUp.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): CustomerFollowUp[] {
    let result: CustomerFollowUp[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, CustomerFollowUp.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, CustomerFollowUp.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(CustomerFollowUp.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): CustomerFollowUp[] {
    return CustomerFollowUp.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: CustomerFollowUpFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new CustomerFollowUpFetchRequest();
    // req.CustomerFollowUpRefs.push(ref);

    let tdResponse = await CustomerFollowUp.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerFollowUp.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: CustomerFollowUpFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await CustomerFollowUp.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerFollowUp.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CustomerFollowUpFetchRequest();
    let tdResponse = await CustomerFollowUp.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerFollowUp.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByCustomerFollowUpRef(CustomerFollowUpRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CustomerFollowUpFetchRequest();
    // req.CustomerFollowUpRefs.push(CustomerFollowUpRef)
    let tdResponse = await CustomerFollowUp.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerFollowUp.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCustomerEnquiryRef(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CustomerFollowUpFetchRequest();

    let tdResponse = await CustomerFollowUp.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerFollowUp.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByDate(ReminderDate:string,errorHandler: ( err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CustomerFollowUpFetchRequest();
    req.ReminderDate.push(ReminderDate)
    let tdResponse = await CustomerFollowUp.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerFollowUp.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBySiteRef(siteref:number,errorHandler: ( err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CustomerFollowUpFetchRequest();
    req.SiteManagemetRefs.push(siteref)
    let tdResponse = await CustomerFollowUp.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerFollowUp.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByandDateSiteRef(ReminderDate:string,siteref:number,errorHandler: ( err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CustomerFollowUpFetchRequest();
    req.ReminderDate.push(ReminderDate)
    req.SiteManagemetRefs.push(siteref)
    let tdResponse = await CustomerFollowUp.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerFollowUp.ListFromTransportData(tdResponse);
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
