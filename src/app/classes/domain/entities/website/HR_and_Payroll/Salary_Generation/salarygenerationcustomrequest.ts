import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class SalaryGenerationCustomRequest {
  public static readonly CustomProcessRequestType: string = "PayrollInputAggregatorFetchRequest";
  public static readonly MasterTableName: string = "EmployeeData";
  CompanyRef: number = 0;
  Month: number = 0;
  EmployeeRef: number = 0;
  Data: any[] = []
  EmployeeRefs: number[] = [];
  Months: number[] = [];
  CompanyRefs: number[] = [];
  SalaryGenerationRefs: number[] = [];

  public MergeIntoTransportData = (td: TransportData) => {
    let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, SalaryGenerationCustomRequest.CustomProcessRequestType) as DataCollection;
    coll.Entries.push(this);
  }

  public FormulateTransportData = () => {
    let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.Fetch);
    this.MergeIntoTransportData(td);

    return td;
  }

  public static FromTransportData(td: TransportData) {
    let result: SalaryGenerationCustomRequest = new SalaryGenerationCustomRequest();

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(td.MainData, SalaryGenerationCustomRequest.MasterTableName)) {
      let coll = dcs.GetCollection(td.MainData, SalaryGenerationCustomRequest.MasterTableName)!;
      // for (let data of coll.Entries) {
      //     result.Data.push(data as any);
      // }
      result.Data = [...coll.Entries]
    }
    else {
      result = new SalaryGenerationCustomRequest();
    }
    return result;
  }
}
