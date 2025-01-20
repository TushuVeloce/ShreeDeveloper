import { Injectable, isDevMode } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { isNullOrUndefined } from "src/tools";
import { Action1, Promise_1 } from "../classes/infrastructure/domain";
import { ServiceInjector } from "../classes/infrastructure/injector";
import { DecimalPacket, DecimalPacketWrapper } from "../classes/infrastructure/payloadpacket/decimalpacket";
import { IntegerPacket, IntegerPacketWrapper } from "../classes/infrastructure/payloadpacket/integerpacket";
import { LongPacket, LongPacketWrapper } from "../classes/infrastructure/payloadpacket/longpacket";
import { PayloadPacket, PayloadPacketWrapper } from "../classes/infrastructure/payloadpacket/payloadpacket";
import { StringPacket, StringPacketWrapper } from "../classes/infrastructure/payloadpacket/stringpacket";
import { BaseUrlService } from "./baseurl.service";

@Injectable({
  providedIn: 'root'
})
export class MessageHubService {
    public static GetInstance(): MessageHubService {
        return ServiceInjector.AppInjector.get(MessageHubService)
    }

    private messageHandlerId: number = 0;
    private m_topicForHandlerId: Map<number, string> = new Map<number, string>();

    private decimalPacketHandlers: Map<string, Map<number, Action1<DecimalPacket>>> = new Map<string, Map<number, Action1<DecimalPacket>>>();
    private integerPacketHandlers: Map<string, Map<number, Action1<IntegerPacket>>> = new Map<string, Map<number, Action1<IntegerPacket>>>();
    private longPacketHandlers: Map<string, Map<number, Action1<LongPacket>>> = new Map<string, Map<number, Action1<LongPacket>>>();
    private stringPacketHandlers: Map<string, Map<number, Action1<StringPacket>>> = new Map<string, Map<number, Action1<StringPacket>>>();
    private payloadPacketHandlers: Map<string, Map<number, Action1<PayloadPacket>>> = new Map<string, Map<number, Action1<PayloadPacket>>>();

    private payloadPacketHandlersAsync: Map<string, Map<number, Promise_1<PayloadPacket>>> = new Map<string, Map<number, Promise_1<PayloadPacket>>>();

    private m_explicitlyDisconnected: boolean = false;

    private lastWillDecimalPacketMessages: DecimalPacketWrapper[] = [];
    private lastWillIntegerPacketMessages: IntegerPacketWrapper[] = [];
    private lastWillLongPacketMessages: LongPacketWrapper[] = [];
    private lastWillStringPacketMessages: StringPacketWrapper[] = [];
    private lastWillPayloadPacketMessages: PayloadPacketWrapper[] = [];

    constructor(private baseUrlService: BaseUrlService)
    {
        let connectRetryPolicy: signalR.IRetryPolicy = {
            nextRetryDelayInMilliseconds: _ => { return 5000; }
        };

        this.messageHubConnection = new signalR.HubConnectionBuilder()
                                .configureLogging(signalR.LogLevel.Debug)
                                .withUrl(this.messageHubUrl,
                                {
                                    skipNegotiation: true,
                                    transport: signalR.HttpTransportType.WebSockets
                                })
                                .withAutomaticReconnect(connectRetryPolicy)
                                .build();

        this.messageHubConnection.serverTimeoutInMilliseconds = 86400000;

        this.messageHubConnection.onclose(err => this.HandleDisconnectionError(err!));

        this.messageHubConnection.onreconnecting(err => {
            console.log(`Message Hub Reconnecting : ${err}`);
        });

        this.messageHubConnection.onreconnected(async connId => {
            console.log(`Message Hub Reconnected : ${connId}`);
            await this.RegisterWrapperHandlers();
        });
    }

    private HandleDisconnectionError = (err: Error) =>
    {
        if (!isNullOrUndefined(err))
        {
            console.log(`Message Hub Connection Closed : ${err}`);
        }
        else
        {
            console.log(`Message Hub Connection Closed : Error not defined.`);
        }

        if (!this.m_explicitlyDisconnected)
        {
            for (let msg of this.lastWillDecimalPacketMessages)
            {
                this.HandleDecimalPacketWrapper(msg)
            }

            for (let msg of this.lastWillIntegerPacketMessages)
            {
                this.HandleIntegerPacketWrapper(msg)
            }

            for (let msg of this.lastWillLongPacketMessages)
            {
                this.HandleLongPacketWrapper(msg)
            }

            for (let msg of this.lastWillStringPacketMessages)
            {
                this.HandleStringPacketWrapper(msg)
            }

            for (let msg of this.lastWillPayloadPacketMessages)
            {
                this.HandlePayloadPacketWrapper(msg)
            }
        }
    }

