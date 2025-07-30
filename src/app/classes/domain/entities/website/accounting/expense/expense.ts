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
import { ExpenseFetchRequest } from "./expensefetchrequest";
import { ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";
import { TotalExpenseFetchRequest } from "./totalexpensefetchrequest";
import { CurrentBalanceFetchRequest } from "./currentbalancefetchrequest";

export class ExpenseProps {
  public readonly Db_Table_Name = "Expense";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public CompanyRef: number = 0
  public CompanyName: string = ''


  public Date: string = ''
  public SiteRef: number = 0
  public readonly SiteName: string = ''
  public LedgerRef: number = 0
  public readonly LedgerName: string = ''
  public SubLedgerRef: number = 0
  public readonly SubLedgerName: string = ''
  public RecipientRef: number = 0
  public RecipientName: string = ''
  public IsSiteRef: number = 0
  public Reason: string = ''
  public InvoiceAmount: number = 0
  public Narration: string = ''
  public TransDateTime: string = ''
  public CreatedDate: string = ''
  public UpdatedDate: string = ''
  public IsAutoInvoiceEnabled: number = 0
  public IsAdvancePayment: number = 0
  public RecipientType: number = 0
  public ExpenseLogicalRefToIncome: number = 0
  public ExpenseLogicalRefToInvoice: number = 0
  public IncomeLedgerRef: number = 0
  public IncomeLedgerName: string = ''
  public IncomeSubLedgerRef: number = 0
  public IncomeSubLedgerName: string = ''
  public RemainingAdvance: number = 0;
  public IsSalaryExpense: boolean = false;
  public PlotRef: number = 0
  public PlotName: string = ''

  public GivenAmount: number = 0
  public TotalAdvance: number = 0
  public RemainingAmount: number = 0
  public ShreesBalance: number = 0
  public ExpenseModeOfPayment: number = 0
  public ModeOfPaymentName: string = ''
  public BankAccountRef: number = 0
  public IsRegisterCustomerRef: number = 0


  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new ExpenseProps(true);
  }
}

export class Expense implements IPersistable<Expense> {
  public static readonly Db_Table_Name: string = 'Expense';

  private constructor(public readonly p: ExpenseProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Expense {
    let newState: ExpenseProps = Utils.GetInstance().DeepCopy(this.p);
    return Expense.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Expense(ExpenseProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Expense(data as ExpenseProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');

    if (this.p.CompanyRef <= 0) { vra.add('CompanyRef', 'Company Name cannot be blank.'); }
    if (this.p.Date == '') { vra.add('Date', 'Date cannot be blank.'); }
    if (this.p.SiteRef <= 0) { vra.add('SiteRef', 'Site Name cannot be blank.'); }
    if (this.p.LedgerRef <= 0) { vra.add('LedgerRef', 'Ledger cannot be blank.'); }
    if (this.p.SubLedgerRef <= 0) { vra.add('SubLedgerRef', 'Sub Ledger cannot be blank.'); }
    if (this.p.GivenAmount <= 0) { vra.add('GivenAmount', 'Given Amount cannot be blank.'); }
    if (this.p.RecipientRef <= 0) { vra.add('RecipientRef', 'Recipient cannot be blank.'); }
    if (this.p.ExpenseModeOfPayment <= 0) { vra.add('ExpenseModeOfPayment', 'Mode Of Payment cannot be blank.'); }
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Expense.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Expense = Expense.CreateNewInstance();

  public static GetCurrentInstance() {
    return Expense.m_currentInstance;
  }

  public static SetCurrentInstance(value: Expense) {
    Expense.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Expense {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Expense.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Expense.Db_Table_Name)!.Entries) {
        return Expense.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    //sortPropertyName: string = "Name"): Expense[] {
    sortPropertyName: string = ""): Expense[] {
    let result: Expense[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Expense.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Expense.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Expense.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Expense[] {
    return Expense.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: ExpenseFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new ExpenseFetchRequest();
    req.ExpenseRefs.push(ref);

    let tdResponse = await Expense.FetchTransportData(req, errorHandler) as TransportData;
    return Expense.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: ExpenseFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Expense.FetchTransportData(req, errorHandler) as TransportData;
    return Expense.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ExpenseFetchRequest();
    let tdResponse = await Expense.FetchTransportData(req, errorHandler) as TransportData;
    return Expense.ListFromTransportData(tdResponse);
  }
  // public static async FetchEntireListByProjectRef(ProjectRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
  //   let req = new ExpenseFetchRequest();
  //   req.GAAProjectRefs.push(ProjectRef)
  //   let tdResponse = await Expense.FetchTransportData(req, errorHandler) as TransportData;
  //   return Expense.ListFromTransportData(tdResponse);
  // }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ExpenseFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await Expense.FetchTransportData(req, errorHandler) as TransportData;
    return Expense.ListFromTransportData(tdResponse);
  }


  public static async FetchCurrentBalanceByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CurrentBalanceFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await Expense.FetchTransportData(req, errorHandler) as TransportData;
    return Expense.ListFromTransportData(tdResponse);
  }

  public static async FetchTotalInvoiceAmountFromSiteAndRecipient(CompanyRef: number, SiteRef: number, RecipientType: number, RecipientRef: number, IsSalaryExpense: boolean, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new TotalExpenseFetchRequest();
    req.CompanyRef = CompanyRef
    req.SiteRef = SiteRef
    req.RecipientType = RecipientType
    req.RecipientRef = RecipientRef
    req.IsSalaryExpense = IsSalaryExpense

    let tdResponse = await Expense.FetchTransportData(req, errorHandler) as TransportData;
    return Expense.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByFilters(SiteRef: number, LedgerRef: number, SubLedgerRef: number, ModeOfPayment: number, Ref: number, CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ExpenseFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    if (LedgerRef) {
      req.LedgerRefs.push(LedgerRef)
    }
    if (SubLedgerRef) {
      req.SubLedgerRefs.push(SubLedgerRef)
    }
    if (SiteRef) {
      req.SiteRefs.push(SiteRef)
    }
    if (ModeOfPayment) {
      req.ModeOfPayments.push(ModeOfPayment)
    }
    if (Ref) {
      req.Refs.push(Ref)
    }
    let tdResponse = await Expense.FetchTransportData(req, errorHandler) as TransportData;
    return Expense.ListFromTransportData(tdResponse);
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
