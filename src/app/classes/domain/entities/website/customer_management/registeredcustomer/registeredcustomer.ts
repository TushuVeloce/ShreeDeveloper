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
import { RegisteredCustomerFetchRequest } from "./registeredcustomerfetchrequest";


export class RegisteredCustomerProps {
  public Ref: number = 0;
  public SiteRef : number = 0;
  public CustomerEnquiryRef: number = 0;
  public DiscountedRateOnArea : number = 0;
  public DiscountOnTotalPlotAmount : number = 0;
  public TotalPlotAmount: number = 0;
  public RegisterDate: string = '';
  public RegisterBy: string = '';
  public GovernmentValue: number = 0;
  public ValueOfAgreement: number = 0;
  public TaxValueInPercentage : number = 0;
  public StampDuties : number = 0;
  public RegTaxValuesInPercentage:  number = 0;
  public RegistrationFees:  number = 0;
  public GoodsServicesTax:  number = 0;
  public LegalCharges:  number = 0;
  public TotalExtraCharges:  number = 0;
  public GrandTotal:  number = 0;
  public AmountPaid:  number = 0;
  public RemainingAmount:  number = 0;
  public GstToatalAmount:  number = 0;


  public readonly IsNewlyCreated: boolean = false;

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new RegisteredCustomerProps(true);
  }
}

export class RegisteredCustomer implements IPersistable<RegisteredCustomer> {
  public static readonly Db_Table_Name: string = 'RegisterCustomer';

  private constructor(public readonly p: RegisteredCustomerProps, public readonly AllowEdit: boolean) {

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

  public GetEditableVersion(): RegisteredCustomer {
    let newState: RegisteredCustomerProps = Utils.GetInstance().DeepCopy(this.p);
    return RegisteredCustomer.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new RegisteredCustomer(RegisteredCustomerProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new RegisteredCustomer(data as RegisteredCustomerProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.CustomerEnquiryRef == 0) vra.add('CustomerEnquiryRef', 'CustomerEnquiry Name cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, RegisteredCustomer.Db_Table_Name, this.p);
  }

  private static m_currentInstance: RegisteredCustomer = RegisteredCustomer.CreateNewInstance();

  public static GetCurrentInstance() {
    return RegisteredCustomer.m_currentInstance;
  }

  public static SetCurrentInstance(value: RegisteredCustomer) {
    RegisteredCustomer.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): RegisteredCustomer {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, RegisteredCustomer.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, RegisteredCustomer.Db_Table_Name)!.Entries) {
        return RegisteredCustomer.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): RegisteredCustomer[] {
    let result: RegisteredCustomer[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, RegisteredCustomer.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, RegisteredCustomer.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(RegisteredCustomer.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): RegisteredCustomer[] {
    return RegisteredCustomer.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: RegisteredCustomerFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new RegisteredCustomerFetchRequest();
    req.RegisteredCustomerRefs.push(ref);

    let tdResponse = await RegisteredCustomer.FetchTransportData(req, errorHandler) as TransportData;
    return RegisteredCustomer.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: RegisteredCustomerFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await RegisteredCustomer.FetchTransportData(req, errorHandler) as TransportData;
    return RegisteredCustomer.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new RegisteredCustomerFetchRequest();
    let tdResponse = await RegisteredCustomer.FetchTransportData(req, errorHandler) as TransportData;
    return RegisteredCustomer.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new RegisteredCustomerFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await RegisteredCustomer.FetchTransportData(req, errorHandler) as TransportData;
    return RegisteredCustomer.ListFromTransportData(tdResponse);
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
