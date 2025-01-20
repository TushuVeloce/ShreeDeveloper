import { Injectable } from '@angular/core';
import { DataCollection } from './datacollection';
import { DataContainer } from './datacontainer';
import { ServiceInjector } from './injector';

@Injectable({
    providedIn: "root",
})
export class DataContainerService
{
    public static GetInstance(): DataContainerService {
        return ServiceInjector.AppInjector.get(DataContainerService)
    }

    public GetCollection(cont: DataContainer, name: string)
    {
        return cont.Collections.find(coll => coll.Name === name);
    }

    public GetOrCreateCollection(cont: DataContainer, name: string)
    {
        if (!this.CollectionExists(cont, name))
        {
            cont.Collections.push(<DataCollection>{Name: name, Entries: []});
        }

        return this.GetCollection(cont, name);
    }

    public CollectionExists(cont: DataContainer, name: string)
    {
        return cont.Collections.some(coll => coll.Name === name);
    }

    public CopyCollectionToOtherContainer(contSource: DataContainer, 
        collectionName: string, contDestination: DataContainer, 
        predicate: (value: object) => boolean = (obj) => true)
    {
        if (!this.CollectionExists(contSource, collectionName)) return;

        let collDestination = this.GetOrCreateCollection(contDestination, collectionName)!;
        let collSource = this.GetCollection(contSource, collectionName)!;
        
        for(let e of collSource.Entries.filter(predicate))
        {
            collDestination.Entries.push(e);
        }
    }

    public MergeIntoContainer(cont: DataContainer, collectionName: string, value: any)
    {
        this.GetOrCreateCollection(cont, collectionName)!.Entries.push({...value});
    }
}