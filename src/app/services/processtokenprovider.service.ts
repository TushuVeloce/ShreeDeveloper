import { Injectable } from '@angular/core';
import { SessionValues } from './sessionvalues.service';
import { ServiceInjector } from '../classes/infrastructure/injector';

@Injectable({
    providedIn: 'root'
  })
export class ProcessTokenProvider
{
    public static GetInstance(): ProcessTokenProvider {
        return ServiceInjector.AppInjector.get(ProcessTokenProvider)
    }

    private m_clientSideId: number = 0;

    private GetNextClientSideId(): number
    {
        this.m_clientSideId++;
        return this.m_clientSideId;
    }

    constructor(private sessionValues: SessionValues) {}

    public GetProcessTokens(count: number): string[]
    {
        let loginToken = this.sessionValues.CurrentLoginToken;

        let result: string[] = [];

        for (let i = 1; i <= count; i++)
        {
            let nextId = this.GetNextClientSideId();
            result.push(`${loginToken}_${nextId}`);
        }

        return result;
    }

    public GetProcessToken(): string
    {
        let loginToken = this.sessionValues.CurrentLoginToken;
        let nextId = this.GetNextClientSideId();
        return `${loginToken}_${nextId}`;
    }

}
