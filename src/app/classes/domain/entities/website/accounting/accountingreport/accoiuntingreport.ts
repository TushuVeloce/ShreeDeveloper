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
import { ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";
import { AccountingReportFetchRequest } from "./accountingreportrequest";
import { AccountingReports } from "src/app/classes/domain/domainenums/domainenums";


export class AccountingReportProps {
  public readonly Db_Table_Name = "IncomeExpenseLedger";
  public Ref: number = 0;
  public CompanyRef: number = 0
  public CompanyName: string = ''
  public TransDateTime: string = ''
  public PayerName: string = ''
  public RecipientName: string = ''
  public SiteRef: number = 0
  public SiteName: string = ''
  public Reason: string = ''
  public IncomeAmount: number = 0
  public GivenAmount: number = 0
  public ShreesBalance: number = 0
  public ModeOfPayment: number = 0
  public ModeOfPaymentName: string = ''
  public Narration: string = ''
  public StartDate: string = ''
  public EndDate: string = ''
  public AccountingReport: number = 0


  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new AccountingReportProps(true);
  }
}

export class AccountingReport implements IPersistable<AccountingReport> {
  public static readonly Db_Table_Name: string = 'IncomeExpenseLedger';

  private constructor(public readonly p: AccountingReportProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): AccountingReport {
    let newState: AccountingReportProps = Utils.GetInstance().DeepCopy(this.p);
    return AccountingReport.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new AccountingReport(AccountingReportProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new AccountingReport(data as AccountingReportProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, AccountingReport.Db_Table_Name, this.p);
  }

  private static m_currentInstance: AccountingReport = AccountingReport.CreateNewInstance();

  public static GetCurrentInstance() {
    return AccountingReport.m_currentInstance;
  }

  public static SetCurrentInstance(value: AccountingReport) {
    AccountingReport.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): AccountingReport {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, AccountingReport.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, AccountingReport.Db_Table_Name)!.Entries) {
        return AccountingReport.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    //sortPropertyName: string = "Name"): AccountingReport[] {
    sortPropertyName: string = ""): AccountingReport[] {
    let result: AccountingReport[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, AccountingReport.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, AccountingReport.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(AccountingReport.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): AccountingReport[] {
    return AccountingReport.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: AccountingReportFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new AccountingReportFetchRequest();
    req.AccountingReportRefs.push(ref);

    let tdResponse = await AccountingReport.FetchTransportData(req, errorHandler) as TransportData;
    return AccountingReport.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: AccountingReportFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await AccountingReport.FetchTransportData(req, errorHandler) as TransportData;
    return AccountingReport.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new AccountingReportFetchRequest();
    let tdResponse = await AccountingReport.FetchTransportData(req, errorHandler) as TransportData;
    return AccountingReport.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new AccountingReportFetchRequest();
    req.CompanyRef = CompanyRef
    let tdResponse = await AccountingReport.FetchTransportData(req, errorHandler) as TransportData;
    return AccountingReport.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByFilters(StartDate: string, EndDate: string, accountingreport: number, SiteRef: number, ModeOfPayment: number, CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new AccountingReportFetchRequest();
    req.CompanyRef = CompanyRef
    if (StartDate) {
      req.StartDate = StartDate
    }
    if (EndDate) {
      req.EndDate = EndDate
    }
    if (SiteRef) {
      req.SiteRef = SiteRef
    }
    if (ModeOfPayment) {
      req.ModeOfPayments = ModeOfPayment
    }
    if (accountingreport) {
      req.AccountingReport = accountingreport
    }
    let tdResponse = await AccountingReport.FetchTransportData(req, errorHandler) as TransportData;
    return AccountingReport.ListFromTransportData(tdResponse);
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
