import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { SessionValues } from 'src/app/services/sessionvalues.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { PayloadPacketFacade } from '../payloadpacket/payloadpacketfacade';
import { isNullOrUndefined } from 'src/tools';

export class CacheDataChangeLevelFetchRequest
{
    MasterTableNames: string[] = [];
}

export class CacheDataChangeLevelManager
{
    private static m_currentChangeLevels: any = null;

    public static RefreshCacheDataChangeLevels = async () =>
    {
        let req = new CacheDataChangeLevelFetchRequest();

        let pkt = PayloadPacketFacade.GetInstance().CreateNewPayloadPacket2(req);

        let srv = ServerCommunicatorService.GetInstance();

        let tr = await srv.sendHttpRequest(pkt, 'fetchcachedatachangelevel');

        if (!tr.Successful)
        {
            UIUtils.GetInstance().showErrorMessage("Error", tr.Message);
            return;
        }

        let resp = JSON.parse(tr.Tag);
        
        CacheDataChangeLevelManager.m_currentChangeLevels = resp;
    }

    public static RefreshCacheDataChangeLevel = async (tableName: string) =>
    {
        let req = new CacheDataChangeLevelFetchRequest();
        req.MasterTableNames.push(tableName);

        let pkt = PayloadPacketFacade.GetInstance().CreateNewPayloadPacket2(req);

        let srv = ServerCommunicatorService.GetInstance();

        let tr = await srv.sendHttpRequest(pkt, 'fetchcachedatachangelevel');

        if (!tr.Successful)
        {
            UIUtils.GetInstance().showErrorMessage("Error", tr.Message);
            return;
        }

        let resp = JSON.parse(tr.Tag);
        
        if (CacheDataChangeLevelManager.m_currentChangeLevels.hasOwnProperty("ChangeLevels"))
        {
            CacheDataChangeLevelManager.m_currentChangeLevels["ChangeLevels"][tableName] = resp[tableName];
        }
        else
        {
            CacheDataChangeLevelManager.m_currentChangeLevels = resp;
        }
    }

    public static GetCacheDataChangeLevel = async (masterTableName: string) =>
    {
        if (isNullOrUndefined(CacheDataChangeLevelManager.m_currentChangeLevels)) return -1;

        if (CacheDataChangeLevelManager.m_currentChangeLevels.hasOwnProperty("ChangeLevels")) 
        {
            return +CacheDataChangeLevelManager.m_currentChangeLevels["ChangeLevels"][masterTableName];
        }

        return -1;
    }
}