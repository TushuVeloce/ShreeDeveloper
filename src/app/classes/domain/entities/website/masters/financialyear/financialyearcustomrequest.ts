
import { TransportData } from '../../../../../infrastructure/transportdata';
import { DataContainerService } from '../../../../../infrastructure/datacontainer.service';
import { Utils } from '../../../../../../services/utils.service';
import { RequestTypes } from '../../../../../infrastructure/enums';
import { DataCollection } from '../../../../../infrastructure/datacollection';

export class FinancialYearCustomRequest {
  public static readonly CustomProcessRequestType: string = "FinancialYearCustomRequest";
  KarigarRefs: number[] = [];
  public MergeIntoTransportData = (td: TransportData) => {
    let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, FinancialYearCustomRequest.CustomProcessRequestType) as DataCollection;
    coll.Entries.push(this);
  }

  public FormulateTransportData = () => {
    let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.CustomProcess);
    this.MergeIntoTransportData(td);

    return td;
  }
}