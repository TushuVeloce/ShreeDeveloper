import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { OfficeDutyandTime } from 'src/app/classes/domain/entities/website/HR_and_Payroll/Office_Duty_and_Time/officedutyandtime';
import { City } from 'src/app/classes/domain/entities/website/masters/city/city';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { Department } from 'src/app/classes/domain/entities/website/masters/department/department';
import { Designation } from 'src/app/classes/domain/entities/website/masters/designation/designation';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { State } from 'src/app/classes/domain/entities/website/masters/state/state';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-employee-master-details',
  standalone: false,
  templateUrl: './employee-master-details.component.html',
  styleUrls: ['./employee-master-details.component.scss'],
})
export class EmployeeMasterDetailsComponent implements OnInit {
  Entity: Employee = Employee.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Employee' | 'Edit Employee' = 'New Employee';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Employee = null as any;
  CountryList: Country[] = [];
  StateList: State[] = [];
  CityList: City[] = [];
  DesignationList: Designation[] = [];
  DepartmentList: Department[] = [];
  OfficeDutyTimeList: OfficeDutyandTime[] = []
  GenderList = DomainEnums.GenderTypeList(true, '---Select Gender---');
  MaritalStatusList = DomainEnums.MaritalStatusesList(true, '---Select Marital Status ---');
  MarketingModesList = DomainEnums.MarketingModesList();
  companyName = this.companystatemanagement.SelectedCompanyName;
  dateofjoining: string | null = null;
  dob: string | null = null;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  NameWithoutNos: string = ValidationPatterns.NameWithoutNos
  PinCodePattern: string = ValidationPatterns.PinCode;
  IFSCPattern: string = ValidationPatterns.IFSC;
  PANPattern: string = ValidationPatterns.PAN;
  GSTINPattern: string = ValidationPatterns.GSTIN;
  LargeInputNumber: string = ValidationPatterns.LargeInputNumber;
  INDPhoneNo: string = ValidationPatterns.INDPhoneNo;  
  Email: string = ValidationPatterns.Email
  
