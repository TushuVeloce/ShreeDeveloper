import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class IncomeFetchRequest {
  public static readonly FetchRequestType: string = "IncomeFetchRequest";

  IncomeRefs: number[] = [];
  CompanyRefs: number[] = [];

  CompanyRef: number = 0;
  SiteRef: number = 0;
  SiteRefs: number[] = [];
  LedgerRefs: number[] = [];
  SubLedgerRefs: number[] = [];
  ModeOfPayments: number[] = [];
  Refs: number[] = [];


  public MergeIntoTransportData = (td: TransportData) => {
    let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, IncomeFetchRequest.FetchRequestType) as DataCollection;
    coll.Entries.push(this);
  }

  public FormulateTransportData = () => {
    let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.Fetch);
    this.MergeIntoTransportData(td);

    return td;
  }
}

