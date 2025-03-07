import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class FinancialYearCustomRequest
{
    public static readonly FetchRequestType: string = "FinancialYearCustomRequest";
    CompanyRef:number = 0;
    // Ref:number = 0;

    public MergeIntoTransportData = (td: TransportData) =>
    {
        let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, FinancialYearCustomRequest.FetchRequestType) as DataCollection;
        coll.Entries.push(this);
    }

    public FormulateTransportData = () => {
        let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.CustomProcess);
        this.MergeIntoTransportData(td);

        return td;
    }
}

