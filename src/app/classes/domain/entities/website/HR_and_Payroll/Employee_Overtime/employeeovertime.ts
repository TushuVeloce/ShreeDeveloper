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
import { EmployeeOvertimeFetchRequest } from "./employeeovertimefetchrequest";


export class EmployeeOvertimeProps {
  public readonly Db_Table_Name = "EmployeeOvertime";
  public Ref: number = 0;
  public Date: string = '';
  public EmployeeRef: number = 0;
  public EmployeeName: string = '';
  public OverTimeInHrs: number = 0;
  public DisplayOverTime: string = '';
  public ToTime: string = '';
  public FromTime: string = '';
  public CompanyRef: number = 0;

  public readonly CompanyName: string = '';
  public CreatedBy: number = 0;
  public CreatedDate: string = '';
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedDate: string = '';
  public UpdatedByName: number = 0;

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new EmployeeOvertimeProps(true);
  }
}

export class EmployeeOvertime implements IPersistable<EmployeeOvertime> {
  public static readonly Db_Table_Name: string = 'EmployeeOvertime';

  private constructor(public readonly p: EmployeeOvertimeProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): EmployeeOvertime {
    let newState: EmployeeOvertimeProps = Utils.GetInstance().DeepCopy(this.p);
    return EmployeeOvertime.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new EmployeeOvertime(EmployeeOvertimeProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new EmployeeOvertime(data as EmployeeOvertimeProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Date == '') vra.add('Date', 'Date cannot be blank.');
    if (this.p.EmployeeRef == 0) vra.add('EmployeeRef', 'Employee not selected.');
    if (this.p.FromTime == '') vra.add('FromTime', 'From Time cannot be blank.');
    if (this.p.ToTime == '') vra.add('ToTime', 'To Time cannot be blank.');

  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, EmployeeOvertime.Db_Table_Name, this.p);
  }

  private static m_currentInstance: EmployeeOvertime = EmployeeOvertime.CreateNewInstance();

  public static GetCurrentInstance() {
    return EmployeeOvertime.m_currentInstance;
  }

  public static SetCurrentInstance(value: EmployeeOvertime) {
    EmployeeOvertime.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): EmployeeOvertime {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, EmployeeOvertime.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, EmployeeOvertime.Db_Table_Name)!.Entries) {
        return EmployeeOvertime.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): EmployeeOvertime[] {
    let result: EmployeeOvertime[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, EmployeeOvertime.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, EmployeeOvertime.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(EmployeeOvertime.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): EmployeeOvertime[] {
    return EmployeeOvertime.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: EmployeeOvertimeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new EmployeeOvertimeFetchRequest();
    req.EmployeeOvertimeRefs.push(ref);

    let tdResponse = await EmployeeOvertime.FetchTransportData(req, errorHandler) as TransportData;
    return EmployeeOvertime.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: EmployeeOvertimeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await EmployeeOvertime.FetchTransportData(req, errorHandler) as TransportData;
    return EmployeeOvertime.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new EmployeeOvertimeFetchRequest();
    let tdResponse = await EmployeeOvertime.FetchTransportData(req, errorHandler) as TransportData;
    return EmployeeOvertime.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new EmployeeOvertimeFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await EmployeeOvertime.FetchTransportData(req, errorHandler) as TransportData;
    return EmployeeOvertime.ListFromTransportData(tdResponse);
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
