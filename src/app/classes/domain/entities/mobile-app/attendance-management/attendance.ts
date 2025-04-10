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
import { AttendanceFetchRequest } from "./attendancefetchrequest";


export class AttendanceProps {
  public readonly Db_Table_Name = "AttendanceMaster";
  public Ref: number = 0;
  public Code: string = '';
  public Name: string = '';
  public UnitRef: number = 0;
  public readonly UnitName: string = '';
  public CompanyRef: number = 0;
  public CompanyName: string = '';

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new AttendanceProps(true);
  }
}

export class Attendance implements IPersistable<Attendance> {
  public static readonly Db_Table_Name: string = 'AttendanceMaster';

  private constructor(public readonly p: AttendanceProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Attendance {
    let newState: AttendanceProps = Utils.GetInstance().DeepCopy(this.p);
    return Attendance.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Attendance(AttendanceProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Attendance(data as AttendanceProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
    if (this.p.Code == '') vra.add('Code', 'Code cannot be blank.');
    if (this.p.UnitRef == 0) vra.add('UnitRef', 'Unit cannot be blank.');
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Attendance.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Attendance = Attendance.CreateNewInstance();

  public static GetCurrentInstance() {
    return Attendance.m_currentInstance;
  }

  public static SetCurrentInstance(value: Attendance) {
    Attendance.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Attendance {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Attendance.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Attendance.Db_Table_Name)!.Entries) {
        return Attendance.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): Attendance[] {
    let result: Attendance[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Attendance.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Attendance.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Attendance.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Attendance[] {
    return Attendance.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: AttendanceFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new AttendanceFetchRequest();
    req.MaterialRefs.push(ref);

    let tdResponse = await Attendance.FetchTransportData(req, errorHandler) as TransportData;
    return Attendance.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: AttendanceFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Attendance.FetchTransportData(req, errorHandler) as TransportData;
    return Attendance.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new AttendanceFetchRequest();
    let tdResponse = await Attendance.FetchTransportData(req, errorHandler) as TransportData;
    return Attendance.ListFromTransportData(tdResponse);
  }

 public static async FetchEntireListByCompanyRef(CompanyRef:number,errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new AttendanceFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await Attendance.FetchTransportData(req, errorHandler) as TransportData;
    return Attendance.ListFromTransportData(tdResponse);
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
