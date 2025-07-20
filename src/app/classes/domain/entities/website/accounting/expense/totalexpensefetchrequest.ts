import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class TotalExpenseFetchRequest {
  public static readonly FetchRequestType: string = "GetTotalInvoiceAmountFromSiteAndRecipientRefFetchRequest";

  CompanyRef: number = 0;
  ExpenseRef: number = 0;
  RecipientRef: number = 0;
  IsSalaryExpense: boolean = false;
  RecipientType: number = 0;
  SiteRef: number = 0;
  SiteRefs: number[] = [];
  LedgerRefs: number[] = [];
  SubLedgerRefs: number[] = [];
  ModeOfPayments: number[] = [];
  Refs: number[] = [];

  ExpenseRefs: number[] = [];
  CompanyRefs: number[] = [];

  public MergeIntoTransportData = (td: TransportData) => {
    let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, TotalExpenseFetchRequest.FetchRequestType) as DataCollection;
    coll.Entries.push(this);
  }

  public FormulateTransportData = () => {
    let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.Fetch);
    this.MergeIntoTransportData(td);

    return td;
  }
}

