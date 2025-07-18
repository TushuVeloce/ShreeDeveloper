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
import { EstimateStagesFetchRequest } from "./estimatestagesfetchrequest";


export class EstimateStagesProps {
  public readonly Db_Table_Name = "EstimateStage";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public SiteRef: number = 0;
  public readonly SiteName: string = '';
  public StageRef: number = 0;
  public readonly StageName: string = '';
  public SubStageRef: number = 0;
  public readonly SubStageName: string = '';
  public TransDateTime: string = '';
  public Amount: number = 0;
  public Description: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public CreatedDate: string = '';
  public UpdatedDate: string = '';

  public readonly IsNewlyCreated: boolean = false;

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new EstimateStagesProps(true);
  }
}

export class EstimateStages implements IPersistable<EstimateStages> {
  public static readonly Db_Table_Name: string = 'EstimateStage';

  private constructor(public readonly p: EstimateStagesProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): EstimateStages {
    let newState: EstimateStagesProps = Utils.GetInstance().DeepCopy(this.p);
    return EstimateStages.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new EstimateStages(EstimateStagesProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new EstimateStages(data as EstimateStagesProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company Name cannot be blank.');
    if (this.p.SiteRef == 0) vra.add('SiteRef', 'Site Name cannot be blank.');
    if (this.p.StageRef == 0) vra.add('StageRef', 'Stage Name cannot be blank.');
    // if (this.p.Description == '') {
    //   vra.add('Description', 'Description cannot be blank.');
    // } else if (!new RegExp(ValidationPatterns.NameWithNosAndSpace).test(this.p.Description)) {
    //   vra.add('Description', ValidationMessages.NameWithNosAndSpaceMsg + ' for Description');
    // }
    if (this.p.Amount == 0) {
      vra.add('Amount', 'Amount cannot be blank.');
    } else if (this.p.Amount < 0) {
      vra.add('Amount', 'Amount cannot be less then 0.');
    } else if (this.p.Amount.toString().includes('.')) {
      vra.add('Amount', 'Rational Number not allowed for Amount');
    }
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, EstimateStages.Db_Table_Name, this.p);
  }

  private static m_currentInstance: EstimateStages = EstimateStages.CreateNewInstance();

  public static GetCurrentInstance() {
    return EstimateStages.m_currentInstance;
  }

  public static SetCurrentInstance(value: EstimateStages) {
    EstimateStages.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): EstimateStages {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, EstimateStages.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, EstimateStages.Db_Table_Name)!.Entries) {
        return EstimateStages.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
   sortPropertyName: string = ""): EstimateStages[] {
    let result: EstimateStages[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, EstimateStages.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, EstimateStages.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(EstimateStages.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): EstimateStages[] {
    return EstimateStages.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: EstimateStagesFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new EstimateStagesFetchRequest();
    req.EstimateStagesRefs.push(ref);

    let tdResponse = await EstimateStages.FetchTransportData(req, errorHandler) as TransportData;
    return EstimateStages.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: EstimateStagesFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await EstimateStages.FetchTransportData(req, errorHandler) as TransportData;
    return EstimateStages.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new EstimateStagesFetchRequest();
    let tdResponse = await EstimateStages.FetchTransportData(req, errorHandler) as TransportData;
    return EstimateStages.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBySiteRef(SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new EstimateStagesFetchRequest();
    req.SiteRefs.push(SiteRef)
    let tdResponse = await EstimateStages.FetchTransportData(req, errorHandler) as TransportData;
    return EstimateStages.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new EstimateStagesFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await EstimateStages.FetchTransportData(req, errorHandler) as TransportData;
    return EstimateStages.ListFromTransportData(tdResponse);
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
