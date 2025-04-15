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
import { SalarySlipRequestFetchRequest } from "./salarysliprequestfetchrequest";
import { ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";


export class SalarySlipRequestProps {
  public Ref: number = 0;
  public CreatedBy: number = 0;
  public UpdatedBy: number = 0;
  public CompanyRef: number = 0
  public CompanyName: string = ''
  public EmployeeRef: number = 0;
  public EmployeeName: string = '';
  public FromMonth: string = '';
  public ToMonth: string = '';
  public FromYear: string = '';
  public ToYear: string = '';
  public IsApproved: number = 0;
  public IsDeleted: number = 0;


  public readonly IsNewlyCreated: boolean = false;

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new SalarySlipRequestProps(true);
  }
}

export class SalarySlipRequest implements IPersistable<SalarySlipRequest> {
  public static readonly Db_Table_Name: string = 'SalaryRequest';

  private constructor(public readonly p: SalarySlipRequestProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): SalarySlipRequest {
    let newState: SalarySlipRequestProps = Utils.GetInstance().DeepCopy(this.p);
    return SalarySlipRequest.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new SalarySlipRequest(SalarySlipRequestProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new SalarySlipRequest(data as SalarySlipRequestProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');

    if (this.p.EmployeeRef == 0) {
      vra.add('Name', 'Name cannot be blank.');
    }
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, SalarySlipRequest.Db_Table_Name, this.p);
  }

  private static m_currentInstance: SalarySlipRequest = SalarySlipRequest.CreateNewInstance();

  public static GetCurrentInstance() {
    return SalarySlipRequest.m_currentInstance;
  }

  public static SetCurrentInstance(value: SalarySlipRequest) {
    SalarySlipRequest.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): SalarySlipRequest {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, SalarySlipRequest.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, SalarySlipRequest.Db_Table_Name)!.Entries) {
        return SalarySlipRequest.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): SalarySlipRequest[] {
    let result: SalarySlipRequest[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, SalarySlipRequest.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, SalarySlipRequest.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(SalarySlipRequest.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): SalarySlipRequest[] {
    return SalarySlipRequest.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: SalarySlipRequestFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new SalarySlipRequestFetchRequest();
    req.SalarySlipRequestRefs.push(ref);

    let tdResponse = await SalarySlipRequest.FetchTransportData(req, errorHandler) as TransportData;
    return SalarySlipRequest.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: SalarySlipRequestFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await SalarySlipRequest.FetchTransportData(req, errorHandler) as TransportData;
    return SalarySlipRequest.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new SalarySlipRequestFetchRequest();
    let tdResponse = await SalarySlipRequest.FetchTransportData(req, errorHandler) as TransportData;
    return SalarySlipRequest.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByEmployeeRef(EmployeeRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new SalarySlipRequestFetchRequest();
    req.EmployeeRefs.push(EmployeeRef)
    let tdResponse = await SalarySlipRequest.FetchTransportData(req, errorHandler) as TransportData;
    return SalarySlipRequest.ListFromTransportData(tdResponse);
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
