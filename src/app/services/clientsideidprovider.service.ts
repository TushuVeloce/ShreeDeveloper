import { Injectable } from '@angular/core';
import { ServiceInjector } from '../classes/infrastructure/injector';

@Injectable({
    providedIn: 'root'
  })
export class ClientSideIdProvider
{
    public static GetInstance(): ClientSideIdProvider {
        return ServiceInjector.AppInjector.get(ClientSideIdProvider)
    }

    private m_clientSideId: number = 0;
    private m_coordinationId: number = 0;

    constructor() {}

    public GetNextClientSideId(): number
    {
        this.m_clientSideId++;
        return this.m_clientSideId;
    }

    public GetNextCoordinationId(): number
    {
        this.m_coordinationId++;
        return this.m_coordinationId;
    }
}
