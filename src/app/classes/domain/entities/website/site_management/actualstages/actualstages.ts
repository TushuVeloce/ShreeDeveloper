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
import { ActualStagesFetchRequest } from "./actualstagesfetchrequest";


export class ActualStagesProps {
  public readonly Db_Table_Name = "ActualStage";
  public Ref: number = 0;
  public SiteRef: number = 0;
  public readonly SiteName: string = '';
  public TransDateTime: string = '';
  public Amount: number = 0;
  public Description: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public VendorRef: number = 0;
  public VendorName: string = '';
  public VendorServicesRef: number = 0;
  public VendorServicesName: string = '';
  public StageRef: number = 0;
  public StageName: string = '';
  public SubStageRef: number = 0;
  public SubStageName: string = '';
  public UnitRef: number = 0;
  public UnitName: string = '';
  public Quantity: number = 0;
  public Rate: number = 0;
  public ExtraQuantity: number = 0;
  public CreatedBy: number = 0;
  public CreatedDate: string = '';
  public UpdatedBy: number = 0;
  public UpdatedDate: string = '';
  public DieselLtr: number = 0;
  public AmountPerLtr: number = 0;
  public TotalAmount: number = 0;
  public StartDate: string = '';
  public ChalanNo: string = '';

  public readonly IsNewlyCreated: boolean = false;

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new ActualStagesProps(true);
  }
}

export class ActualStages implements IPersistable<ActualStages> {
  public static readonly Db_Table_Name: string = 'ActualStage';

  private constructor(public readonly p: ActualStagesProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): ActualStages {
    let newState: ActualStagesProps = Utils.GetInstance().DeepCopy(this.p);
    return ActualStages.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new ActualStages(ActualStagesProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new ActualStages(data as ActualStagesProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company Name cannot be blank.');
    if (this.p.Description == '') {
      vra.add('Description', 'Description cannot be blank.');
    } else if (!new RegExp(ValidationPatterns.NameWithNosAndSpace).test(this.p.Description)) {
      vra.add('Description', ValidationMessages.NameWithNosAndSpaceMsg + ' for Description');
    }
    if (this.p.Amount == 0) {
      vra.add('Amount', 'Amount cannot be blank.');
    } else if (this.p.Amount < 0) {
      vra.add('Amount', 'Amount cannot be less then 0.');
    } else if (this.p.Amount.toString().includes('.')) {
      vra.add('Amount', 'Rational Number not allowed for Amount');
    }
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, ActualStages.Db_Table_Name, this.p);
  }

  private static m_currentInstance: ActualStages = ActualStages.CreateNewInstance();

  public static GetCurrentInstance() {
    return ActualStages.m_currentInstance;
  }

  public static SetCurrentInstance(value: ActualStages) {
    ActualStages.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): ActualStages {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, ActualStages.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, ActualStages.Db_Table_Name)!.Entries) {
        return ActualStages.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): ActualStages[] {
    let result: ActualStages[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, ActualStages.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, ActualStages.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(ActualStages.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): ActualStages[] {
    return ActualStages.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: ActualStagesFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new ActualStagesFetchRequest();
    req.ActualStagesRefs.push(ref);

    let tdResponse = await ActualStages.FetchTransportData(req, errorHandler) as TransportData;
    return ActualStages.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: ActualStagesFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await ActualStages.FetchTransportData(req, errorHandler) as TransportData;
    return ActualStages.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ActualStagesFetchRequest();
    let tdResponse = await ActualStages.FetchTransportData(req, errorHandler) as TransportData;
    return ActualStages.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListBySiteRef(SiteRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new ActualStagesFetchRequest();
    req.SiteRefs.push(SiteRef)
    let tdResponse = await ActualStages.FetchTransportData(req, errorHandler) as TransportData;
    return ActualStages.ListFromTransportData(tdResponse);
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
