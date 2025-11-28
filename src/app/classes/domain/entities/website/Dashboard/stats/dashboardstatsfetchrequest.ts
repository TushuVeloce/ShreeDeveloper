import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class DashboardStatsFetchRequest {
  public static readonly FetchRequestType: string = "DashboardFetchRequest";
  // ..............CRM Funnel.................//
  public CRMCompanyRef : number = 0;
  public CRMMonth : number = 0;
  public CRMSiteRef : number = 0;
  public CRMFilterType  : number = 0;
// ..............Expense BreakDown.................//
  public ExpenseBreakDownSiteRef  : number = 0;
  public ExpenseBreakDownCompanyRef  : number = 0;
  public ExpenseBreakDownFilterType  : number = 0;
  public ExpenseBreakDownMonth   : number = 0;
// ..............IncomeVsExpense.................//
  public IncomeVsExpenseSiteRef : number = 0;
  public IncomeVsExpenseCompanyRef : number = 0;
  public IncomeVsExpenseFilterType : number = 0;
  public IncomeVsExpenseMonth : number = 0;

  public MergeIntoTransportData = (td: TransportData) => {
    let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, DashboardStatsFetchRequest.FetchRequestType) as DataCollection;
    coll.Entries.push(this);
  }

  public FormulateTransportData = () => {
    let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.Fetch);
    this.MergeIntoTransportData(td);

    return td;
  }
}

