import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class SetCurrentFinancialYearCustomRequest {
  public static readonly FetchRequestType: string = "SetCurrentFinancialYearCustomRequest";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  CompanyRef: number = 0;
  Password: string = '';
  EmployeeRef = 0;
  LoginToken = '';
  FinancialYearRef: number = 0;
  OpeningBalance:number = 0


  public MergeIntoTransportData = (td: TransportData) => {
    let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, SetCurrentFinancialYearCustomRequest.FetchRequestType) as DataCollection;
    coll.Entries.push(this);
  }

  public FormulateTransportData = () => {
    let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.CustomProcess);
    this.MergeIntoTransportData(td);

    return td;
  }
}

