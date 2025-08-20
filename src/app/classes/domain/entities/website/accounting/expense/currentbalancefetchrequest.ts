import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class CurrentBalanceFetchRequest {
  public static readonly FetchRequestType: string = "GetCurrentBalanceOfCurrentFinancialYearFetchRequest";
  FinancialYearRefs: number[] = [];
  CompanyRefs: number[] = [];
  ExpenseRefs: number[] = [];
  IncomeRefs: number[] = [];
  CompanyRef: number = 0;
  RecipientRef: number = 0;
  RecipientRefs: number[] = [];
  PayerRef: number = 0;
  BankAccountRefs: number[] = [];
  StartDate: string = '';
  EndDate: string = '';
  SiteRef: number = 0;
  SiteRefs: number[] = [];
  PlotRefs: number[] = [];
  LedgerRefs: number[] = [];
  SubLedgerRefs: number[] = [];
  ModeOfPayments: number[] = [];
  Refs: number[] = [];
  PlotRef = 0;

  public MergeIntoTransportData = (td: TransportData) => {
    let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, CurrentBalanceFetchRequest.FetchRequestType) as DataCollection;
    coll.Entries.push(this);
  }

  public FormulateTransportData = () => {
    let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.Fetch);
    this.MergeIntoTransportData(td);

    return td;
  }
}

