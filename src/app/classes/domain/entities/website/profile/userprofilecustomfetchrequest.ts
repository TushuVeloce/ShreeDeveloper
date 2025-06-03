import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class VerifyByAdminCustomRequest {
  public static readonly CustomProcessRequestType: string = "VerifyByAdminCustomRequest";

  ApprovalBillRefs: number[] = [];

  public MergeIntoTransportData = (td: TransportData) => {
    let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, VerifyByAdminCustomRequest.CustomProcessRequestType) as DataCollection;
    coll.Entries.push(this);
  }

  public FormulateTransportData = () => {
    let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.CustomProcess);
    this.MergeIntoTransportData(td);

    return td;
  }
}

