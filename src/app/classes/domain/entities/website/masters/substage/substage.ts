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
import { ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";
import { SubStageFetchRequest } from "./substagefetchrequest";


export class SubStageProps {
  public readonly Db_Table_Name = "SubStageMaster";
  public Ref: number = 0;
  public StageRef: number = 0;
  public readonly StageName: number = 0;
  public StageType: number = 0;
  public StageTypeName: String = '';
  public Name: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public CreatedBy: number = 0;
  public UpdatedBy: number = 0;

  public readonly IsNewlyCreated: boolean = false;

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new SubStageProps(true);
  }
}

export class SubStage implements IPersistable<SubStage> {
  public static readonly Db_Table_Name: string = 'SubStageMaster';

  private constructor(public readonly p: SubStageProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): SubStage {
    let newState: SubStageProps = Utils.GetInstance().DeepCopy(this.p);
    return SubStage.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new SubStage(SubStageProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new SubStage(data as SubStageProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') {
      vra.add('Name', 'Name cannot be blank.');
    } else if (!new RegExp(ValidationPatterns.NameWithNosAndSpace).test(this.p.Name)) {
      vra.add('Name', ValidationMessages.NameWithNosAndSpaceMsg + ' for Name');
    }

  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, SubStage.Db_Table_Name, this.p);
  }

  private static m_currentInstance: SubStage = SubStage.CreateNewInstance();

  public static GetCurrentInstance() {
    return SubStage.m_currentInstance;
  }

  public static SetCurrentInstance(value: SubStage) {
    SubStage.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): SubStage {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, SubStage.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, SubStage.Db_Table_Name)!.Entries) {
        return SubStage.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): SubStage[] {
    let result: SubStage[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, SubStage.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, SubStage.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(SubStage.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): SubStage[] {
    return SubStage.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: SubStageFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new SubStageFetchRequest();
    req.SubStageRefs.push(ref);

    let tdResponse = await SubStage.FetchTransportData(req, errorHandler) as TransportData;
    return SubStage.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: SubStageFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await SubStage.FetchTransportData(req, errorHandler) as TransportData;
    return SubStage.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new SubStageFetchRequest();
    let tdResponse = await SubStage.FetchTransportData(req, errorHandler) as TransportData;
    return SubStage.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new SubStageFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await SubStage.FetchTransportData(req, errorHandler) as TransportData;
    return SubStage.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByStageRef(StageRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new SubStageFetchRequest();
    req.StageRefs.push(StageRef)
    let tdResponse = await SubStage.FetchTransportData(req, errorHandler) as TransportData;
    return SubStage.ListFromTransportData(tdResponse);
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