  NameWithoutNosMsg: string = ValidationMessages.NameWithoutNosMsg
  LargeInputNumberMsg: string = ValidationMessages.LargeInputNumberMsg;
  PinCodeMsg: string = ValidationMessages.PinCodeMsg;
  IFSCMsg: string = ValidationMessages.IFSCMsg;
  GSTINMsg: string = ValidationMessages.GSTINMsg;
  PANMsg: string = ValidationMessages.PANMsg;
  EmailMsg: string = ValidationMessages.EmailMsg
  INDPhoneNoMsg: string = ValidationMessages.INDPhoneNoMsg;
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  @ViewChild('employeeForm') employeeForm!: NgForm;
  @ViewChild('NameCtrl') NameInputControl!: NgModel;
  @ViewChild('DOBCtrl') DOBInputControl!: NgModel;
  @ViewChild('ContactNoCtrl') ContactNoInputControl!: NgModel;
  @ViewChild('PersonalEmailIdCtrl') PersonalEmailIdInputControl!: NgModel;
  @ViewChild('OfficialEmailIdCtrl') OfficialEmailIdInputControl!: NgModel;
  @ViewChild('AddressLine1Ctrl') AddressLine1InputControl!: NgModel;
  @ViewChild('EmergencyContactNameCtrl') EmergencyContactNameInputControl!: NgModel;
  @ViewChild('EmergencyContactNoCtrl') EmergencyContactNoInputControl!: NgModel;
  @ViewChild('DateOfJoiningCtrl') DateOfJoiningInputControl!: NgModel;
  @ViewChild('SalaryPerMonthCtrl') SalaryPerMonthInputControl!: NgModel;
  @ViewChild('SalaryPerYearCtrl') SalaryPerYearInputControl!: NgModel;
  @ViewChild('BankNameCtrl') BankNameInputControl!: NgModel;
  @ViewChild('BranchNameCtrl') BranchNameInputControl!: NgModel;
  @ViewChild('AccountNumberCtrl') AccountNumberInputControl!: NgModel;
  @ViewChild('IFSCCtrl') IFSCInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils, private companystatemanagement: CompanyStateManagement
    , private dtu: DTU,
    private datePipe: DatePipe) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.getDepartmentListByCompanyRef()
    this.getOfficeDutyTime();
    await this.FormulateCountryList();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Employee'
        : 'Edit Employee';
      this.Entity = Employee.GetCurrentInstance();


      // While Edit Converting date String into Date Format //
      this.dateofjoining = this.datePipe.transform(
        this.dtu.FromString(this.Entity.p.DateOfJoining),
        'yyyy-MM-dd'
      );

      // While Edit Converting date String into Date Format //
      this.dob = this.datePipe.transform(
        this.dtu.FromString(this.Entity.p.DOB),
        'yyyy-MM-dd'
      );
      this.getDesignationListByDepartmentRef();
      this.appStateManage.StorageKey.removeItem('Editable');
      if (this.Entity.p.CountryRef) {
        this.getStateListByCountryRef(this.Entity.p.CountryRef);
      }
      if (this.Entity.p.StateRef) {
        this.getCityListByStateRef(this.Entity.p.StateRef);
      }
    } else {
      this.Entity = Employee.CreateNewInstance();
      Employee.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      Employee.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as Employee;
    // this.focusInput();
  }

  getDepartmentListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Department.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DepartmentList = lst;
  }

  getDesignationListByDepartmentRef = async () => {
    if (this.Entity.p.DepartmentRef <= 0) {
      await this.uiUtils.showErrorToster('Department not Selected');
      return;
    }
    let lst = await Designation.FetchEntireListByDepartmentRef(this.Entity.p.DepartmentRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DesignationList = lst;
    // if (lst.length > 0 && this.Entity.p.DesignationRef != lst[0].p.Ref) {
    //   this.Entity.p.DesignationRef = lst[0].p.Ref;
    // }
  }


  FormulateCountryList = async () => {
    this.CountryList = await Country.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    // Set default country if exists
    if (this.CountryList.length) {
      const defaultCountry = this.CountryList.find(c => c.p.Ref === this.Entity.p.CountryRef);
      this.Entity.p.CountryRef = defaultCountry ? defaultCountry.p.Ref : this.CountryList[0].p.Ref;

      // Fetch the corresponding states
      await this.getStateListByCountryRef(this.Entity.p.CountryRef);
    }
  }

  getStateListByCountryRef = async (CountryRef: number) => {
    this.StateList = await State.FetchEntireListByCountryRef(
      CountryRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    // Set default state if exists
    if (this.StateList.length) {
      const defaultState = this.StateList.find(s => s.p.Ref === this.Entity.p.StateRef);
      this.Entity.p.StateRef = defaultState ? defaultState.p.Ref : this.StateList[0].p.Ref;

      // Fetch the corresponding cities
      await this.getCityListByStateRef(this.Entity.p.StateRef);
    }
  }

  getCityListByStateRef = async (StateRef: number) => {
    this.CityList = await City.FetchEntireListByStateRef(
      StateRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );

    // Set default city if exists
    if (this.CityList.length) {
      const defaultCity = this.CityList.find(c => c.p.Ref === this.Entity.p.CityRef);
      this.Entity.p.CityRef = defaultCity ? defaultCity.p.Ref : this.CityList[0].p.Ref;
    }
  }


  getOfficeDutyTime = async () => {
    let lst = await OfficeDutyandTime.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.OfficeDutyTimeList = lst;

  }

  SaveEmployeeMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.Entity.GetEditableVersion();
    // ------ Code For Save Date Of Joining Format ---------------//
    if (this.dateofjoining) {
      let dateValue = new Date(this.dateofjoining);

      if (!isNaN(dateValue.getTime())) {
        entityToSave.p.DateOfJoining =
          this.dtu.DateStartStringFromDateValue(dateValue);
      } else {
        entityToSave.p.DateOfJoining = '';
      }
    }
    // ------ Code For Save DDate Of Birth Format ---------------//
    if (this.dob) {
      let dateValue = new Date(this.dob);

      if (!isNaN(dateValue.getTime())) {
        entityToSave.p.DOB =
          this.dtu.DateStartStringFromDateValue(dateValue);
      } else {
        entityToSave.p.DOB = '';
      }
    }
    let entitiesToSave = [entityToSave];
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Employee saved successfully!');
        this.dob = '';
        this.Entity = Employee.CreateNewInstance();
        this.resetAllControls()
      } else {
        await this.uiUtils.showSuccessToster('Employee Updated successfully!');
        this.router.navigate(['/homepage/Website/Employee_Master']);
      }
    }
  };
  
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackEmployee = () => {
    this.router.navigate(['/homepage/Website/Employee_Master']);
  }

  // resetAllControls = () => {
  //   // reset touched
  //   this.NameInputControl.control.markAsUntouched();
  //   this.DOBInputControl.control.markAsUntouched();
  //   this.AddressLine1InputControl.control.markAsUntouched();
  //   this.ContactNoInputControl.control.markAsUntouched();
  //   this.PersonalEmailIdInputControl.control.markAsUntouched();
  //   this.OfficialEmailIdInputControl.control.markAsUntouched();
  //   this.EmergencyContactNameInputControl.control.markAsUntouched();
  //   this.EmergencyContactNoInputControl.control.markAsUntouched();
  //   this.DateOfJoiningInputControl.control.markAsUntouched();
  //   this.SalaryPerMonthInputControl.control.markAsUntouched();
  //   this.SalaryPerYearInputControl.control.markAsUntouched();
  //   this.BankNameInputControl.control.markAsUntouched();
  //   this.BranchNameInputControl.control.markAsUntouched();
  //   this.AccountNumberInputControl.control.markAsUntouched();
  //   this.IFSCInputControl.control.markAsUntouched();

  //   // reset dirty
  //   this.NameInputControl.control.markAsPristine();
  //   this.DOBInputControl.control.markAsPristine();
  //   this.AddressLine1InputControl.control.markAsPristine();
  //   this.ContactNoInputControl.control.markAsPristine();
  //   this.PersonalEmailIdInputControl.control.markAsPristine();
  //   this.OfficialEmailIdInputControl.control.markAsPristine();
  //   this.EmergencyContactNameInputControl.control.markAsPristine();
  //   this.EmergencyContactNoInputControl.control.markAsPristine();
  //   this.DateOfJoiningInputControl.control.markAsPristine();
  //   this.SalaryPerMonthInputControl.control.markAsPristine();
  //   this.SalaryPerYearInputControl.control.markAsPristine();
  //   this.BankNameInputControl.control.markAsPristine();
  //   this.BranchNameInputControl.control.markAsPristine();
  //   this.AccountNumberInputControl.control.markAsPristine();
  //   this.IFSCInputControl.control.markAsPristine();
  // }

   resetAllControls() {
  this.employeeForm.resetForm(); // this will reset all form controls to their initial state
}
}
