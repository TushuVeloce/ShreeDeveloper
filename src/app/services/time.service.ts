import { Injectable, isDevMode } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Action1 } from '../classes/infrastructure/domain';
import { DTU } from './dtu.service';
import { ServiceInjector } from '../classes/infrastructure/injector';
import { StringPacket, StringPacketWrapper } from '../classes/infrastructure/payloadpacket/stringpacket';
import { isNullOrUndefined } from 'src/tools';
import { BaseUrlService } from './baseurl.service';

@Injectable({
    providedIn: 'root'
})
export class TimeService {
    public static GetInstance(): TimeService {
        return ServiceInjector.AppInjector.get(TimeService)
    }

    private messageHandlerId: number = 0;
    private m_topicForHandlerId: Map<number, string> = new Map<number, string>();

    private stringPacketHandlers: Map<string, Map<number, Action1<StringPacket>>> = new Map<string, Map<number, Action1<StringPacket>>>();

    private m_explicitlyDisconnected: boolean = true;

    private lastWillStringPacketMessages: StringPacketWrapper[] = [];

    private m_currentDateTimeString: string = '';

    constructor(private dtu: DTU, private baseUrlService: BaseUrlService) {
        this.timeServerHubConnection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Debug)
            .withUrl(this.timeServerHubUrl,
                {
                    skipNegotiation: true,
                    transport: signalR.HttpTransportType.WebSockets
                })
            .build();

        this.timeServerHubConnection.serverTimeoutInMilliseconds = 86400000;

        this.timeServerHubConnection.onclose(err => this.HandleDisconnectionError(err as any));

        this.timeServerHubConnection.onreconnecting(err => {
            console.log(`Time Server Reconnecting : ${err}`);
        });

