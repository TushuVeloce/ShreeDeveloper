import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class MarketingManagementFetchRequest
{
    public static readonly FetchRequestType: string = "MarketingManagementFetchRequest";

     CompanyRefs: number[] = [];
    FromDate: string[] = [];
    ToDate: string[] = [];
    SiteRefs: number[] = [];
    VendorRefs: number[] = [];
    StageRefs: number[] = [];
    MarketingType: number[] = [];
    MarketingManagementRefs: number[] = [];

    public MergeIntoTransportData = (td: TransportData) =>
    {
        let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, MarketingManagementFetchRequest.FetchRequestType) as DataCollection;
        coll.Entries.push(this);
    }

    public FormulateTransportData = () => {
        let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.Fetch);
        this.MergeIntoTransportData(td);

        return td;
    }
}

