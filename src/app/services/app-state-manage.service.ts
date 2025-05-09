import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateManageService {
  private CurrentCompanyRef = 0;
  private CurrentCompanyName = '';
  private CompanyRef = 0;

  private EmployeeRef = 0
  private LoginToken = '';

  private CurrentGAAProjectRefForProductVersion = 0;
  private CurrentGAAProjectNameForProductVersion = '';

  private CurrentGAAProjectRefForProductInputChannel = 0;
  private CurrentGAAProjectNameForProductInputChannel = '';

  private CurrentGAAProjectRefForProductOutputChannel = 0;
  private CurrentGAAProjectNameForProductOutputChannel = '';

  private CustomerName = '';
  private CustomerRef = 0;

  private DepartmentName = 0;
  private DepartmentRef = 0;
  private DesignationRef = 0;

  // private GAAProjectName = '';
  private projectCount = 0
  private Theme = '';
  public readonly StorageKey = sessionStorage
  public readonly localStorage = localStorage

  public devUserId: string = 'deployment@gladiance.com'
  public devPassword: string = 'maths@4321'
  private IsForgetPasswordClickedValue = false
  public isDropdownDisabled = signal<boolean>(false);

  private _BaseImageUrl: string = "http://localhost:5100/api/Request/uploadeddocumentpath/";

  public get BaseImageUrl(): string {
    return this._BaseImageUrl;
  }

  constructor() { }

  setDropdownDisabled(value: boolean) {
    this.isDropdownDisabled.set(value);
  }

  // EmployeeRef  start
  getEmployeeRef(): number {
    const EmployeeRef = this.localStorage.getItem('EmployeeRef');
    return EmployeeRef ? +EmployeeRef : 0 // Return the Employee reference or 0 if not found
  }
  setEmployeeRef(val: number): void {
    this.EmployeeRef = val;
    this.localStorage.setItem('EmployeeRef', val.toString()); // Store Employee reference in local storage
  }
  resetEmployeeRef(): void {
    this.localStorage.setItem('EmployeeRef', '0');
  }

  setSiteRef(value: number, Name: string) {
    this.StorageKey.setItem('siteRf', value.toString())
    this.StorageKey.setItem('siteName', Name)
  }

  resetSiteRef(): void {
    this.StorageKey.setItem('siteRf', '0');
    this.StorageKey.setItem('siteName', '');
  }

  // CompanyRef  start

  getCompanyRef(): number {
    const CompanyRef = this.localStorage.getItem('CompanyRef');
    return CompanyRef ? +CompanyRef : 0 // Return the Company reference or 0 if not found
  }
  setCompanyRef(val: number): void {
    this.CompanyRef = val;
    this.localStorage.setItem('CompanyRef', val.toString()); // Store Company reference in local storage
  }
  resetCompanyRef(): void {
    this.localStorage.setItem('CompanyRef', '0');
  }



  // ----------- Customer Name Start
  getCustomerName(): string {
    const custName = this.StorageKey.getItem('CustomerName');
    return custName ? custName : ''; // Return the project reference or 0 if not found
  }

  setCustomerName(val: string): void {
    this.CustomerName = val;
    this.StorageKey.setItem('CustomerName', val); // Store project reference in local storage
  }

  resetCustomerName(): void {
    this.StorageKey.setItem('CustomerName', '');
  }
  //---------- Customer Name End

  // ----------- Theme Start
  getTheme(): string {
    const theme = this.StorageKey.getItem('Theme');
    return theme ? theme : 'dark';
  }

  setTheme(val: string): void {
    this.Theme = val;
    this.StorageKey.setItem('Theme', val);
  }

  resetTheme(): void {
    this.StorageKey.setItem('Theme', '');
  }
  //---------- Theme End--------------

  // ValidMenuItemIds
  getValidMenuItemIds = () => {
    const strMenuItemIds = this.StorageKey.getItem('ValidMenuItemIds');
    return strMenuItemIds ? JSON.parse(strMenuItemIds) as string[] : [];
  }

  setValidMenuItemIds = (value: string[]) => {
    this.StorageKey.setItem('ValidMenuItemIds', JSON.stringify(value));
  }

  clearValidMenuItemIds = () => {
    this.StorageKey.removeItem('ValidMenuItemIds');
    this.StorageKey.removeItem('siteRf');
    this.StorageKey.removeItem('siteName');
    this.StorageKey.removeItem('bookingremarkRef');
  }

  // //--------- project Ref Start

  //---------- UserJSON
  getUserJSON(): Object | null {
    const UserJSON = this.StorageKey.getItem('UserJSON');
    return UserJSON // Return the UserJSON or 0 if not found
  }

  setUserJSON(val: Object | null): void {
    this.StorageKey.setItem('UserJSON', JSON.stringify(val)); // Store UserJSON reference in local storage
  }

  resetUserJSON(): void {
    this.StorageKey.setItem('UserJSON', '0');
  }

  // for Department Ref Start

  getDepartmentRef(): number {
    const DepartmentRef = this.localStorage.getItem('DepartmentRef');
    return DepartmentRef ? +DepartmentRef : 0 // Return the Company reference or 0 if not found
  }
  setDepartmentRef(val: number): void {
    this.DepartmentRef = val;
    this.localStorage.setItem('DepartmentRef', val.toString()); // Store Company reference in local storage
  }
  resetDepartmentRef(): void {
    this.localStorage.setItem('DepartmentRef', '0');
  }

  // for Department Ref End

  getDesignationRef(): number {
    const DesignationRef = this.localStorage.getItem('DesignationRef');
    return DesignationRef ? +DesignationRef : 0 // Return the Company reference or 0 if not found
  }
  setDesignationRef(val: number): void {
    this.DesignationRef = val;
    this.localStorage.setItem('DesignationRef', val.toString()); // Store Company reference in local storage
  }
  resetDesignationRef(): void {
    this.localStorage.setItem('DesignationRef', '0');
  }

    // ==================================== Login Token Start =========================================================

    getLoginToken(): string {
      const logtoken = this.StorageKey.getItem('LoginToken');
      return logtoken ? logtoken : ''; // Return the project reference or 0 if not found
    }

    setLoginToken(val: string): void {
      this.LoginToken = val;
      this.StorageKey.setItem('LoginToken', val); // Store project reference in local storage
    }

    resetLoginToken(): void {
      this.StorageKey.setItem('LoginToken', '');
    }

    // ==================================== Login Token End =========================================================



}
