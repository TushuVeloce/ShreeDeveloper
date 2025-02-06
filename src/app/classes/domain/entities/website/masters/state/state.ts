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
import { StateFetchRequest } from "./statefetchrequest";

export class StateProps {
  public Ref: number = 0;
  public Name: string = '';
  public CountryRef: number = 0;
  public readonly CountryName: string = '';

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new StateProps(true);
  }
}

export class State implements IPersistable<State> {
  public static readonly MasterTableName: string = 'StateMaster';

  private constructor(public readonly p: StateProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      // const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): State {
    let newState: StateProps = Utils.GetInstance().DeepCopy(this.p);
    return State.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new State(StateProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new State(data as StateProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
    if (this.p.CountryRef <= 0) vra.add('CountryRef', 'Country cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, State.MasterTableName, this.p);
  }

  private static m_currentInstance: State = State.CreateNewInstance();

  public static GetCurrentInstance() {
    return State.m_currentInstance;
  }

  public static SetCurrentInstance(value: State) {
    State.m_currentInstance = value;
  }

  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): State {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, State.MasterTableName)) {
      for (let data of dcs.GetCollection(td.MainData, State.MasterTableName)!.Entries) {
        return State.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): State[] {
    let result: State[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, State.MasterTableName)) {
      let coll = dcs.GetCollection(cont, State.MasterTableName)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(State.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): State[] {
    return State.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: StateFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new StateFetchRequest();
    req.CountryRefs.push(ref);

    let tdResponse = await State.FetchTransportData(req, errorHandler) as TransportData;
    return State.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: StateFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await State.FetchTransportData(req, errorHandler) as TransportData;
    return State.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new StateFetchRequest();
    let tdResponse = await State.FetchTransportData(req, errorHandler) as TransportData;
    return State.ListFromTransportData(tdResponse);
  }
  // public static async FetchEntireListByCountryRef(SpaceGroupRef :number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
  //   let req = new StateFetchRequest();
  //   req.CountryRefs.push(SpaceGroupRef)
  //   let tdResponse = await State.FetchTransportData(req, errorHandler) as TransportData;
  //   return State.ListFromTransportData(tdResponse);
  // }

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
