import { Utils } from 'src/app/services/utils.service';
import { DataContainerService } from '../datacontainer.service';
import { RequestTypes } from '../enums';
import { TransportData } from '../transportdata';
import { DataCollection } from '../datacollection';

export class NewUserRegistrationEMailVerificationOTPValidationRequest
{
    public static readonly ProcessRequestType: string = "NewUserRegistrationEMailVerificationOTPValidationRequest";

    EMailID: string = '';
    OTP: string = '';

    public MergeIntoTransportData = (td: TransportData) =>
    {
        let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, NewUserRegistrationEMailVerificationOTPValidationRequest.ProcessRequestType) as DataCollection;
        coll.Entries.push(this);
    }

    public FormulateTransportData = () => {
        let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.CustomProcess);
        this.MergeIntoTransportData(td);

        return td;
    }
}