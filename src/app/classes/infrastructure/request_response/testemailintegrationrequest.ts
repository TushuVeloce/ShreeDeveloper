import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from '../datacollection';

export class TestEMailIntegrationRequest {
  public static readonly CustomProcessRequestType: string = "TestEMailIntegrationRequest";

  SenderFriendlyName: string = '';
  EMailID: string = '';
  SMTPHost: string = '';
  SMTPPort: number = 0;
  SSLRequired: boolean = false;
  UserName: string = '';
  Password: string = '';
  SendToEMailId: string = '';

  public MergeIntoTransportData = (td: TransportData) => {
    let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, TestEMailIntegrationRequest.CustomProcessRequestType) as DataCollection;
    coll.Entries.push(this);
  }

  public FormulateTransportData = () => {
    let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.CustomProcess);
    this.MergeIntoTransportData(td);

    return td;
  }
}
