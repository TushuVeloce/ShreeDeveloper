import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class OrderMaterialCustomRequest {
  public static readonly CustomProcessRequestType: string = "GetMaterialRequisitionOnVendorRefFetchRequest";
  public static readonly MasterTableName: string = "MaterialRequisitionDetails";
  CompanyRefs: number[] = [];
  SiteManagementRefs: number[] = [];
  OrderMaterialRefs: number[] = [];
  VendorRefs: number[] = [];
  RequiredMaterialRefs: number[] = [];

  public MergeIntoTransportData = (td: TransportData) => {
    let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, OrderMaterialCustomRequest.CustomProcessRequestType) as DataCollection;
    coll.Entries.push(this);
  }

  public FormulateTransportData = () => {
    let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.Fetch);
    this.MergeIntoTransportData(td);

    return td;
  }

  // public static FromTransportData(td: TransportData) {
  //   let result: OrderMaterialCustomRequest = new OrderMaterialCustomRequest();

  //   let dcs = DataContainerService.GetInstance();

  //   if (dcs.CollectionExists(td.MainData, OrderMaterialCustomRequest.MasterTableName)) {
  //     let coll = dcs.GetCollection(td.MainData, OrderMaterialCustomRequest.MasterTableName)!;
  //     // for (let data of coll.Entries) {
  //     //     result.Data.push(data as any);
  //     // }
  //     result.Data = [...coll.Entries]
  //   }
  //   else {
  //     result = new OrderMaterialCustomRequest();
  //   }
  //   return result;
  // }
}
