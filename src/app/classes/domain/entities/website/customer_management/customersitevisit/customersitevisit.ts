import { IPersistable } from 'src/app/classes/infrastructure/IPersistable';
import { DataContainer } from 'src/app/classes/infrastructure/datacontainer';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { ValidationResultAccumulator } from 'src/app/classes/infrastructure/validationresultaccumulator';
import { IdProvider } from 'src/app/services/idprovider.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { Utils } from 'src/app/services/utils.service';
import { isNullOrUndefined } from 'src/tools';
import { UIUtils } from 'src/app/services/uiutils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { CustomerSiteVisitFetchRequest } from './customersitevisitfetchrequest';
import { CustomerFollowUpProps } from '../customerfollowup/customerfollowup';
import { CountryStateCityRefs, ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';

export class CustomerSiteVisitProps {
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;

  public CustomerName: string = '';
  public CustomerAddress: string = '';
  public CustomerPhoneNo: string = '';
  public SiteRef: number = 0;
  public readonly SiteName: number = 0;
  public PlotNo: string = '';
  public CustomerRequirement: string = '';
  public TransDateTime: string = '';

  public IsNewlyCreated: boolean = false;

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new CustomerSiteVisitProps(true);
  }
}

export class CustomerSiteVisit implements IPersistable<CustomerSiteVisit> {
  public static readonly Db_Table_Name: string = 'CustomerSiteVisit';

  private constructor(
    public readonly p: CustomerSiteVisitProps,
    public readonly AllowEdit: boolean
  ) { }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0)
        throw new Error('Cannot assign Id. Please try again');
    }
  }

  public GetEditableVersion(): CustomerSiteVisit {
    let newState: CustomerSiteVisitProps = Utils.GetInstance().DeepCopy(this.p);
    return CustomerSiteVisit.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new CustomerSiteVisit(CustomerSiteVisitProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new CustomerSiteVisit(data as CustomerSiteVisitProps, allowEdit);
  }

  public CheckSaveValidity(
    _td: TransportData,
    vra: ValidationResultAccumulator
  ): void {
    if (!this.AllowEdit)
      vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(
      td.MainData,
      CustomerSiteVisit.Db_Table_Name,
      this.p
    );
  }

  private static m_currentInstance: CustomerSiteVisit =
    CustomerSiteVisit.CreateNewInstance();

  public static GetCurrentInstance() {
    return CustomerSiteVisit.m_currentInstance;
  }

  public static SetCurrentInstance(value: CustomerSiteVisit) {
    CustomerSiteVisit.m_currentInstance = value;
  }

  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(
    td: TransportData
  ): CustomerSiteVisit {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, CustomerSiteVisit.Db_Table_Name)) {
      for (let data of dcs.GetCollection(
        td.MainData,
        CustomerSiteVisit.Db_Table_Name
      )!.Entries) {
        return CustomerSiteVisit.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(
    cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = 'Name'
  ): CustomerSiteVisit[] {
    let result: CustomerSiteVisit[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, CustomerSiteVisit.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, CustomerSiteVisit.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate))
        entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(CustomerSiteVisit.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): CustomerSiteVisit[] {
    return CustomerSiteVisit.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(
    req: CustomerSiteVisitFetchRequest,
    errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance()
      .GlobalUIErrorHandler
  ) {
    let tdRequest = req.FormulateTransportData();
    let pktRequest =
      PayloadPacketFacade.GetInstance().CreateNewPayloadPacket2(tdRequest);

    let tr = await ServerCommunicatorService.GetInstance().sendHttpRequest(
      pktRequest
    );
    if (!tr.Successful) {
      if (!isNullOrUndefined(errorHandler)) await errorHandler(tr.Message);
      return null;
    }

    let tdResponse = JSON.parse(tr.Tag) as TransportData;
    return tdResponse;
  }

  public static async FetchInstance(
    ref: number,
    errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance()
      .GlobalUIErrorHandler
  ) {
    let req = new CustomerSiteVisitFetchRequest();
    req.CustomerSiteVisitRefs.push(ref);

    let tdResponse = (await CustomerSiteVisit.FetchTransportData(
      req,
      errorHandler
    )) as TransportData;
    return CustomerSiteVisit.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(
    req: CustomerSiteVisitFetchRequest,
    errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance()
      .GlobalUIErrorHandler
  ) {
    let tdResponse = (await CustomerSiteVisit.FetchTransportData(
      req,
      errorHandler
    )) as TransportData;
    return CustomerSiteVisit.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(
    errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance()
      .GlobalUIErrorHandler
  ) {
    let req = new CustomerSiteVisitFetchRequest();
    let tdResponse = (await CustomerSiteVisit.FetchTransportData(
      req,
      errorHandler
    )) as TransportData;
    return CustomerSiteVisit.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByCustomerSiteVisitRef(
    CustomerSiteVisitRef: number,
    errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance()
      .GlobalUIErrorHandler
  ) {
    let req = new CustomerSiteVisitFetchRequest();
    req.CustomerSiteVisitRefs.push(CustomerSiteVisitRef);
    let tdResponse = (await CustomerSiteVisit.FetchTransportData(
      req,
      errorHandler
    )) as TransportData;
    return CustomerSiteVisit.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CustomerSiteVisitFetchRequest();
    req.CompanyRefs.push(CompanyRef);
    let tdResponse = (await CustomerSiteVisit.FetchTransportData(req,errorHandler)) as TransportData;
    return CustomerSiteVisit.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBySiteRef(SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CustomerSiteVisitFetchRequest();
    req.SiteRef = SiteRef
    let tdResponse = await CustomerSiteVisit.FetchTransportData(req, errorHandler) as TransportData;
    return CustomerSiteVisit.ListFromTransportData(tdResponse);
  }

  public async DeleteInstance(
    successHandler: () => Promise<void> = null!,
    errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance()
      .GlobalUIErrorHandler
  ) {
    let tdRequest = new TransportData();
    tdRequest.RequestType = RequestTypes.Deletion;

    this.MergeIntoTransportData(tdRequest);
    let pktRequest =
      PayloadPacketFacade.GetInstance().CreateNewPayloadPacket2(tdRequest);

    let tr = await ServerCommunicatorService.GetInstance().sendHttpRequest(
      pktRequest
    );
    if (!tr.Successful) {
      if (!isNullOrUndefined(errorHandler)) await errorHandler(tr.Message);
    } else {
      if (!isNullOrUndefined(successHandler)) await successHandler();
    }
  }
}
