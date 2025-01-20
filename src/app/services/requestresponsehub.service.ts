import { Injectable, isDevMode } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { isNullOrUndefined } from 'src/tools';
import { ServiceInjector } from '../classes/infrastructure/injector';
import { PayloadPacket } from '../classes/infrastructure/payloadpacket/payloadpacket';
import { BaseUrlService } from './baseurl.service';

@Injectable({
    providedIn: 'root'
})
export class RequestResponseHubService {
    public static GetInstance(): RequestResponseHubService {
        return ServiceInjector.AppInjector.get(RequestResponseHubService)
    }

    private m_explicitlyDisconnected: boolean = false;

    constructor(private baseUrlService: BaseUrlService) {
        let connectRetryPolicy: signalR.IRetryPolicy = {
            nextRetryDelayInMilliseconds: _ => { return 5000; }
        };

        this.requestResponseHubConnection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Debug)
            .withUrl(this.requestResponseHubUrl,
                {
                    skipNegotiation: true,
                    transport: signalR.HttpTransportType.WebSockets
                })
            .withAutomaticReconnect(connectRetryPolicy)
            .build();

        this.requestResponseHubConnection.serverTimeoutInMilliseconds = 864000000000;

        this.requestResponseHubConnection.onclose(err => this.HandleDisconnectionError(err!));

        this.requestResponseHubConnection.onreconnecting(err => {
            console.log(`Request Response Hub Reconnecting : ${err}`);
        });

        this.requestResponseHubConnection.onreconnected(async connId => {
            console.log(`Request Response Hub Reconnected : ${connId}`);
        });
    }

    private HandleDisconnectionError = (err: Error) => {
        if (!isNullOrUndefined(err)) {
            console.log(`Request Response Hub Connection Closed : ${err}`);
        }
        else {
            console.log(`Request Response Hub Connection Closed : Error not defined.`);
        }
    }

    public get IsConnected() {
        return this.requestResponseHubConnection.state === signalR.HubConnectionState.Connected;
    }

    private getCustomerIdentifier() {
        let urlString = location.origin;

        if (urlString.includes('localhost')) {
            return '';
        }

        urlString = urlString.substring(8);

        let urlParts = urlString.split('.');

        if (urlParts.length > 0) {
            return urlParts[0];
        }
        else {
            return '';
        }
    }

    private formulateRequestResponseHubUrlString() {
      return `${this.baseUrlService.GenerateBaseUrl()}/requestresponse`;
    }

    private m_requestResponseHubURL: string = '';

    private get requestResponseHubUrl(): string {
        if (this.m_requestResponseHubURL.trim().length == 0) {
            this.m_requestResponseHubURL = this.formulateRequestResponseHubUrlString();
        }

        return this.m_requestResponseHubURL;
    }

    private requestResponseHubConnection: signalR.HubConnection = null as any;

    public ConnectToRequestResponseHub = async () => {
        if (this.IsConnected) return;

        try {
            await this.requestResponseHubConnection.start();
            console.log('Request Response Hub Connection started');

            this.m_explicitlyDisconnected = false;
        }
        catch (err) {
            if (!isNullOrUndefined(err)) {
                console.log(`Error while starting Request Response Hub connection: ${err}`);
            }
            else {
                console.log(`Error while starting Request Response Hub connection: Error undefined`);
            }

            if (!this.m_explicitlyDisconnected) {
                setTimeout(async () => {
                    await this.ConnectToRequestResponseHub()
                }, 2000);
            }
        }
    }

    public DisconnectFromRequestResponseHub = async () => {
        this.m_explicitlyDisconnected = true;

        if (this.IsConnected) {
            await this.requestResponseHubConnection.stop();
        }
    }

    public SendStringRequest = async (input: string, sendErrorHandler?: (err: Error) => void) => {
        if (!this.IsConnected) return;

        try {
            let rslt = await this.requestResponseHubConnection.invoke("AcceptRequest", input);
            let strResult = <string>(rslt);
            return strResult;
        }
        catch (err) {
            if (!isNullOrUndefined(sendErrorHandler)) sendErrorHandler!(err as any);
            return '';
        }
    }

    public SendRequest = async (input: PayloadPacket, sendErrorHandler?: (err: Error) => void) => {
        if (!this.IsConnected) return;

        try {
            let strRequest = JSON.stringify(input);
            let strResult = await this.SendStringRequest(strRequest) as string;

            if (strResult.trim().length > 0) {
                return JSON.parse(strResult) as PayloadPacket;
            }
            else {
                return <PayloadPacket>{};
            }
        }
        catch (err) {
            if (!isNullOrUndefined(sendErrorHandler)) sendErrorHandler!(err as any);
            return <PayloadPacket>{};
        }
    }
}
