import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class GetDistinctRecipientNameFetchRequest {
  public static readonly FetchRequestType: string = "GetRecipientNameFetchRequest";

  InvoiceRefs: number[] = [];
  CompanyRefs: number[] = [];
  CompanyRef: number = 0;
  SiteRef: number = 0;
  SiteRefs: number[] = [];
  RecipientType: number = 0;
  LedgerRefs: number[] = [];
  SubLedgerRefs: number[] = [];
  Refs: number[] = [];
    StartDate: string = '';
  EndDate: string = '';
  RecipientRef: number = 0;

  public MergeIntoTransportData = (td: TransportData) => {
    let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, GetDistinctRecipientNameFetchRequest.FetchRequestType) as DataCollection;
    coll.Entries.push(this);
  }

  public FormulateTransportData = () => {
    let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.Fetch);
    this.MergeIntoTransportData(td);

    return td;
  }
}

