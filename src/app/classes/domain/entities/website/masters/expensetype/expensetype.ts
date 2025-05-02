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
import { CountryStateCityRefs, ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";
import { ExpenseTypeFetchRequest } from "./expensetypefetchrequest";

export class StageProps {
  public StageRef: number = 0;
  public StageName: string = '';
}


export class ExpenseTypeProps {
  public readonly Db_Table_Name = "ExpenseTypeMaster";
  public Ref: number = 0;
  public Name: string = '';
  public SelectedStages: StageProps[] = [];

  public CreatedBy: number = 0;
  public UpdatedBy: number = 0;
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public ExpenseType: number = 0;

  public readonly IsNewlyCreated: boolean = false;

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new ExpenseTypeProps(true);
  }
}

export class ExpenseType implements IPersistable<ExpenseType> {
  public static readonly Db_Table_Name: string = 'ExpenseTypeMaster';

  private constructor(public readonly p: ExpenseTypeProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): ExpenseType {
    let newState: ExpenseTypeProps = Utils.GetInstance().DeepCopy(this.p);
    return ExpenseType.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new ExpenseType(ExpenseTypeProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new ExpenseType(data as ExpenseTypeProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, ExpenseType.Db_Table_Name, this.p);
  }

  private static m_currentInstance: ExpenseType = ExpenseType.CreateNewInstance();

  public static GetCurrentInstance() {
    return ExpenseType.m_currentInstance;
  }

  public static SetCurrentInstance(value: ExpenseType) {
    ExpenseType.m_currentInstance = value;
  }

  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): ExpenseType {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, ExpenseType.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, ExpenseType.Db_Table_Name)!.Entries) {
        return ExpenseType.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): ExpenseType[] {
    let result: ExpenseType[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, ExpenseType.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, ExpenseType.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(ExpenseType.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): ExpenseType[] {
    return ExpenseType.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: ExpenseTypeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new ExpenseTypeFetchRequest();
    req.ExpenseTypeRefs.push(ref);

    let tdResponse = await ExpenseType.FetchTransportData(req, errorHandler) as TransportData;
    return ExpenseType.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: ExpenseTypeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await ExpenseType.FetchTransportData(req, errorHandler) as TransportData;
    return ExpenseType.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ExpenseTypeFetchRequest();
    let tdResponse = await ExpenseType.FetchTransportData(req, errorHandler) as TransportData;
    return ExpenseType.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ExpenseTypeFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await ExpenseType.FetchTransportData(req, errorHandler) as TransportData;
    return ExpenseType.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByStageRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ExpenseTypeFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await ExpenseType.FetchTransportData(req, errorHandler) as TransportData;
    return ExpenseType.ListFromTransportData(tdResponse);
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
