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
import { DesignationFetchRequest } from "./designationfetchrequest";


export class DesignationProps {
  public readonly Db_Table_Name = "DesignationMaster";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public Name: string = '';
  public DepartmentRef: number = 0;
  public readonly DepartmentName: string = '';
  public SeniorityLevel: number = 0;
  public CompanyRef: number = 0;
  public CompanyName: string = '';

  public readonly IsNewlyCreated: boolean = false;
  // public readonly AccountTypeName: string = '';

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new DesignationProps(true);
  }
}

export class Designation implements IPersistable<Designation> {
  public static readonly Db_Table_Name: string = 'DesignationMaster';

  private constructor(public readonly p: DesignationProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
      const newRefs = await IdProvider.GetInstance().GetNextEntityId();
      // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Designation {
    let newState: DesignationProps = Utils.GetInstance().DeepCopy(this.p);
    return Designation.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Designation(DesignationProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Designation(data as DesignationProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.Name == '') vra.add('Name', 'Name cannot be blank.');
    if (this.p.DepartmentRef == 0) vra.add('DepartmentRef', 'Department cannot be blank.');
    // if (this.p.SeniorityLevel == 0) {
    //   vra.add('SeniorityLevel', 'Seniority Level cannot be blank.');
    // } else if (this.p.SeniorityLevel < 0) {
    //   vra.add('SeniorityLevel', 'Seniority Level cannot be less then 0.');
    // } else if (this.p.SeniorityLevel.toString().includes('.')) {
    //   vra.add('SeniorityLevel', 'Rational Number not allowed for Seniority Level');
    // }
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Designation.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Designation = Designation.CreateNewInstance();

  public static GetCurrentInstance() {
    return Designation.m_currentInstance;
  }

  public static SetCurrentInstance(value: Designation) {
    Designation.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Designation {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Designation.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Designation.Db_Table_Name)!.Entries) {
        return Designation.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
   sortPropertyName: string = ""): Designation[] {
    let result: Designation[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Designation.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Designation.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Designation.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Designation[] {
    return Designation.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: DesignationFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new DesignationFetchRequest();
    req.DesignationRefs.push(ref);

    let tdResponse = await Designation.FetchTransportData(req, errorHandler) as TransportData;
    return Designation.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: DesignationFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Designation.FetchTransportData(req, errorHandler) as TransportData;
    return Designation.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new DesignationFetchRequest();
    let tdResponse = await Designation.FetchTransportData(req, errorHandler) as TransportData;
    return Designation.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new DesignationFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    let tdResponse = await Designation.FetchTransportData(req, errorHandler) as TransportData;
    return Designation.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByDepartmentRef(DepartmentRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new DesignationFetchRequest();
    req.DepartmentRefs.push(DepartmentRef)
    let tdResponse = await Designation.FetchTransportData(req, errorHandler) as TransportData;
    return Designation.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireListByCompanyAndDepartmentRef(CompanyRef: number, departmentref: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new DesignationFetchRequest();
    req.CompanyRefs.push(CompanyRef)
    req.DepartmentRefs.push(departmentref)
    let tdResponse = await Designation.FetchTransportData(req, errorHandler) as TransportData;
    return Designation.ListFromTransportData(tdResponse);
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
