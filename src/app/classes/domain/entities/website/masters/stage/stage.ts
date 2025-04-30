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
import { StageFetchRequest } from "./stagefetchrequest";
import { ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";


export class StageProps {
  public readonly Db_Table_Name = "StageMaster";
  public Ref: number = 0;
  public Name: string = '';
  public StageType: number = 0;
  public DisplayOrder: number = 0;
  public IsSubStage: Boolean = false;
  public IsMachinaryexpense: Boolean = false;
  public IsLabourExpense: Boolean = false;
  public IsOther: Boolean = false;
  public CompanyRef: number = 0;
  public CompanyName: string = '';

  public readonly IsNewlyCreated: boolean = false;

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new StageProps(true);
  }
}

export class Stage implements IPersistable<Stage> {
  public static readonly Db_Table_Name: string = 'StageMaster';

  private constructor(public readonly p: StageProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Stage {
    let newState: StageProps = Utils.GetInstance().DeepCopy(this.p);
    return Stage.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Stage(StageProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Stage(data as StageProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') {
      vra.add('Name', 'Name cannot be blank.');
    } else if (!new RegExp(ValidationPatterns.NameWithNosAndSpace).test(this.p.Name)) {
      vra.add('Name', ValidationMessages.NameWithNosAndSpaceMsg + ' for Name');
    }
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company Name cannot be blank.');
    if (this.p.DisplayOrder == 0) {
      vra.add('DisplayOrder', 'Display Order cannot be blank.');
    } else if (this.p.DisplayOrder < 0) {
      vra.add('DisplayOrder', 'Display Order cannot be less then 0.');
    } else if (this.p.DisplayOrder.toString().includes('.')) {
      vra.add('DisplayOrder', 'Rational Number not allowed for Display Order');
    }
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Stage.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Stage = Stage.CreateNewInstance();

  public static GetCurrentInstance() {
    return Stage.m_currentInstance;
  }

  public static SetCurrentInstance(value: Stage) {
    Stage.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Stage {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Stage.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Stage.Db_Table_Name)!.Entries) {
        return Stage.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): Stage[] {
    let result: Stage[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Stage.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Stage.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Stage.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Stage[] {
    return Stage.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: StageFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new StageFetchRequest();
    req.StageRefs.push(ref);

    let tdResponse = await Stage.FetchTransportData(req, errorHandler) as TransportData;
    return Stage.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: StageFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Stage.FetchTransportData(req, errorHandler) as TransportData;
    return Stage.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new StageFetchRequest();
    let tdResponse = await Stage.FetchTransportData(req, errorHandler) as TransportData;
    return Stage.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new StageFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await Stage.FetchTransportData(req, errorHandler) as TransportData;
    return Stage.ListFromTransportData(tdResponse);
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
