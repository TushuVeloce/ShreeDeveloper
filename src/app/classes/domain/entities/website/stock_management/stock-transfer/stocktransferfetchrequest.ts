import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class StockTransferFetchRequest
{
    // public static readonly FetchRequestType: string = "GAAProjectSpaceGroupFetchRequest";
    public static readonly FetchRequestType: string = "MaterialTransferFetchRequest";

    StockTransferManagementRefs: number[] = [];
    CompanyRefs: number[] = [];
    StockTransferStatus: number[] = [];
    FromSiteRefs: number[] = [];
    ToSiteRefs: number[] = [];

    public MergeIntoTransportData = (td: TransportData) =>
    {
        let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, StockTransferFetchRequest.FetchRequestType) as DataCollection;
        coll.Entries.push(this);
    }

    public FormulateTransportData = () => {
        let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.Fetch);
        this.MergeIntoTransportData(td);

        return td;
    }
}

