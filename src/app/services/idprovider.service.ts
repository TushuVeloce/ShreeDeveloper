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
export class IdProvider
{
    public static GetInstance(): IdProvider {
        return ServiceInjector.AppInjector.get(IdProvider)
    }

    private m_clientSideId: number = 0;

    constructor(private payloadPacketFacade: PayloadPacketFacade,
        private serverCommunicator: ServerCommunicatorService,
        private sessionValues: SessionValues) {}

    // private PadZero(num: number, maxLength: number): string {
    //     let s = num.toString() + '';
    //     while (s.length < maxLength) s = '0' + s;
    //     return s;
    // }

    public GetNextClientSideId(): number
    {
        this.m_clientSideId++;
        return this.m_clientSideId;
    }

    public async GetRefs(count: number): Promise<TransactionResult>
    {
        let req: AllocateRefsRequest = { Count: count };

        let pkt = this.payloadPacketFacade.CreateNewPayloadPacket(this.GetNextClientSideId(), '', req, 'AllocateRefsRequest');

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
    public async GetAllocateSingleIds(count: number = 1): Promise<number[]>
    {
        let tr = await this.serverCommunicator.AllocateSingleIds(this.sessionValues.requestController);
        if (tr.Successful)
        {
            let resp = JSON.parse(tr.Tag);
            return [+resp];
        }
        else
        {
            return [0];
        }
    }
}
