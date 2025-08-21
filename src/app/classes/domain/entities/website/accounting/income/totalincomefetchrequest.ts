import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class TotalIncomeFetchRequest {
  public static readonly FetchRequestType: string = "IncomeFetchRequest";

  IncomeRefs: number[] = [];
  CompanyRefs: number[] = [];
  SiteRef: number = 0;
  SiteRefs: number[] = [];
  RecipientRefs: number[] = [];
  Refs: number[] = [];
  CompanyRef = 0;
  PlotRef = 0;
  PlotRefs: number[] = [];
  LedgerRefs: number[] = [];
  SubLedgerRefs: number[] = [];
  ModeOfPayments: number[] = [];
  StartDate: string = '';
  EndDate: string = '';
  BankAccountRefs: number[] = [];
  PayerRefs: number[] = [];

  public MergeIntoTransportData = (td: TransportData) => {
    let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, TotalIncomeFetchRequest.FetchRequestType) as DataCollection;
    coll.Entries.push(this);
  }

  public FormulateTransportData = () => {
    let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.Fetch);
    this.MergeIntoTransportData(td);

    return td;
  }
}

