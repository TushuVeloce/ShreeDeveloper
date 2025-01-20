import { Utils } from 'src/app/services/utils.service';
import { DataContainerService } from '../datacontainer.service';
import { RequestTypes } from '../enums';
import { TransportData } from '../transportdata';
import { DataCollection } from '../datacollection';

export class SystemUserEMailVerificationOTPGenerationRequest
{
    public static readonly ProcessRequestType: string = "SystemUserEMailVerificationOTPGenerationRequest";

    TemporaryUserName: string = '';
    FullName: string = '';
    EMailID: string = '';
    MotherName: string = '';
    DateOfBirth: string = '';
    AadharNo: string = '';
    MobileNo: string = '';

    public MergeIntoTransportData = (td: TransportData) =>
    {
        let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, SystemUserEMailVerificationOTPGenerationRequest.ProcessRequestType) as DataCollection;
        coll.Entries.push(this);
    }

    public FormulateTransportData = () => {
        let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.CustomProcess);
        this.MergeIntoTransportData(td);

        return td;
    }
}