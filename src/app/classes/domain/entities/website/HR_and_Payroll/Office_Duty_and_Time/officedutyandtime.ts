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
import { OfficeDutyandTimeFetchRequest } from "./officedutyandtimefetchrequest";
import { GetDefaultWorkingHrsFetchRequest } from "./getdefaultworkinghrsfetchrequest";


export class OfficeDutyandTimeProps {
  public readonly Db_Table_Name = "OfficeDutyTime";
  public Ref: number = 0;
  public FromTime: string = '';
  public ToTime: string = '';
  public LateMarkGraceTimeInMins: string = '';
  public ActualLateMarkTime: string = '';
  public OvertimeGraceTimeInMins: string = '1';
  public ActualOvertime: string = '';
  public TotalWorkingHrs: number = 0;
  public ShortName: string = '';
  public CompanyRef: number = 0;
  public readonly CompanyName: string = '';
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new OfficeDutyandTimeProps(true);
  }
}

export class OfficeDutyandTime implements IPersistable<OfficeDutyandTime> {
  public static readonly Db_Table_Name: string = 'OfficeDutyTime';

  private constructor(public readonly p: OfficeDutyandTimeProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): OfficeDutyandTime {
    let newState: OfficeDutyandTimeProps = Utils.GetInstance().DeepCopy(this.p);
    return OfficeDutyandTime.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new OfficeDutyandTime(OfficeDutyandTimeProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new OfficeDutyandTime(data as OfficeDutyandTimeProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.FromTime == '') vra.add('FromTime', 'From Time cannot be blank.');
    if (this.p.ToTime == '') vra.add('ToTime', 'To Time cannot be blank.');
    // if (this.p.LateMarkGraceTimeInMins == '') vra.add('LateMarkGraceTimeInMins', 'Late Mark Grace Time cannot be blank.');
    // if (this.p.OvertimeGraceTimeInMins == '') vra.add('OvertimeGraceTimeInMins', 'Over Time Grace Time cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, OfficeDutyandTime.Db_Table_Name, this.p);
  }

  private static m_currentInstance: OfficeDutyandTime = OfficeDutyandTime.CreateNewInstance();

  public static GetCurrentInstance() {
    return OfficeDutyandTime.m_currentInstance;
  }

  public static SetCurrentInstance(value: OfficeDutyandTime) {
    OfficeDutyandTime.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): OfficeDutyandTime {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, OfficeDutyandTime.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, OfficeDutyandTime.Db_Table_Name)!.Entries) {
        return OfficeDutyandTime.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = ""): OfficeDutyandTime[] {
    let result: OfficeDutyandTime[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, OfficeDutyandTime.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, OfficeDutyandTime.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(OfficeDutyandTime.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): OfficeDutyandTime[] {
    return OfficeDutyandTime.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: OfficeDutyandTimeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new OfficeDutyandTimeFetchRequest();
    req.OfficeDutyandTimeRefs.push(ref);

    let tdResponse = await OfficeDutyandTime.FetchTransportData(req, errorHandler) as TransportData;
    return OfficeDutyandTime.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: OfficeDutyandTimeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await OfficeDutyandTime.FetchTransportData(req, errorHandler) as TransportData;
    return OfficeDutyandTime.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new OfficeDutyandTimeFetchRequest();
    let tdResponse = await OfficeDutyandTime.FetchTransportData(req, errorHandler) as TransportData;
    return OfficeDutyandTime.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new OfficeDutyandTimeFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await OfficeDutyandTime.FetchTransportData(req, errorHandler) as TransportData;
    return OfficeDutyandTime.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByEmployeeRef(EmployeeRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new GetDefaultWorkingHrsFetchRequest();
    req.EmployeeRefs.push(EmployeeRef)
    let tdResponse = await OfficeDutyandTime.FetchTransportData(req, errorHandler) as TransportData;
    return OfficeDutyandTime.ListFromTransportData(tdResponse);
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