    public get IsConnected()
    {
        return this.messageHubConnection.state === signalR.HubConnectionState.Connected;
    }

    private getCustomerIdentifier()
    {
        let urlString = location.origin;

        if (urlString.includes('localhost'))
        {
            return '';
        }

        urlString = urlString.substring(8);

        let urlParts = urlString.split('.');

        if (urlParts.length > 0)
        {
            return urlParts[0];
        }
        else
        {
        return '';
        }
    }

    private formulateMessageHubUrlString()
    {
      return `https://api.gladiance.one/mh/messagehub`;
    }

    private m_messageHubURL: string = '';

    private get messageHubUrl(): string {
        if (this.m_messageHubURL.trim().length == 0)
        {
            this.m_messageHubURL = this.formulateMessageHubUrlString();
        }

        return this.m_messageHubURL;
    }

    private messageHubConnection: signalR.HubConnection = null as any;

    public ConnectToMessageHub = async () => {
        if (this.IsConnected) return;

        try
        {
            await this.messageHubConnection.start();
            await this.RegisterWrapperHandlers();
            console.log('Connection started');

            this.m_explicitlyDisconnected = false;
        }
        catch (err)
        {
            if (!isNullOrUndefined(err))
            {
                console.log(`Error while starting Message Hub connection: ${err}`);
            }
            else
            {
                console.log(`Error while starting Message Hub connection: Error undefined`);
            }

            if (!this.m_explicitlyDisconnected)
            {
                setTimeout(async () => {
                    await this.ConnectToMessageHub()
                }, 2000);
            }
        }
    }

    public DisconnectFromMessageHub = async () => {
        this.m_explicitlyDisconnected = true;

        if (this.IsConnected)
        {
            await this.messageHubConnection.stop();
        }
    }

    private RegisterWrapperHandlers = async () => {
        this.messageHubConnection.on("DecimalPacket", this.HandleDecimalPacketWrapper);
        this.messageHubConnection.on("IntegerPacket", this.HandleIntegerPacketWrapper);
        this.messageHubConnection.on("LongPacket", this.HandleLongPacketWrapper);
        this.messageHubConnection.on("StringPacket", this.HandleStringPacketWrapper);
        this.messageHubConnection.on("PayloadPacket", this.HandlePayloadPacketWrapper);

        let topics: string[] = [];

        let subscribedTopics = this.GetListOfAllTopicsSubscribed();

        for (let topic of subscribedTopics) topics.push(topic);
        await this.RegisterInterestInTopicOnHub(topics);
    }

    private GetListOfAllTopicsSubscribed = () => {
        return this.m_topicForHandlerId.values();
    }

    private RegisterInterestInSingleTopicOnHub = async (topic: string) =>
    {
        await this.RegisterInterestInTopicOnHub([topic]);
    }

    private RegisterInterestInTopicOnHub = async (topics: string[]) =>
    {
        if (!this.IsConnected)
        {
            await this.ConnectToMessageHub();
        };

        if (topics.length == 0) return;

        try
        {
            await this.messageHubConnection.send("SubscribeToTopic", topics);
        }
        catch (err)
        {
            if (isDevMode()) console.log(`Error while registering for topic(s) ${topics} : ${err}`);
        }
    }

    private UnregisterInterestInSingleTopicOnHub = async (topic: string) =>
    {
        await this.UnregisterInterestInTopicOnHub([topic]);
    }

    private UnregisterInterestInTopicOnHub = async (topics: string[]) =>
    {
        if (!this.IsConnected)
        {
            await this.ConnectToMessageHub();
        };

        if (topics.length == 0) return;

        try
        {
            await this.messageHubConnection.send("UnsubscribeFromTopic", topics);
        }
        catch (err)
        {
            if (isDevMode()) console.log(`Error while unregistering for topic(s) ${topics} : ${err}`);
        }
    }

