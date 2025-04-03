import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class CustomProcessFetchRequest
{
    public static readonly FetchRequestType: string = "CancelDealCustomRequest";

    CustomProcessRefs: number[] = [];
    CompanyRefs: number[] = [];
    RegisterCustomer: any; // Add this property to store registercustomer data

    constructor(registercustomer: any) {
        this.RegisterCustomer = registercustomer;
    }

    public MergeIntoTransportData = (td: TransportData) =>
    {
        let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, CustomProcessFetchRequest.FetchRequestType) as DataCollection;
        coll.Entries.push(this);
    }

    public FormulateTransportData = () => {
        let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.Save);
        this.MergeIntoTransportData(td);

        return td;
    }
}

