import { SessionValues } from 'src/app/services/sessionvalues.service';

export class DataUpdationTopics {
    public static CacheDataTopic(masterTableName: string): string
    {
        let sv = SessionValues.GetInstance();
        let cacheDataTopic: string = "CacheData";
        return `${sv.ProjectName}/${sv.CustomerLicenseNo}/${cacheDataTopic}/${masterTableName}`;
    }
}