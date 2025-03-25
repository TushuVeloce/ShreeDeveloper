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
import { CustomerEnquiryFetchRequest } from "./customerenquiryfetchrequest";
import { CustomerFollowUpProps } from "../customerfollowup/customerfollowup";
import { CustomerFollowUpPlotDetailsProps } from "../customerfollowupplotdetails/CustomerFollowUpPlotDetails";


export class CustomerEnquiryProps {
  public Ref: number = 0;
  public Name: string = '';
  public ContactNos: string = '';
  public EmailId: string = '';
  public Address: string = '';
  public PinCode: string = '';
  public CountryRef:  number = 9163;
  public readonly CountryName: string='';
  public StateRef:  number = 10263;
  public readonly StateName: string='';
  public CityRef:  number = 10374 ;
  public readonly CityName: string='';
  // public Date: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';

  // public CustomerFollowUpPlotDetails: CustomerFollowUpPlotDetailsProps = new Object() as CustomerFollowUpPlotDetailsProps;

  public CustomerFollowUps: CustomerFollowUpProps []=[ CustomerFollowUpProps.Blank()];


  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new CustomerEnquiryProps(true);
  }
}

export class CustomerEnquiry implements IPersistable<CustomerEnquiry> {
  public static readonly Db_Table_Name: string = 'CustomerEnquiry';

  private constructor(public readonly p: CustomerEnquiryProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): CustomerEnquiry {
    let newState: CustomerEnquiryProps = Utils.GetInstance().DeepCopy(this.p);
    return CustomerEnquiry.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new CustomerEnquiry(CustomerEnquiryProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new CustomerEnquiry(data as CustomerEnquiryProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    // if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
    // if (this.p.Date == '') vra.add('Date', 'Date cannot be blank.');
    // if (this.p.ContactNos == '') vra.add('OwnerName', 'Owner Name cannot be blank.');
    // if (this.p.EmailId == '') vra.add('EmailId', 'Email Id cannot be blank.');
    // if (this.p.PinCode == '') vra.add('PinCode', 'Pin code cannot be blank.');
    // if (this.p.Address == '') vra.add('AddressLine1', 'AddressLine1 cannot be blank.');
    // if (this.p.CountryRef == 0) vra.add('CountryRef', 'Country Name cannot be blank.');
    // if (this.p.StateRef == 0) vra.add('StateRef', 'State Name cannot be blank.');
    // if (this.p.CityRef == 0) vra.add('CityRef', 'City Name cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, CustomerEnquiry.Db_Table_Name, this.p);
  }

  private static m_currentInstance: CustomerEnquiry = CustomerEnquiry.CreateNewInstance();

  public static GetCurrentInstance() {
    return CustomerEnquiry.m_currentInstance;
  }

  public static SetCurrentInstance(value: CustomerEnquiry) {
    CustomerEnquiry.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): CustomerEnquiry {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, CustomerEnquiry.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, CustomerEnquiry.Db_Table_Name)!.Entries) {
        return CustomerEnquiry.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): CustomerEnquiry[] {
    let result: CustomerEnquiry[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, CustomerEnquiry.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, CustomerEnquiry.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(CustomerEnquiry.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): CustomerEnquiry[] {
    return CustomerEnquiry.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: CustomerEnquiryFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new CustomerEnquiryFetchRequest();
    req.CustomerEnquiryRefs.push(ref);

    let tdResponse = await CustomerEnquiry.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerEnquiry.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: CustomerEnquiryFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await CustomerEnquiry.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerEnquiry.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CustomerEnquiryFetchRequest();
    let tdResponse = await CustomerEnquiry.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerEnquiry.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByCustomerEnquiryRef(CustomerEnquiryRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CustomerEnquiryFetchRequest();
    req.CustomerEnquiryRefs.push(CustomerEnquiryRef)
    let tdResponse = await CustomerEnquiry.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerEnquiry.ListFromTransportData(tdResponse);
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
