import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class SalaryGenerationFetchRequest {
  public static readonly FetchRequestType: string = "SalarySlipGenerationFetchRequest";

  CompanyRef: number = 0;
  Month: number = 0;
  EmployeeRef: number = 0;
  Data: any[] = []
  EmployeeRefs: number[] = [];
  Months: number[] = [];
  CompanyRefs: number[] = [];
  SalaryGenerationRefs: number[] = [];

  public MergeIntoTransportData = (td: TransportData) => {
    let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, SalaryGenerationFetchRequest.FetchRequestType) as DataCollection;
    coll.Entries.push(this);
  }

  public FormulateTransportData = () => {
    let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.Fetch);
    this.MergeIntoTransportData(td);

    return td;
  }
}