    public UnregisterPacketHandler = async (handlerId: number) =>
    {
        if (!this.m_topicForHandlerId.has(handlerId)) return;

        let topic: string = this.m_topicForHandlerId.get(handlerId) as string;

        if (this.decimalPacketHandlers.has(topic))
        {
            let handlersForTopic = this.decimalPacketHandlers.get(topic)!;
            handlersForTopic.delete(handlerId);
            if (handlersForTopic.size === 0) await this.UnregisterInterestInSingleTopicOnHub(topic);
            return;
        }

        if (this.integerPacketHandlers.has(topic))
        {
            let handlersForTopic = this.integerPacketHandlers.get(topic)!;
            handlersForTopic.delete(handlerId);
            if (handlersForTopic.size === 0) await this.UnregisterInterestInSingleTopicOnHub(topic);
            return;
        }

        if (this.longPacketHandlers.has(topic))
        {
            let handlersForTopic = this.longPacketHandlers.get(topic)!;
            handlersForTopic.delete(handlerId);
            if (handlersForTopic.size === 0) await this.UnregisterInterestInSingleTopicOnHub(topic);
            return;
        }

        if (this.stringPacketHandlers.has(topic))
        {
            let handlersForTopic = this.stringPacketHandlers.get(topic)!;
            handlersForTopic.delete(handlerId);
            if (handlersForTopic.size === 0) await this.UnregisterInterestInSingleTopicOnHub(topic);
            return;
        }

        if (this.payloadPacketHandlers.has(topic))
        {
            let handlersForTopic = this.payloadPacketHandlers.get(topic)!;
            handlersForTopic.delete(handlerId);
            if (handlersForTopic.size === 0) await this.UnregisterInterestInSingleTopicOnHub(topic);
            return;
        }

        if (this.payloadPacketHandlersAsync.has(topic))
        {
            let handlersForTopic = this.payloadPacketHandlersAsync.get(topic)!;
            handlersForTopic.delete(handlerId);
            if (handlersForTopic.size === 0) await this.UnregisterInterestInSingleTopicOnHub(topic);
            return;
        }

        this.m_topicForHandlerId.delete(handlerId);
    }

    // ******** DECIMAL PACKET HANDLERS *********

    public RegisterDecimalPacketHandler = (topic: string, handler: Action1<DecimalPacket>) =>
    {
        this.messageHandlerId++;

        if (!this.decimalPacketHandlers.has(topic))
        {
            this.decimalPacketHandlers.set(topic, new Map<number, Action1<DecimalPacket>>());
        }

        let handlerMap = this.decimalPacketHandlers.get(topic)!;
        handlerMap.set(this.messageHandlerId, handler);

        this.m_topicForHandlerId.set(this.messageHandlerId, topic);

        setTimeout(async () => {
            await this.RegisterInterestInSingleTopicOnHub(topic);
        }, 1000);

        return this.messageHandlerId;
    }

    private GetDecimalPacketHandlersForTopic = (topic: string) =>
    {
        if (!this.decimalPacketHandlers.has(topic))
        {
            let result: Action1<DecimalPacket>[] = [];
            return result;
        }

        let handlers = this.decimalPacketHandlers.get(topic)!;

        return handlers.values();
    }

    private HandleDecimalPacketWrapper = (wrapper: DecimalPacketWrapper) =>
    {
        for (let handler of this.GetDecimalPacketHandlersForTopic(wrapper.Topic))
        {
            try
            {
                handler(wrapper.DecimalPacket);
            }
            catch (ex)
            {
                console.log(`Decimal Packet Handler Error : ${wrapper.Topic} : ${ex}`);
                // SWALLOW FOR NOW
            }
        }
    }

    // ******** END DECIMAL PACKET HANDLERS *********


    // ******** INTEGER PACKET HANDLERS *********

    public RegisterIntegerPacketHandler = (topic: string, handler: Action1<IntegerPacket>) =>
    {
        this.messageHandlerId++;

        if (!this.integerPacketHandlers.has(topic))
        {
            this.integerPacketHandlers.set(topic, new Map<number, Action1<IntegerPacket>>());
        }

        let handlerMap = this.integerPacketHandlers.get(topic)!;
        handlerMap.set(this.messageHandlerId, handler);

        this.m_topicForHandlerId.set(this.messageHandlerId, topic);

        setTimeout(async () => {
            await this.RegisterInterestInSingleTopicOnHub(topic);
        }, 1000);

        return this.messageHandlerId;
    }

