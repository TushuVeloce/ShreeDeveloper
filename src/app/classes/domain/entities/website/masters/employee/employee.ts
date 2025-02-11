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
import { EmployeeFetchRequest } from "./employeefetchrequest";



export class EmployeeProps {
  public readonly Db_Table_Name = "EmployeeMaster";
  public Ref: number = 0;
  public UserRoleRef: number = 0;
  public FirstName: string = '';
  public LastName: string = '';
  public EmailId: string = '';
  public ContactNo: number = 0;
  public AddressLine1: string = '';
  public AddressLine2: string = '';
  public CityRef: number = 0;
  public GeoNameId: string = '';
  public Gender: string = '';
  public EmpId: string = '';
  public DepartmentRef: string = '';
  public UserStatus: string = '';
  public IsUser: boolean = false;
  

  public readonly IsNewlyCreated: boolean = false;
  public readonly UserRoleName: boolean = false;
  public readonly CityName: boolean = false;
  public readonly DepartmentName: boolean = false;

  private constructor(isNewlyCreated: boolean) {
    this.IsNewlyCreated = isNewlyCreated;
  }

  public static Blank() {
    return new EmployeeProps(true);
  }
}

export class Employee implements IPersistable<Employee> {
  public static readonly Db_Table_Name: string = 'EmployeeMaster';

  private constructor(public readonly p: EmployeeProps, public readonly AllowEdit: boolean) {

  }

  public async EnsurePrimaryKeysWithValidValues(): Promise<void> {
    if (this.p.Ref === undefined || this.p.Ref === 0) {
            const newRefs = await IdProvider.GetInstance().GetNextEntityId();
            // const newRefs = await IdProvider.GetInstance().GetAllocateSingleIds();
      this.p.Ref = newRefs[0];
      if (this.p.Ref <= 0) throw new Error("Cannot assign Id. Please try again");
    }
  }

  public GetEditableVersion(): Employee {
    let newState: EmployeeProps = Utils.GetInstance().DeepCopy(this.p);
    return Employee.CreateInstance(newState, true);
  }

  public static CreateNewInstance() {
    return new Employee(EmployeeProps.Blank(), true);
  }

  public static CreateInstance(data: any, allowEdit: boolean) {
    return new Employee(data as EmployeeProps, allowEdit);
  }

  public CheckSaveValidity(_td: TransportData, vra: ValidationResultAccumulator): void {
    if (!this.AllowEdit) vra.add('', 'This object is not editable and hence cannot be saved.');
    if (this.p.FirstName == '') vra.add('FirstName', 'First Name cannot be blank.');
  }

  public MergeIntoTransportData(td: TransportData) {
    DataContainerService.GetInstance().MergeIntoContainer(td.MainData, Employee.Db_Table_Name, this.p);
  }

  private static m_currentInstance: Employee = Employee.CreateNewInstance();

  public static GetCurrentInstance() {
    return Employee.m_currentInstance;
  }

  public static SetCurrentInstance(value: Employee) {
    Employee.m_currentInstance = value;
  }


  // ********************************************
  public static cacheDataChangeLevel: number = -1;

  public static SingleInstanceFromTransportData(td: TransportData): Employee {
    let dcs = DataContainerService.GetInstance();
    if (dcs.CollectionExists(td.MainData, Employee.Db_Table_Name)) {
      for (let data of dcs.GetCollection(td.MainData, Employee.Db_Table_Name)!.Entries) {
        return Employee.CreateInstance(data, false);
      }
    }

    return null as any;
  }

  public static ListFromDataContainer(cont: DataContainer,
    filterPredicate: (arg0: any) => boolean = null as any,
    sortPropertyName: string = "Name"): Employee[] {
    let result: Employee[] = [];

    let dcs = DataContainerService.GetInstance();

    if (dcs.CollectionExists(cont, Employee.Db_Table_Name)) {
      let coll = dcs.GetCollection(cont, Employee.Db_Table_Name)!;
      let entries = coll.Entries;

      if (!isNullOrUndefined(filterPredicate)) entries = entries.filter(filterPredicate);

      if (sortPropertyName.trim().length > 0) {
        entries = Utils.OrderByPropertyName(entries, sortPropertyName);
      }

      for (let data of entries) {
        result.push(Employee.CreateInstance(data, false));
      }
    }

    return result;
  }

  public static ListFromTransportData(td: TransportData): Employee[] {
    return Employee.ListFromDataContainer(td.MainData);
  }

  public static async FetchTransportData(req: EmployeeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
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
    let req = new EmployeeFetchRequest();
    req.EmployeeRef.push(ref);

    let tdResponse = await Employee.FetchTransportData(req, errorHandler) as TransportData;
    return Employee.SingleInstanceFromTransportData(tdResponse);
  }

  public static async FetchList(req: EmployeeFetchRequest, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let tdResponse = await Employee.FetchTransportData(req, errorHandler) as TransportData;
    return Employee.ListFromTransportData(tdResponse);
  }

  public static async FetchEntireList(errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new EmployeeFetchRequest();
    let tdResponse = await Employee.FetchTransportData(req, errorHandler) as TransportData;
    return Employee.ListFromTransportData(tdResponse);
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
