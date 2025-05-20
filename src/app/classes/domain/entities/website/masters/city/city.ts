import { IPersistable } from "src/app/classes/infrastructure/IPersistable";
import { DataContainer } from "src/app/classes/infrastructure/datacontainer";
import { DataContainerService } from "src/app/classes/infrastructure/datacontainer.service";
import { PayloadPacketFacade } from "src/app/classes/infrastructure/payloadpacket/payloadpacketfacade";
import { TransportData } from "src/app/classes/infrastructure/transportdata";
import { ValidationResultAccumulator } from "src/app/classes/infrastructure/validationresultaccumulator";
import { IdProvider } from "src/app/services/idprovider.service";
import { ServerCommunicatorService } from "src/app/services/server-communicator.service";
import { Utils } from "src/app/services/utils.service";
import { isNullOrUndefined } from "src/tools";
import { UIUtils } from "src/app/services/uiutils.service";
import { RequestTypes } from "src/app/classes/infrastructure/enums";
import { CityFetchRequest } from "./cityfetchrequest";
import { CountryStateCityRefs } from "src/app/classes/domain/constants";

export class CityProps {
  public Ref: number = 0;
  public Name: string = '';
  public CountryRef: number = CountryStateCityRefs.IndiaRef;
  public readonly CountryName: string = '';
  public StateRef: number = CountryStateCityRefs.MaharashtraRef;
  public readonly StateName: string = '';

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new CityProps(true);
  }
}

export class City implements IPersistable<City> {
  public static readonly MasterTableName: string = 'CityMaster';

  private constructor(public readonly p: CityProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): City {
    let newCity: CityProps = Utils.GetInstance().DeepCopy(this.p);
    return City.CreateInstance(newCity, true);
  }

  public static CreateNewInstance() {
    return new City(CityProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new City(data as CityProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
    if (this.p.StateRef <= 0) vra.add('StateRef', 'State cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, City.MasterTableName, this.p);
  }

  private static m_currentInstance: City = City.CreateNewInstance();

  public static GetCurrentInstance() {
    return City.m_currentInstance;
  }

  public static SetCurrentInstance(value: City) {
    City.m_currentInstance = value;
  }

  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): City {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, City.MasterTableName)) {
      for (let data of dcs.GetCollection(td.MainData, City.MasterTableName)!.Entries) {
        return City.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
   sortPropertyName: string = ""): City[] {
    let result: City[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, City.MasterTableName)) {
      let coll = dcs.GetCollection(cont, City.MasterTableName)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(City.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): City[] {
    return City.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: CityFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdRequest = req.FormulateTransportData();
    let pktRequest = PayloadPacketFacade.GetInstance().CreateNewPayloadPacket2(tdRequest);

    let tr = await ServerCommunicatorService.GetInstance().sendHttpRequest(pktRequest);
    if (!tr.Successful) {
      if (!isNullOrUndefined(errorHandler)) await errorHandler(tr.Message);
      return null;
    }

    let tdResponse = JSON.parse(tr.Tag) as TransportData;
    return tdResponse;
  }

  public static async FetchInstance(ref: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CityFetchRequest();
    req.StateRefs.push(ref);

    let tdResponse = await City.FetchTransportData(req, errorHandler) as TransportData;
    return City.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: CityFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await City.FetchTransportData(req, errorHandler) as TransportData;
    return City.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CityFetchRequest();
    let tdResponse = await City.FetchTransportData(req, errorHandler) as TransportData;
    return City.ListFromTransportData(tdResponse);
  }
  public static async FetchEntireListByStateRef(StateRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CityFetchRequest();
    req.StateRefs.push(StateRef)
    let tdResponse = await City.FetchTransportData(req, errorHandler) as TransportData;
    return City.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new CityFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await City.FetchTransportData(req, errorHandler) as TransportData;
    return City.ListFromTransportData(tdResponse);
  }

  public async DeleteInstance(successHandler: () => Promise<void> = null!, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdRequest = new TransportData();
    tdRequest.RequestType = RequestTypes.Deletion;

    this.MergeIntoTransportData(tdRequest);
    let pktRequest = PayloadPacketFacade.GetInstance().CreateNewPayloadPacket2(tdRequest);

    let tr = await ServerCommunicatorService.GetInstance().sendHttpRequest(pktRequest);
    if (!tr.Successful) {
      if (!isNullOrUndefined(errorHandler)) await errorHandler(tr.Message);
    }
    else {
      if (!isNullOrUndefined(successHandler)) await successHandler();
    }
  }

}
