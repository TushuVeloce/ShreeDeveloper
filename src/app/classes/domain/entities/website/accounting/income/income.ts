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
import { IncomeFetchRequest } from "./incomefetchrequest";
import { ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";
import { CurrentBalanceFetchRequest } from "../expense/currentbalancefetchrequest";
import { TotalIncomeFetchRequest } from "./totalincomefetchrequest";
import { DistinctPayerNameFetchRequest } from "./distinctpayernamefetchrequest";


export class IncomeProps {
  public readonly Db_Table_Name = "Income";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public CompanyRef: number = 0
  public CompanyName: string = ''

  public PayerName: string = ''
  public PayerRef: number = 0
  public PayerTypeName: string = ''
  public PlotName: string = ''
  public PayerType: number = 0
  public IsRegisterCustomerRef: number = 0
  public Date: string = ''
  public SiteRef: number = 0
  public readonly SiteName: string = ''
  public LedgerRef: number = 0
  public readonly LedgerName: string = ''
  public SubLedgerRef: number = 0
  public readonly SubLedgerName: string = ''
  public Reason: string = ''
  public IncomeAmount: number = 0
  public Narration: string = ''
  public TransDateTime: string = ''
  public CreatedDate: string = ''
  public UpdatedDate: string = ''
  public IsDeleted: number = 0

  public ShreesBalance: number = 0
  public IncomeModeOfPayment: number = 0
  public ModeOfPaymentName: string = ''
  public BankAccountRef: number = 0

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new IncomeProps(true);
  }
}

export class Income implements IPersistable<Income> {
  public static readonly Db_Table_Name: string = 'Income';

  private constructor(public readonly p: IncomeProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Income {
    let newState: IncomeProps = Utils.GetInstance().DeepCopy(this.p);
    return Income.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Income(IncomeProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Income(data as IncomeProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');

    if (this.p.CompanyRef <= 0) { vra.add('CompanyRef', 'Company Name cannot be blank.'); }
    if (this.p.SiteRef <= 0) { vra.add('SiteRef', 'Site Name cannot be blank.'); }
    if (this.p.LedgerRef <= 0) { vra.add('LedgerRef', 'Ledger cannot be blank.'); }
    if (this.p.SubLedgerRef <= 0) { vra.add('SubLedgerRef', 'Sub Ledger cannot be blank.'); }
    if (this.p.IncomeAmount <= 0) { vra.add('IncomeAmount', 'Income Amount cannot be blank.'); }
    if (this.p.PayerRef <= 0) { vra.add('PayerRef', 'Recipient cannot be blank.'); }
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Income.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Income = Income.CreateNewInstance();

  public static GetCurrentInstance() {
    return Income.m_currentInstance;
  }

  public static SetCurrentInstance(value: Income) {
    Income.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Income {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Income.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Income.Db_Table_Name)!.Entries) {
        return Income.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): Income[] {
    let result: Income[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Income.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Income.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Income.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Income[] {
    return Income.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: IncomeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new IncomeFetchRequest();
    req.IncomeRefs.push(ref);

    let tdResponse = await Income.FetchTransportData(req, errorHandler) as TransportData;
    return Income.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: IncomeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Income.FetchTransportData(req, errorHandler) as TransportData;
    return Income.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new IncomeFetchRequest();
    let tdResponse = await Income.FetchTransportData(req, errorHandler) as TransportData;
    return Income.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new IncomeFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await Income.FetchTransportData(req, errorHandler) as TransportData;
    return Income.ListFromTransportData(tdResponse);
  }

  public static async FetchCurrentBalanceByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CurrentBalanceFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await Income.FetchTransportData(req, errorHandler) as TransportData;
    return Income.ListFromTransportData(tdResponse);
  }

  public static async FetchDistinctPayerNameByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new DistinctPayerNameFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await Income.FetchTransportData(req, errorHandler) as TransportData;
    return Income.ListFromTransportData(tdResponse);
  }

  public static async FetchPayerNameByPayerTypeRef(CompanyRef: number, PayerType: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new DistinctPayerNameFetchRequest();
    req.CompanyRef = CompanyRef;
    req.PayerType = PayerType;
    let tdResponse = await Income.FetchTransportData(req, errorHandler) as TransportData;
    return Income.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByFilters(SiteRef: number, LedgerRef: number, SubLedgerRef: number,ModeOfPayment:number, CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new IncomeFetchRequest();
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
    let tdResponse = await Income.FetchTransportData(req, errorHandler) as TransportData;
    return Income.ListFromTransportData(tdResponse);
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
