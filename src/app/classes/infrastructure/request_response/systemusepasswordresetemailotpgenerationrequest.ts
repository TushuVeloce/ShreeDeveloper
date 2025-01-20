import { Utils } from 'src/app/services/utils.service';
import { DataContainerService } from '../datacontainer.service';
import { RequestTypes } from '../enums';
import { TransportData } from '../transportdata';
import { DataCollection } from '../datacollection';

export class SystemUserPasswordResetEMailOTPGenerationRequest
{
    public static readonly ProcessRequestType: string = "SystemUserPasswordResetEMailOTPGenerationRequest";

    EMailID: string = '';

    public MergeIntoTransportData = (td: TransportData) =>
    {
        let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, SystemUserPasswordResetEMailOTPGenerationRequest.ProcessRequestType) as DataCollection;
        coll.Entries.push(this);
    }

    public FormulateTransportData = () => {
        let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.CustomProcess);
        this.MergeIntoTransportData(td);

        return td;
    }
}