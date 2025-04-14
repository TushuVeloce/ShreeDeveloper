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
import { LeaveRequestFetchRequest } from "./leaverequestfetchrequest";
import { ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";


export class LeaveRequestProps {
  public readonly Db_Table_Name = "LeaveRequestMaster";
  public Ref: number = 0;
  public CreatedBy: number = 0;
  public UpdatedBy: number = 0;
  public CompanyRef: number = 0
  public CompanyName: string = ''
  public EmployeeRef: number = 0;
  public EmployeeName: string = '';
  public LeaveRequestType: number = 0;
  public FromDate: string = '';
  public ToDate: string = '';
  public Days: number = 0;
  public LeaveHours: number = 0;
  public Description: string = '';
  public IsApproval: boolean = false;
  public IsDeleted: boolean = false;



  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new LeaveRequestProps(true);
  }
}

export class LeaveRequest implements IPersistable<LeaveRequest> {
  public static readonly Db_Table_Name: string = 'LeaveRequest';

  private constructor(public readonly p: LeaveRequestProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): LeaveRequest {
    let newState: LeaveRequestProps = Utils.GetInstance().DeepCopy(this.p);
    return LeaveRequest.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new LeaveRequest(LeaveRequestProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new LeaveRequest(data as LeaveRequestProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');

    if (this.p.EmployeeRef == 0) {
      vra.add('Name', 'Name cannot be blank.');
    }
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, LeaveRequest.Db_Table_Name, this.p);
  }

  private static m_currentInstance: LeaveRequest = LeaveRequest.CreateNewInstance();

  public static GetCurrentInstance() {
    return LeaveRequest.m_currentInstance;
  }

  public static SetCurrentInstance(value: LeaveRequest) {
    LeaveRequest.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): LeaveRequest {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, LeaveRequest.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, LeaveRequest.Db_Table_Name)!.Entries) {
        return LeaveRequest.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): LeaveRequest[] {
    let result: LeaveRequest[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, LeaveRequest.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, LeaveRequest.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(LeaveRequest.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): LeaveRequest[] {
    return LeaveRequest.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: LeaveRequestFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new LeaveRequestFetchRequest();
    req.LeaveRequestRefs.push(ref);

    let tdResponse = await LeaveRequest.FetchTransportData(req, errorHandler) as TransportData;
    return LeaveRequest.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: LeaveRequestFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await LeaveRequest.FetchTransportData(req, errorHandler) as TransportData;
    return LeaveRequest.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new LeaveRequestFetchRequest();
    let tdResponse = await LeaveRequest.FetchTransportData(req, errorHandler) as TransportData;
    return LeaveRequest.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByEmployeeRef(EmployeeRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new LeaveRequestFetchRequest();
    req.EmployeeRefs.push(EmployeeRef)
    let tdResponse = await LeaveRequest.FetchTransportData(req, errorHandler) as TransportData;
    return LeaveRequest.ListFromTransportData(tdResponse);
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
