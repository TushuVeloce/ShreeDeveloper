import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class AccountingReportFetchRequest {
  public static readonly FetchRequestType: string = "IncomeExpenseLedgerFetchRequest";

  AccountingReportRefs: number[] = [];
  AccountingReport: number = 0;
  CompanyRef: number = 0;
  StartDate: string = '';
  EndDate: string = '';
  SiteRef: number = 0;
  LedgerRef: number = 0;
  SubLedgerRef: number = 0;
  RecipientRef: number = 0;
  PayerRef: number = 0;
  ModeOfPayments: number = 0;

  public MergeIntoTransportData = (td: TransportData) => {
    let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, AccountingReportFetchRequest.FetchRequestType) as DataCollection;
    coll.Entries.push(this);
  }

  public FormulateTransportData = () => {
    let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.Fetch);
    this.MergeIntoTransportData(td);

    return td;
  }
}

