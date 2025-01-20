import { MessageHubService } from "src/app/services/messagehub.service";

export class SubscriptionCleanupManager
{
    private static m_messageHubHandlerIds: number[] = [];

    public static RegisterMessageHubHandlerIdForUnsubscription(hId: number)
    {
        if (!SubscriptionCleanupManager.m_messageHubHandlerIds.some(v => v == hId))
        {
            SubscriptionCleanupManager.m_messageHubHandlerIds.push(hId);
        }
    }

    public static UnsubscribeAllMessageHubHandlers()
    {
        for (let hId of SubscriptionCleanupManager.m_messageHubHandlerIds)
        {
            MessageHubService.GetInstance().UnregisterPacketHandler(hId);
        }
    }
}