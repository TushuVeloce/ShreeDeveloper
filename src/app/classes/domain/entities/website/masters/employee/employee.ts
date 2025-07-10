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
import { CountryStateCityRefs, ValidationMessages, ValidationPatterns } from "src/app/classes/domain/constants";



export class EmployeeProps {
  public readonly Db_Table_Name = "EmployeeMaster";
  public CreatedBy: number = 0;
  public CreatedByName: string = '';
  public UpdatedBy: number = 0;
  public UpdatedByName: number = 0;
  public Ref: number = 0;
  public DesignationRef: number = 0;
  public readonly DesignationName: string = '';
  public Name: string = '';
  public DOB: string = '';
  // public FirstName: string = '';
  // public LastName: string = '';
  public ContactNos: string = '';
  public PersonalEmailId: string = '';
  public OfficialEmailId: string = '';
  public AddressLine1: string = '';
  public AddressLine2: string = '';
  public CountryRef: number = CountryStateCityRefs.IndiaRef;
  public readonly CountryName: string = '';
  public StateRef: number = CountryStateCityRefs.MaharashtraRef;
  public readonly StateName: string = '';
  public CityRef: number = CountryStateCityRefs.KolhapurRef;
  public readonly CityName: string = '';
  public EmergencyContactName: string = '';
  public EmergencyContactNo: string = '';
  public MaritalStatus: number = 0;
  public DateOfJoining: string = '';
  public SalaryPerMonth: Number = 0;
  public SalaryPerYear: Number = 0;
  public BankName: string = '';
  public BranchName: string = '';
  public IFSC: string = '';
  public TotalWorkingHrs: number = 0;
  public BanckAccountNo: string = '';
  // public LoginStatus: string = '';
  public Gender: number = 0;
  // public EmpId: string = '';
  public DepartmentRef: number = 0;
  public OfficeDutyTimeRef: number = 0;
  public readonly DepartmentName: boolean = false;
  // public UserStatus: string = '';
  // public IsUser: boolean = false;
  public CompanyRef: number = 0;
  public CompanyName: string = '';
  // public ProfilePicFile: File = null as any
  public ProfilePicPath: string = "";