    private GetIntegerPacketHandlersForTopic = (topic: string) =>
    {
        if (!this.integerPacketHandlers.has(topic))
        {
            let result: Action1<IntegerPacket>[] = [];
            return result;
        }

        let handlers = this.integerPacketHandlers.get(topic)!;

        return handlers.values();
    }

    private HandleIntegerPacketWrapper = (wrapper: IntegerPacketWrapper) =>
    {
        for (let handler of this.GetIntegerPacketHandlersForTopic(wrapper.Topic))
        {
            try
            {
                handler(wrapper.IntegerPacket);
            }
            catch (ex)
            {
                console.log(`Integer Packet Handler Error : ${wrapper.Topic} : ${ex}`);
                // SWALLOW FOR NOW
            }
        }
    }

    // ******** END INTEGER PACKET HANDLERS *********


    // ******** LONG PACKET HANDLERS *********

    public RegisterLongPacketHandler = (topic: string, handler: Action1<LongPacket>) =>
    {
        this.messageHandlerId++;

        if (!this.longPacketHandlers.has(topic))
        {
            this.longPacketHandlers.set(topic, new Map<number, Action1<LongPacket>>());
        }

        let handlerMap = this.longPacketHandlers.get(topic)!;
        handlerMap.set(this.messageHandlerId, handler);

        this.m_topicForHandlerId.set(this.messageHandlerId, topic);

        setTimeout(async () => {
            await this.RegisterInterestInSingleTopicOnHub(topic);
        }, 1000);

        return this.messageHandlerId;
    }

    private GetLongPacketHandlersForTopic = (topic: string) =>
    {
        if (!this.longPacketHandlers.has(topic))
        {
            let result: Action1<LongPacket>[] = [];
            return result;
        }

        let handlers = this.longPacketHandlers.get(topic)!;

        return handlers.values();
    }

    private HandleLongPacketWrapper = (wrapper: LongPacketWrapper) =>
    {
        for (let handler of this.GetLongPacketHandlersForTopic(wrapper.Topic))
        {
            try
            {
                handler(wrapper.LongPacket);
            }
            catch (ex)
            {
                console.log(`Long Packet Handler Error : ${wrapper.Topic} : ${ex}`);
                // SWALLOW FOR NOW
            }
        }
    }

    // ******** END LONG PACKET HANDLERS *********


    // ******** STRING PACKET HANDLERS *********

