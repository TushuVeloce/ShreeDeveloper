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
import { EmployeeExitFetchRequest } from "./employeeexitfetchrequest";


export class EmployeeExitProps {
  public readonly Db_Table_Name = "EmployeeExitMaster";
  public Ref: number = 0;
  public Name: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  public EmployeeRef: number = 0;
  public EmployeeName: string = '';
  public Description : string = '';
  public DateOfJoin: string = '';
  public DateOfExit: string = '';
  public Reason: string = '';
  
  

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new EmployeeExitProps(true);
  }
}

export class EmployeeExit implements IPersistable<EmployeeExit> {
  public static readonly Db_Table_Name: string = 'EmployeeExitMaster';

  private constructor(public readonly p: EmployeeExitProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): EmployeeExit {
    let newState: EmployeeExitProps = Utils.GetInstance().DeepCopy(this.p);
    return EmployeeExit.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new EmployeeExit(EmployeeExitProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new EmployeeExit(data as EmployeeExitProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company Name cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, EmployeeExit.Db_Table_Name, this.p);
  }

  private static m_currentInstance: EmployeeExit = EmployeeExit.CreateNewInstance();

  public static GetCurrentInstance() {
    return EmployeeExit.m_currentInstance;
  }

  public static SetCurrentInstance(value: EmployeeExit) {
    EmployeeExit.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): EmployeeExit {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, EmployeeExit.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, EmployeeExit.Db_Table_Name)!.Entries) {
        return EmployeeExit.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): EmployeeExit[] {
    let result: EmployeeExit[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, EmployeeExit.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, EmployeeExit.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(EmployeeExit.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): EmployeeExit[] {
    return EmployeeExit.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: EmployeeExitFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new EmployeeExitFetchRequest();
    req.EmployeeExitRefs.push(ref);

    let tdResponse = await EmployeeExit.FetchTransportData(req, errorHandler) as TransportData;
    return EmployeeExit.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: EmployeeExitFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await EmployeeExit.FetchTransportData(req, errorHandler) as TransportData;
    return EmployeeExit.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new EmployeeExitFetchRequest();
    let tdResponse = await EmployeeExit.FetchTransportData(req, errorHandler) as TransportData;
    return EmployeeExit.ListFromTransportData(tdResponse);
  }
  
  public static async FetchEntireListByCompanyRef(CompanyRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new EmployeeExitFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await EmployeeExit.FetchTransportData(req, errorHandler) as TransportData;
    return EmployeeExit.ListFromTransportData(tdResponse);
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
