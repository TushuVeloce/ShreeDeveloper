import { DataContainer } from "./datacontainer";
import { DataContainerService } from "./datacontainer.service";
import { TransportData } from "./transportdata";

export class EntityUtilityMethods<TEntity, ITEntity>
{
    constructor(private masterTableName: string,
        private instanceCreator: (data: ITEntity, allowEdit: boolean) => TEntity){}
    
    public SingleInstanceFromTransportData(td: TransportData): TEntity
    {
        let dcs = DataContainerService.GetInstance();

        if (dcs.CollectionExists(td.MainData, this.masterTableName))
        {
            for(let data of dcs.GetCollection(td.MainData, this.masterTableName)!.Entries)
            {
                return this.instanceCreator(data as ITEntity, false);
            }
        }

        return null as any;
    }

    public ListFromDataContainer(cont: DataContainer): TEntity[]
    {
        let result: TEntity[] = [];

        let dcs = DataContainerService.GetInstance();

        if (dcs.CollectionExists(cont, this.masterTableName))
        {
            let coll = dcs.GetCollection(cont, this.masterTableName)!;
            let entries = coll.Entries;

            for(let data of entries)
            {
                result.push(this.instanceCreator(data as ITEntity, false));
            }
        }

        return result;
    }

    public ListFromTransportData(td: TransportData): TEntity[]
    {
        return this.ListFromDataContainer(td.MainData);
    }
}