    public RegisterStringPacketHandler = (topic: string, handler: Action1<StringPacket>) =>
    {
        this.messageHandlerId++;

        if (!this.stringPacketHandlers.has(topic))
        {
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

    private GetStringPacketHandlersForTopic = (topic: string) =>
    {
        if (!this.stringPacketHandlers.has(topic))
        {
            let result: Action1<StringPacket>[] = [];
            return result;
        }

        let handlers = this.stringPacketHandlers.get(topic)!;

        return handlers.values();
    }

    private HandleStringPacketWrapper = (wrapper: StringPacketWrapper) =>
    {
        for (let handler of this.GetStringPacketHandlersForTopic(wrapper.Topic))
        {
            try
            {
                handler(wrapper.StringPacket);
            }
            catch (ex)
            {
                console.log(`String Packet Handler Error : ${wrapper.Topic} : ${ex}`);
                // SWALLOW FOR NOW
            }
        }
    }

    // ******** END STRING PACKET HANDLERS *********


    // ******** PAYLOAD PACKET HANDLERS *********

    public RegisterPayloadPacketHandler = (topic: string, handler: Action1<PayloadPacket>) =>
    {
        this.messageHandlerId++;

        if (!this.payloadPacketHandlers.has(topic))
        {
            this.payloadPacketHandlers.set(topic, new Map<number, Action1<PayloadPacket>>());
        }

        let handlerMap = this.payloadPacketHandlers.get(topic)!;
        handlerMap.set(this.messageHandlerId, handler);

        this.m_topicForHandlerId.set(this.messageHandlerId, topic);

        setTimeout(async () => {
            await this.RegisterInterestInSingleTopicOnHub(topic);
        }, 1000);

        return this.messageHandlerId;
    }

    private GetPayloadPacketHandlersForTopic = (topic: string) =>
    {
        if (!this.payloadPacketHandlers.has(topic))
        {
            let result: Action1<PayloadPacket>[] = [];
            return result;
        }

        let handlers = this.payloadPacketHandlers.get(topic)!;

        return handlers.values();
    }

    private HandlePayloadPacketWrapper = (wrapper: PayloadPacketWrapper) =>
    {
        for (let handler of this.GetPayloadPacketHandlersForTopic(wrapper.Topic))
        {
            try
            {
                handler(wrapper.PayloadPacket);
            }
            catch (ex)
            {
                console.log(`Payload Packet Handler Error : ${wrapper.Topic} : ${ex}`);
                // SWALLOW FOR NOW
            }
        }

        (async() => await this.HandlePayloadPacketWrapperAsync(wrapper))();
    }

    // ******** END PAYLOAD PACKET HANDLERS *********


    // ******** PAYLOAD PACKET ASYNC HANDLERS *********

    public RegisterPayloadPacketHandlerAsync = (topic: string, handler: Promise_1<PayloadPacket>) =>
    {
        this.messageHandlerId++;

        if (!this.payloadPacketHandlersAsync.has(topic))
        {
            this.payloadPacketHandlersAsync.set(topic, new Map<number, Promise_1<PayloadPacket>>());
        }

        let handlerMap = this.payloadPacketHandlersAsync.get(topic)!;
        handlerMap.set(this.messageHandlerId, handler);

        this.m_topicForHandlerId.set(this.messageHandlerId, topic);

        setTimeout(async () => {
            await this.RegisterInterestInSingleTopicOnHub(topic);
        }, 1000);

        return this.messageHandlerId;
    }

    private GetPayloadPacketHandlersForTopicAsync = (topic: string) =>
    {
        if (!this.payloadPacketHandlersAsync.has(topic))
        {
            let result: Promise_1<PayloadPacket>[] = [];
            return result;
        }

        let handlers = this.payloadPacketHandlersAsync.get(topic)!;

        return handlers.values();
    }

    private HandlePayloadPacketWrapperAsync = async (wrapper: PayloadPacketWrapper) =>
    {
        for (let handler of this.GetPayloadPacketHandlersForTopicAsync(wrapper.Topic))
        {
            try
            {
                await handler(wrapper.PayloadPacket);
            }
            catch (ex)
            {
                console.log(`Payload Packet Handler Error : ${wrapper.Topic} : ${ex}`);
                // SWALLOW FOR NOW
            }
        }
    }

    // ******** END PAYLOAD PACKET ASYNC HANDLERS *********


    // ******** PUBLISH SECTION *********

    public publishPayloadPacket = async (topic: string, payload: PayloadPacket,
        retain: boolean, publishErrorHandler?: (err: Error) => void) => {
            if (!this.IsConnected) return;

            try
            {
                await this.messageHubConnection.send("PostPayloadPacketToTopic", topic, payload, retain);
            }
            catch (err)
            {
                if (!isNullOrUndefined(publishErrorHandler)) publishErrorHandler!(err as any);
            }
    }

    public publishString = async (topic: string, payload: StringPacket,
        retain: boolean, publishErrorHandler?: (err: Error) => void) => {
            if (!this.IsConnected) return;

            try
            {
                await this.messageHubConnection.send("PostStringPacketToTopic", topic, payload, retain);
            }
            catch (err)
            {
                if (!isNullOrUndefined(publishErrorHandler)) publishErrorHandler!(err as any);
            }

    }

    public publishDecimalPacket = async (topic: string, payload: DecimalPacket,
        retain: boolean, publishErrorHandler?: (err: Error) => void) => {
            if (!this.IsConnected) return;

            try
            {
                await this.messageHubConnection.send("PostDecimalPacketToTopic", topic, payload, retain);
            }
            catch (err)
            {
                if (!isNullOrUndefined(publishErrorHandler)) publishErrorHandler!(err as any);
            }
    }

    public publishIntegerPacket = async (topic: string, payload: IntegerPacket,
        retain: boolean, publishErrorHandler?: (err: Error) => void) => {
            if (!this.IsConnected) return;

            try
            {
                await this.messageHubConnection.send("PostIntegerPacketToTopic", topic, payload, retain);
            }
            catch (err)
            {
                if (!isNullOrUndefined(publishErrorHandler)) publishErrorHandler!(err as any);
            }
    }

    public publishLongPacket = async (topic: string, payload: LongPacket,
        retain: boolean, publishErrorHandler?: (err: Error) => void) => {
            if (!this.IsConnected) return;

            try
            {
                await this.messageHubConnection.send("PostLongPacketToTopic", topic, payload, retain);
            }
            catch (err)
            {
                if (!isNullOrUndefined(publishErrorHandler)) publishErrorHandler!(err as any);
            }
    }

    // ******** END PUBLISH SECTION *********

    // ********* LAST WILL **********
    public registerLastWillStringPacketMessage = async (topic: string, message: StringPacket, retain: boolean) =>
    {
        let idx = this.lastWillStringPacketMessages.findIndex(msg => msg.Topic === topic);
        if (idx >= 0) this.lastWillStringPacketMessages.splice(idx, 1);
        this.lastWillStringPacketMessages.push(StringPacketWrapper.Create(topic, message));

        if (!this.IsConnected) return;

        try
        {
            await this.messageHubConnection.send("RegisterLastWillStringPacketMessage", topic, message, retain);
        }
        catch (err)
        {
            // SWALLOW FOR NOW
        }
    }

    public registerLastWillLongPacketMessage = async (topic: string, message: LongPacket, retain: boolean) =>
    {
        let idx = this.lastWillLongPacketMessages.findIndex(msg => msg.Topic === topic);
        if (idx >= 0) this.lastWillLongPacketMessages.splice(idx, 1);
        this.lastWillLongPacketMessages.push(LongPacketWrapper.Create(topic, message));

        if (!this.IsConnected) return;

        try
        {
            await this.messageHubConnection.send("RegisterLastWillLongPacketMessage", topic, message, retain);
        }
        catch (err)
        {
            // SWALLOW FOR NOW
        }
    }

    public registerLastWillIntegerPacketMessage = async (topic: string, message: IntegerPacket, retain: boolean) =>
    {
        let idx = this.lastWillIntegerPacketMessages.findIndex(msg => msg.Topic === topic);
        if (idx >= 0) this.lastWillIntegerPacketMessages.splice(idx, 1);
        this.lastWillIntegerPacketMessages.push(IntegerPacketWrapper.Create(topic, message));

        if (!this.IsConnected) return;

        try
        {
            await this.messageHubConnection.send("RegisterLastWillIntegerPacketMessage", topic, message, retain);
        }
        catch (err)
        {
            // SWALLOW FOR NOW
        }
    }

    public registerLastWillDecimalPacketMessage = async (topic: string, message: DecimalPacket, retain: boolean) =>
    {
        let idx = this.lastWillDecimalPacketMessages.findIndex(msg => msg.Topic === topic);
        if (idx >= 0) this.lastWillDecimalPacketMessages.splice(idx, 1);
        this.lastWillDecimalPacketMessages.push(DecimalPacketWrapper.Create(topic, message));

        if (!this.IsConnected) return;

        try
        {
            await this.messageHubConnection.send("RegisterLastWillDecimalPacketMessage", topic, message, retain);
        }
        catch (err)
        {
            // SWALLOW FOR NOW
        }
    }

    public registerLastWillPayloadPacketMessage = async (topic: string, message: PayloadPacket, retain: boolean) =>
    {
        let idx = this.lastWillPayloadPacketMessages.findIndex(msg => msg.Topic === topic);
        if (idx >= 0) this.lastWillPayloadPacketMessages.splice(idx, 1);
        this.lastWillPayloadPacketMessages.push(PayloadPacketWrapper.Create(topic, message));

        if (!this.IsConnected) return;

        try
        {
            await this.messageHubConnection.send("RegisterLastWillPayloadPacketMessage", topic, message, retain);
        }
        catch (err)
        {
            // SWALLOW FOR NOW
        }
    }
    // ******* END LAST WILL ********
}