        this.timeServerHubConnection.onreconnected(async connId => {
            console.log(`Time Server Reconnected : ${connId}`);
            await this.RegisterWrapperHandlers();
        });
    }

    public get CurrentDateTimeString() { return this.m_currentDateTimeString; }
    public set CurrentDateTimeString(value: string) {
        this.m_currentDateTimeString = value;
    }

    public get CurrentDateTimeInIndianDateTimeFormat() {
        let cdts = this.CurrentDateTimeString;
        if (cdts.trim().length == 0) return 'Timestamp not available';
        return `${this.dtu.GetIndianDate(cdts)} ${this.dtu.GetIndianTime(cdts)}`;
    }

    public get CurrentDateInIndianFormat() {
        let cdts = this.CurrentDateTimeString;
        return `${this.dtu.GetIndianDate(cdts)}`;
    }

    public get CurrentTimeInIndianFormat() {
        let cdts = this.CurrentDateTimeString;
        return `${this.dtu.GetIndianTime(cdts)}`;
    }

    private HandleDisconnectionError = (err: Error) => {
        if (!isNullOrUndefined(err)) {
            console.log(`Time Server Connection Closed : ${err}`);
        }
        else {
            console.log(`Time Server Connection Closed : Error not defined.`);
        }

        if (!this.m_explicitlyDisconnected) {
            for (let msg of this.lastWillStringPacketMessages) {
                this.HandleStringPacketWrapper(msg)
            }

            setTimeout(async () => {
                await this.ConnectToTimeServerHub()
            }, 1000);
        }
    }

    public get IsConnected() {
        return this.timeServerHubConnection.state === signalR.HubConnectionState.Connected;
    }

    private getCustomerIdentifier() {
        let urlString = location.origin;

        if (urlString.includes('localhost')) {
            return '';
        }

        urlString = urlString.substring(8);

        let urlParts = urlString.split('.');

        if (urlParts.length > 0) {
            let result = urlParts[0];

            if (result.endsWith("-vspot")) {
                result = result.substring(0, result.length - "-vspot".length);
            }

            return result;
        }
        else {
            return '';
        }
    }

    private formulateTimeServerHubUrlString() {
      return `${this.baseUrlService.GenerateBaseUrl()}/ts/timeserver`;
    }

    private m_timeServerHubURL: string = '';

    private get timeServerHubUrl(): string {
        if (this.m_timeServerHubURL.trim().length == 0) {
            this.m_timeServerHubURL = this.formulateTimeServerHubUrlString();
        }

        return this.m_timeServerHubURL;
    }

    private timeServerHubConnection: signalR.HubConnection = null as any;

    public ConnectToTimeServerHub = async () => {
        if (this.IsConnected) return;

        try {
            await this.timeServerHubConnection.start();
            await this.RegisterWrapperHandlers();
            console.log('Connection started');

            this.m_explicitlyDisconnected = false;
        }
        catch (err) {
            if (!isNullOrUndefined(err)) {
                console.log(`Error while starting Time Server Hub connection: ${err}`);
            }
            else {
                console.log(`Error while starting Time Server Hub connection: Error undefined`);
            }

            if (!this.m_explicitlyDisconnected) {
                setTimeout(async () => {
                    await this.ConnectToTimeServerHub()
                }, 1000);
            }
        }
    }

    public DisconnectFromTimeServerHub = async () => {
        this.m_explicitlyDisconnected = true;

        if (this.IsConnected) {
            await this.timeServerHubConnection.stop();
        }
    }

    private RegisterWrapperHandlers = async () => {
        this.timeServerHubConnection.on("StringPacket", this.HandleStringPacketWrapper);

        let topics: string[] = [];

        let subscribedTopics = this.GetListOfAllTopicsSubscribed();

        for (let topic of subscribedTopics) topics.push(topic);
        await this.RegisterInterestInTopicOnHub(topics);
    }

    private GetListOfAllTopicsSubscribed = () => {
        return this.m_topicForHandlerId.values();
    }

    private RegisterInterestInSingleTopicOnHub = async (topic: string) => {
        await this.RegisterInterestInTopicOnHub([topic]);
    }

    private RegisterInterestInTopicOnHub = async (topics: string[]) => {
        if (!this.IsConnected) return;
        if (topics.length == 0) return;

        try {
            await this.timeServerHubConnection.send("SubscribeToTopic", topics);
        }
        catch (err) {
            if (isDevMode()) console.log(`Error while registering for topic(s) ${topics} : ${err}`);
        }
    }

    private UnregisterInterestInSingleTopicOnHub = async (topic: string) => {
        await this.UnregisterInterestInTopicOnHub([topic]);
    }

    private UnregisterInterestInTopicOnHub = async (topics: string[]) => {
        if (!this.IsConnected) return;
        if (topics.length == 0) return;

        try {
            await this.timeServerHubConnection.send("UnsubscribeFromTopic", topics);
        }
        catch (err) {
            if (isDevMode()) console.log(`Error while unregistering for topic(s) ${topics} : ${err}`);
        }
    }

    public UnregisterPacketHandler = async (handlerId: number) => {
        if (!this.m_topicForHandlerId.has(handlerId)) return;

        let topic: string = this.m_topicForHandlerId.get(handlerId)!;

        if (this.stringPacketHandlers.has(topic)) {
            let handlersForTopic = this.stringPacketHandlers.get(topic)!;
            handlersForTopic.delete(handlerId);
            if (handlersForTopic.size === 0) await this.UnregisterInterestInSingleTopicOnHub(topic);
            return;
        }

        this.m_topicForHandlerId.delete(handlerId);
    }

    // ******** STRING PACKET HANDLERS *********

    public RegisterStringPacketHandler = (topic: string, handler: Action1<StringPacket>) => {
        this.messageHandlerId++;

        if (!this.stringPacketHandlers.has(topic)) {
            this.stringPacketHandlers.set(topic, new Map<number, Action1<StringPacket>>());
        }

        let handlerMap = this.stringPacketHandlers.get(topic)!;
        handlerMap.set(this.messageHandlerId, handler);

        this.m_topicForHandlerId.set(this.messageHandlerId, topic);

        setTimeout(async () => {
            await this.RegisterInterestInSingleTopicOnHub(topic);
        }, 1000);

        return this.messageHandlerId;
    }

    private GetStringPacketHandlersForTopic = (topic: string) => {
        if (!this.stringPacketHandlers.has(topic)) {
            let result: Action1<StringPacket>[] = [];
            return result;
        }

        let handlers = this.stringPacketHandlers.get(topic)!;

        return handlers.values();
    }

    private HandleStringPacketWrapper = (wrapper: StringPacketWrapper) => {
        let sp = wrapper.StringPacket;

        this.CurrentDateTimeString = sp.V;

        for (let handler of this.GetStringPacketHandlersForTopic(wrapper.Topic)) {
            try {
                handler(wrapper.StringPacket);
            }
            catch (ex) {
                console.log(`String Packet Handler Error : ${wrapper.Topic} : ${ex}`);
                // SWALLOW FOR NOW
            }
        }
    }

    // ******** END STRING PACKET HANDLERS *********

    // ********* LAST WILL **********
    public registerLastWillStringPacketMessage = async (topic: string, message: StringPacket, retain: boolean) => {
        let idx = this.lastWillStringPacketMessages.findIndex(msg => msg.Topic === topic);
        if (idx >= 0) this.lastWillStringPacketMessages.splice(idx, 1);
        this.lastWillStringPacketMessages.push(StringPacketWrapper.Create(topic, message));

        if (!this.IsConnected) return;

        try {
            await this.timeServerHubConnection.send("RegisterLastWillStringPacketMessage", topic, message, retain);
        }
        catch (err) {
            // SWALLOW FOR NOW
        }
    }
}
