import { EntityUtilityMethods } from "../entityutilitymethods";
import { EntityCacheDataManager } from "./entitycachedatamanager";

export class SinglePrimaryKeyEntityCacheDataManager<TEntity, ITEntity> extends EntityCacheDataManager<TEntity, ITEntity>
{
    constructor(masterTableName: string,
        noneEntityCreator: (noneOptionString: string) => TEntity,
        defaultNoneOptionString: string,
        entityUtilityMethods: EntityUtilityMethods<TEntity, ITEntity>,
        private primaryKeyName: string = 'Ref') {
            super(masterTableName, noneEntityCreator, defaultNoneOptionString, entityUtilityMethods);
        }

    public GetCachedInstance(ref: number) 
    {
        return super.GetCachedList().find(e => +(e as any)['p'][this.primaryKeyName] == ref);
    }

    public GetCachedInstances(refs: number[]) 
    {
        var lst = super.GetCachedList().filter(e => refs.includes(+(e as any)['p'][this.primaryKeyName]));
        return lst;
    }
}