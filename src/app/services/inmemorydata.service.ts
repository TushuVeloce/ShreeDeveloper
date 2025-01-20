import { Injectable } from '@angular/core';
import { DataContainer } from '../classes/infrastructure/datacontainer';
import { DataCollection } from '../classes/infrastructure/datacollection';

@Injectable({
    providedIn: 'root'
  })
export class InMemoryData
{
    private m_container: DataContainer = new DataContainer();

    public get Collections(): DataCollection[] { return this.m_container.Collections; }
}
