import { Utils } from 'src/app/services/utils.service';
import { DataContainerService } from '../datacontainer.service';
import { RequestTypes } from '../enums';
import { TransportData } from '../transportdata';
import { DataCollection } from '../datacollection';

export class NewUserRegistrationEMailVerificationOTPGenerationRequest
{
    public static readonly ProcessRequestType: string = "NewUserRegistrationEMailVerificationOTPGenerationRequest";

    FirstName: string = '';
    LastName: string = '';
    EMailID: string = '';
    MotherName: string = '';
    DateOfBirth: string = '';
    AadharNo: string = '';
    MobileNo: string = '';

    public MergeIntoTransportData = (td: TransportData) =>
    {
        let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, NewUserRegistrationEMailVerificationOTPGenerationRequest.ProcessRequestType) as DataCollection;
        coll.Entries.push(this);
    }

    public FormulateTransportData = () => {
        let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.CustomProcess);
        this.MergeIntoTransportData(td);

        return td;
    }
}