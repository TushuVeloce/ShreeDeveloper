import { DataContainerService } from "../../datacontainer.service";
import { TransportData } from "../../transportdata";
import { VerifyPaymentCustomProcessRequest } from "./verifypaymentcustomrequest";

export class VerifyPaymentResponse
{
    public static readonly EmbedCollectionName: string = "VerifyPaymentResponse";

    CustomRequest: VerifyPaymentCustomProcessRequest = null as any;
    Rows: any;

    public static FromTransportData(td: TransportData)
    {
        let result: VerifyPaymentResponse = null as any;

        let dcs = DataContainerService.GetInstance();

        if (dcs.CollectionExists(td.MainData, VerifyPaymentResponse.EmbedCollectionName))
        {
            let coll = dcs.GetCollection(td.MainData, VerifyPaymentResponse.EmbedCollectionName)!;
            for(let data of coll.Entries)
            {
                result.Rows = data as any;
            }
        }
        else
        {
            result = new VerifyPaymentResponse();
        }

        return result;
    }
}