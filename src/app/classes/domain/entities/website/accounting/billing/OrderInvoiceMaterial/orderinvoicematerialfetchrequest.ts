import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class OrderInvoiceMaterialFetchRequest {
  public static readonly FetchRequestType: string = "GetMaterialForPurchaseOrderFetchRequest";
  CompanyRefs: number[] = [];
  SiteManagementRefs: number[] = [];

  SiteManagementRef: number = 0;
  CompanyRef: number = 0;

  OrderMaterialRefs: number[] = [];
  VendorRefs: number[] = [];


  public MergeIntoTransportData = (td: TransportData) => {
    let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, OrderInvoiceMaterialFetchRequest.FetchRequestType) as DataCollection;
    coll.Entries.push(this);
  }

  public FormulateTransportData = () => {
    let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.Fetch);
    this.MergeIntoTransportData(td);

    return td;
  }
}

