import { DataContainer } from "./datacontainer";

export class TransportData
{
    RequestType: string = '';
    InMemoryDataRepositoryNamesToBeFetched: string[] = [];
    MainData: DataContainer = new DataContainer();
}
