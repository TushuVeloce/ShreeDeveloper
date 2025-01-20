import { PayloadPacketFacade } from '../payloadpacket/payloadpacketfacade';
import { SessionValues } from 'src/app/services/sessionvalues.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { CurrentDateTimeResponse } from './currentdatetimeresponse';

export class CurrentDateTimeRequest {
  SystemUserLoginToken: string = '';

  ConvertToPayloadPacket() {
    return PayloadPacketFacade.GetInstance()
      .CreateNewPayloadPacket2(this, "CurrentDateTimeRequest");
  }

  public static async GetCurrentDateTime() {
    let req = new CurrentDateTimeRequest();
    req.SystemUserLoginToken = SessionValues.GetInstance().CurrentLoginToken;

    let pkt = req.ConvertToPayloadPacket();

    let tr = await ServerCommunicatorService.GetInstance()
      .GetCurrentDateTime(SessionValues.GetInstance().requestController, pkt);

    let resp = CurrentDateTimeResponse.FromTransactionResult(tr);

    return resp.DateTimeValue;
  }
}
