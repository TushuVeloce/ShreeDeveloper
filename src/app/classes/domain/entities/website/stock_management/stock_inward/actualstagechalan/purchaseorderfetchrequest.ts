import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class PurchaseOrderChalanFetchRequest
{
    public static readonly FetchRequestType: string = "ChalanNoFetchRequest";
    public static readonly MasterTableName: string = "ChalanNo";

    Data: any[] = []

    public MergeIntoTransportData = (td: TransportData) =>
    {
        let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, PurchaseOrderChalanFetchRequest.FetchRequestType) as DataCollection;
        coll.Entries.push(this);
    }

    public FormulateTransportData = () => {
        let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.Fetch);
        this.MergeIntoTransportData(td);

        return td;
    }

     public static FromTransportData(td: TransportData) {
            let result: PurchaseOrderChalanFetchRequest =  new PurchaseOrderChalanFetchRequest();

            let dcs = DataContainerService.GetInstance();

            if (dcs.CollectionExists(td.MainData, PurchaseOrderChalanFetchRequest.MasterTableName)) {
                let coll = dcs.GetCollection(td.MainData, PurchaseOrderChalanFetchRequest.MasterTableName)!;
                // for (let data of coll.Entries) {
                //     result.Data.push(data as any);
                // }
                result.Data = [... coll.Entries]
            }
            else {
                result = new PurchaseOrderChalanFetchRequest();
            }
            return result;
        }

}

