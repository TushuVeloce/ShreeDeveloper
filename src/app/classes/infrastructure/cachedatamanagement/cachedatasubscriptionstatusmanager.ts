export class CacheDataSubscriptionStatusManager
{
    private static m_subscribedMasterTableNames: string[] = [];

    public static IsCacheDataTopicSubscribed(masterTableName: string)
    {
        return CacheDataSubscriptionStatusManager.m_subscribedMasterTableNames.some(v => v == masterTableName);
    }

    public static SetCacheDataTopicAsSubscribed(masterTableName: string)
    {
        if (!CacheDataSubscriptionStatusManager.IsCacheDataTopicSubscribed(masterTableName))
        {
            CacheDataSubscriptionStatusManager.m_subscribedMasterTableNames.push(masterTableName);
        }
    }

    public static ClearAllCacheDataTopicSubscriptionStatuses()
    {
        CacheDataSubscriptionStatusManager.m_subscribedMasterTableNames = [];
    }
}