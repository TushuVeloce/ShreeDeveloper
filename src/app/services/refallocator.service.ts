import { Injectable } from '@angular/core';
import { ServerCommunicatorService } from './server-communicator.service';
import { SessionValues } from './sessionvalues.service';
import { TransactionResult } from '../classes/infrastructure/transactionresult';
import { ServiceInjector } from '../classes/infrastructure/injector';
import { PayloadPacketFacade } from '../classes/infrastructure/payloadpacket/payloadpacketfacade';
import { AllocateRefsRequest } from '../classes/infrastructure/request_response/allocaterefsrequest';
import { AllocateRefsResponse } from '../classes/infrastructure/request_response/allocaterefsresponse';

@Injectable({
    providedIn: 'root'
  })
export class RefAllocator
{
    public static GetInstance(): RefAllocator {
        return ServiceInjector.AppInjector.get(RefAllocator)
    }

    constructor(private payloadPacketFacade: PayloadPacketFacade,
        private serverCommunicator: ServerCommunicatorService,
        private sessionValues: SessionValues) {}

    public async GetRefs(count: number): Promise<TransactionResult>
    {
        let req: AllocateRefsRequest = { Count: count };

        let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(req, 'AllocateRefsRequest');

        let result = await this.serverCommunicator.GetRefs(this.sessionValues.requestController, pkt);
        return result;
    }

    public async GetNextEntityId(count: number = 1): Promise<number[]>
    {
        let tr = await this.GetRefs(count);
        if (tr.Successful)
        {
            let resp = JSON.parse(tr.Tag) as AllocateRefsResponse;
            return resp.Refs;
        }
        else
        {
            return [0];
        }
    }
}
