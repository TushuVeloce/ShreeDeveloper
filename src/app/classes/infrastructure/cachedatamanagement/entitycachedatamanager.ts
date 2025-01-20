import { MessageHubService } from "src/app/services/messagehub.service";
import { SessionValues } from "src/app/services/sessionvalues.service";
import { isNullOrUndefined } from "util";
import { CacheDataSubscriptionStatusManager } from "./cachedatasubscriptionstatusmanager";
import { Action1 } from "../domain";
import { SubscriptionCleanupManager } from "../subscriptioncleanupmanager";
import { TransportData } from "../transportdata";
import { EntityUtilityMethods } from "../entityutilitymethods";

export class EntityCacheDataManager<TEntity, ITEntity>
{
    constructor(private masterTableName: string,
        private noneEntityCreator: (noneOptionString: string) => TEntity,
        private defaultNoneOptionString: string,
        private entityUtilityMethods: EntityUtilityMethods<TEntity, ITEntity>) {}

    protected cacheList: TEntity[] = [];

    protected cacheDataChangeHandlers: Map<number, Action1<TEntity[]>> 
        = new Map<number, Action1<TEntity[]>>();
    
    protected cacheDataChangeHandlerId: number = 0;

    public RegisterCacheDataChangeHandler(handler: Action1<TEntity[]>)
    {
        if (isNullOrUndefined(handler)) return;

        this.cacheDataChangeHandlerId++;
        this.cacheDataChangeHandlers.set(this.cacheDataChangeHandlerId, handler);
        handler(this.GetCachedList());

        return this.cacheDataChangeHandlerId;
    }

    public UnregisterCacheDataChangeHandler(handlerId: number)
    {
        this.cacheDataChangeHandlers.delete(handlerId);
    }

    protected InvokeCacheDataChangeHandlers()
    {
        for (let handler of this.cacheDataChangeHandlers.values())
        {
            handler(this.GetCachedList());
        }
    }

    protected SubscribeToCacheData() 
    {
        let mTableName = this.masterTableName;
        if (CacheDataSubscriptionStatusManager.IsCacheDataTopicSubscribed(mTableName)) return;

        let custId = SessionValues.getCustomerIdentifier().trim().toUpperCase();
        if (custId.trim().length == 0) custId = "DEVPC";
        let topic: string = `${custId}/CacheData/${mTableName}`;

        let hId = MessageHubService.GetInstance().RegisterPayloadPacketHandler(topic,
            pkt => {
                let td = JSON.parse(pkt.Payload) as TransportData;
                let lst = this.entityUtilityMethods.ListFromTransportData(td);
                this.cacheList = lst;
                this.InvokeCacheDataChangeHandlers();
            });

        SubscriptionCleanupManager.RegisterMessageHubHandlerIdForUnsubscription(hId);
        CacheDataSubscriptionStatusManager.SetCacheDataTopicAsSubscribed(mTableName);
    }

    public GetCachedList(withNoneOption: boolean = false, 
        noneOptionString: string = this.defaultNoneOptionString)
    {
        this.SubscribeToCacheData();
        
        let lst = [...this.cacheList];

        if (withNoneOption)
        {
            let noneEntity = this.noneEntityCreator(noneOptionString);
            lst.unshift(noneEntity);
        }

        return lst;
    }
}