import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class AttendanceLogsFetchRequest
{
    public static readonly FetchRequestType: string = "AttendanceLogFetchRequest";

    CompanyRefs: number[] = [];
    Months: number[] = [];
    EmployeeRefs: number[] = [];
    // AttendanceLogsRefs: number[] = [];
    AttendanceLogTypes: number[] = [];
    

    public MergeIntoTransportData = (td: TransportData) =>
    {
        let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, AttendanceLogsFetchRequest.FetchRequestType) as DataCollection;
        coll.Entries.push(this);
    }

    public FormulateTransportData = () => {
        let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.Fetch);
        this.MergeIntoTransportData(td);

        return td;
    }
}

