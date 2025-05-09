import { DataContainerService } from "../../datacontainer.service";
import { TransportData } from "../../transportdata";
import { CreateOrderCustomProcessRequest } from "./createordercustomrequest";

export class CreateOrderResponse
{
    public static readonly EmbedCollectionName: string = "CreateOrderResponse";

    CustomRequest: CreateOrderCustomProcessRequest = null as any;
    Rows:any = []

    public static FromTransportData(td: TransportData)
    {
        let result = new CreateOrderResponse();
        // let result: any = null as any;

        let dcs = DataContainerService.GetInstance();

        if (dcs.CollectionExists(td.MainData, CreateOrderResponse.EmbedCollectionName))
        {
            let coll = dcs.GetCollection(td.MainData, CreateOrderResponse.EmbedCollectionName)!;
            result.Rows = coll.Entries;
            // for(let data of coll.Entries)
            // {
            //     result.Rows = data as any;
            // }
        }
        else
        {
            //result = new CreateOrderResponse();
        }

        return result;
    }
}