  public readonly IsNewlyCreated: boolean = false;

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
    if (this.p.CompanyRef == 0) vra.add('CompanyRef', 'Company Name cannot be blank.');
    if (this.p.Name == '') {
      vra.add('Name', 'Name cannot be blank.');
    } else if (!new RegExp(ValidationPatterns.NameWithNosAndSpace).test(this.p.Name)) {
      vra.add('Name', ValidationMessages.NameWithNosAndSpaceMsg + ' for Name');
    }
    if (this.p.DOB == '') vra.add('DOB', ' Date of Birth cannot be blank.');
    if (this.p.Gender == 0) vra.add('Gender', ' Gender cannot be blank.');
    if (this.p.ContactNos == '') {
      vra.add('Contact No', 'Contact No cannot be blank.');
    } else if (!new RegExp(ValidationPatterns.INDPhoneNo).test(this.p.ContactNos)) {
      vra.add('Contact No', ValidationMessages.INDPhoneNoMsg + ' for Contact No');
    }
    // if (this.p.PersonalEmailId == '') {
    //   vra.add('Personal Email Id', 'Personal Email Id cannot be blank.');
    // } else
    if (!new RegExp(ValidationPatterns.Email).test(this.p.PersonalEmailId) && this.p.PersonalEmailId != '') {
      vra.add('Personal Email Id', ValidationMessages.EmailMsg + ' for Personal Email Id.');
    }
    if (this.p.OfficialEmailId == '') {
      vra.add('Office Email Id', 'Office Email Id cannot be blank.');
    } else if (!new RegExp(ValidationPatterns.Email).test(this.p.OfficialEmailId)) {
      vra.add('Office Email Id', ValidationMessages.EmailMsg + ' for Office Email Id.');
    }
    if (this.p.AddressLine1 == '') vra.add('AddressLine1', ' Address Line 1 cannot be blank.');
    // if (this.p.AddressLine2 == '') vra.add('AddressLine2', ' AddressLine2 cannot be blank.');
    if (this.p.CountryRef == 0) vra.add('CountryRef', ' Country cannot be blank.');
    if (this.p.StateRef == 0) vra.add('StateRef', '   State cannot be blank.');
    if (this.p.CityRef == 0) vra.add('CityRef', ' City cannot be blank.');
    // if (this.p.EmergencyContactName == '') {
    //   vra.add('Emergency Contact Name', 'Emergency Contact Name cannot be blank.');
    // } else
    if (!new RegExp(ValidationPatterns.NameWithoutNos).test(this.p.EmergencyContactName) && this.p.EmergencyContactName != '') {
      vra.add('Emergency Contact Name', ValidationMessages.NameWithoutNosMsg + ' for Emergency Contact Name.');
    }
    // if (this.p.EmergencyContactNo == '') {
    //   vra.add('Emergency Contact No', 'Emergency Contact No cannot be blank.');
    // } else
    if (!new RegExp(ValidationPatterns.INDPhoneNo).test(this.p.EmergencyContactNo) && this.p.EmergencyContactNo != '') {
      vra.add('Emergency Contact No', ValidationMessages.INDPhoneNoMsg + ' for Emergency Contact No.');
    }
     if (this.p.MaritalStatus == 0) vra.add('MaritalStatus', 'Marital Status cannot be blank.');
    if (this.p.DepartmentRef == 0) vra.add('DepartmentRef', 'Department cannot be blank.');
    if (this.p.DesignationRef == 0) vra.add('DesignationRef', 'Designation cannot be blank.');
    if (this.p.OfficeDutyTimeRef == 0) vra.add('OfficeDutyTimeRef', 'Office Duty Time cannot be blank.');
    // if (this.p.DateOfJoining == '') vra.add('DateOfJoining', ' Date Of Joining cannot be blank.');
    if (this.p.SalaryPerMonth == 0) vra.add('SalaryPerMonth', ' Salary Per Month cannot be blank.');
    // if (this.p.SalaryPerYear == 0) vra.add('SalaryPerYear', ' Salary Per Year cannot be blank.');
    // if (this.p.BankName == '') {
    //   vra.add('Bank Name', 'Bank Name cannot be blank.');
    // } else
    if (!new RegExp(ValidationPatterns.NameWithoutNos).test(this.p.BankName) && this.p.BankName != '') {
      vra.add('Bank Name', ValidationMessages.NameWithoutNosMsg + ' for Bank Name.');
    }
    // if (this.p.BranchName == '') {
    //   vra.add('Branch Name', 'Branch Name cannot be blank.');
    // } else
    if (!new RegExp(ValidationPatterns.NameWithoutNos).test(this.p.BranchName) && this.p.BranchName != '') {
      vra.add('Branch Name', ValidationMessages.NameWithoutNosMsg + ' for Branch Name.');
    }
    // if (this.p.IFSC == '') {
    //   vra.add('IFSC', 'IFSC cannot be blank.');
    // } else
    if (!new RegExp(ValidationPatterns.IFSC).test(this.p.IFSC) && this.p.IFSC != '') {
      vra.add('IFSC', ValidationMessages.IFSCMsg);
    }
    // if (this.p.BanckAccountNo == '') {
    //   vra.add('Banck Account No', 'Banck Account No cannot be blank.');
    // } else
    if (!new RegExp(ValidationPatterns.LargeInputNumber).test(this.p.BanckAccountNo) && this.p.BanckAccountNo != '') {
      vra.add('Banck Account No', ValidationMessages.LargeInputNumberMsg);
    }

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
    sortPropertyName: string = ""): Employee[] {
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

  public static async FetchInstance(ref: number, CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new EmployeeFetchRequest();
    req.EmployeeRefs.push(ref);
    req.CompanyRefs.push(CompanyRef);

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

  public static async FetchEntireListByCompanyRef(CompanyRef: number, errorHandler: (err: string) => Promise<void> = UIUtils.GetInstance().GlobalUIErrorHandler) {
    let req = new EmployeeFetchRequest();
    req.CompanyRefs.push(CompanyRef)
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
