import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';
import { AttendanceLogProps } from './attendancelog';

export class AttendanceLogCheckInCustomRequest {
    public static readonly CustomProcessRequestType: string = "AttendanceLogCheckInCustomRequest";
    public static readonly MasterTableName: string = "AttendanceLog";

    TransDateTime: string = '';
    EmployeeRef: number = 0;
    CompanyRef: number = 0;

    Data: any[] = []

    public MergeIntoTransportData = (td: TransportData) => {
        let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, AttendanceLogCheckInCustomRequest.CustomProcessRequestType) as DataCollection;
        coll.Entries.push(this);
    }

    public FormulateTransportData = () => {
        let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.CustomProcess);
        this.MergeIntoTransportData(td);

        return td;
    }

    public static FromTransportData(td: TransportData) {
        let result: AttendanceLogCheckInCustomRequest =  new AttendanceLogCheckInCustomRequest();

        let dcs = DataContainerService.GetInstance();

        if (dcs.CollectionExists(td.MainData, AttendanceLogCheckInCustomRequest.MasterTableName)) {
            let coll = dcs.GetCollection(td.MainData, AttendanceLogCheckInCustomRequest.MasterTableName)!;
            // for (let data of coll.Entries) {
            //     result.Data.push(data as any);
            // }
            result.Data = [... coll.Entries]
        }
        else {
            result = new AttendanceLogCheckInCustomRequest();
        }
        return result;
    }
}
