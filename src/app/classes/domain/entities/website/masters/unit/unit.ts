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
import { UnitFetchRequest } from "./unitfetchrequest";


export class UnitProps {
  public readonly Db_Table_Name = "UnitMaster";
  public Ref: number = 0;
  public Name: string = '';
  public CompanyRef:number =0
  public CompanyName:string =''


  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new UnitProps(true);
  }
}

export class Unit implements IPersistable<Unit> {
  public static readonly Db_Table_Name: string = 'UnitMaster';

  private constructor(public readonly p: UnitProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Unit {
    let newState: UnitProps = Utils.GetInstance().DeepCopy(this.p);
    return Unit.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Unit(UnitProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Unit(data as UnitProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Unit.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Unit = Unit.CreateNewInstance();

  public static GetCurrentInstance() {
    return Unit.m_currentInstance;
  }

  public static SetCurrentInstance(value: Unit) {
    Unit.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Unit {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Unit.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Unit.Db_Table_Name)!.Entries) {
        return Unit.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): Unit[] {
    let result: Unit[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Unit.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Unit.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Unit.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Unit[] {
    return Unit.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: UnitFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new UnitFetchRequest();
    req.UnitRef.push(ref);

    let tdResponse = await Unit.FetchTransportData(req, errorHandler) as TransportData;
    return Unit.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: UnitFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Unit.FetchTransportData(req, errorHandler) as TransportData;
    return Unit.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new UnitFetchRequest();
    let tdResponse = await Unit.FetchTransportData(req, errorHandler) as TransportData;
    return Unit.ListFromTransportData(tdResponse);
  }
  // public static async FetchEntireListByProjectRef(ProjectRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
  //   let req = new UnitFetchRequest();
  //   req.GAAProjectRefs.push(ProjectRef)
  //   let tdResponse = await Unit.FetchTransportData(req, errorHandler) as TransportData;
  //   return Unit.ListFromTransportData(tdResponse);
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
