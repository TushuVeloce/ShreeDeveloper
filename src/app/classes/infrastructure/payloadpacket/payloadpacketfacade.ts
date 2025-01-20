import { Injectable } from "@angular/core";
import { ProcessTokenProvider } from "src/app/services/processtokenprovider.service";
import { SessionValues } from "src/app/services/sessionvalues.service";
import { ServiceInjector } from "../injector";
import { PayloadPacket } from "./payloadpacket";

@Injectable({
    providedIn: 'root'
})
export class PayloadPacketFacade
{   public static GetInstance(): PayloadPacketFacade {
        return ServiceInjector.AppInjector.get(PayloadPacketFacade)
    }

    constructor(private sessionValues: SessionValues,
        private processTokenProvider: ProcessTokenProvider)
    {

    }

    public CreateNewPayloadPacket2(payload: any, payloadDescriptor: string = 'transportdata'): PayloadPacket
    {
        let pToken = this.processTokenProvider.GetProcessToken();
        return this.CreateNewPayloadPacket(0, pToken, payload, payloadDescriptor);
    }

    public CreateNewPayloadPacket(ref: number, processToken: string, payload: any, payloadDescriptor: string): PayloadPacket
    {
        return {
            Ref: ref,
            PartNo: 1,
            TotalPartCount: 1,
            Sender: this.sessionValues.CurrentLoginToken,
            Topic: 'ClientToServerRequest',
            PayloadDescriptor: payloadDescriptor,
            Payload: payload,
            TargetMethod: '',
            ProcessToken: processToken
        };
    }
}
