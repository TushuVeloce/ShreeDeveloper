import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateManageService {
  private CurrentCompanyRef = 0;
  private CurrentCompanyName = '';
  private CompanyRef = 0;

  private CurrentGAAProjectRefForProductVersion = 0;
  private CurrentGAAProjectNameForProductVersion = '';

  private CurrentGAAProjectRefForProductInputChannel = 0;
  private CurrentGAAProjectNameForProductInputChannel = '';

  private CurrentGAAProjectRefForProductOutputChannel = 0;
  private CurrentGAAProjectNameForProductOutputChannel = '';

  private CustomerName = '';
  private CustomerRef = 0;
  // private GAAProjectName = '';
  private projectCount = 0
  private Theme = '';
  public readonly StorageKey = sessionStorage
  public readonly localStorage = localStorage

  public devUserId: string = 'deployment@gladiance.com'
  public devPassword: string = 'maths@4321'
  private IsForgetPasswordClickedValue = false
  public isDropdownDisabled = signal<boolean>(false);

  constructor() { }
  
  setDropdownDisabled(value: boolean) {
    this.isDropdownDisabled.set(value);
  }
  

  // CompanyRef  start

  getCompanyRef(): number {
    const CompanyRef = this.localStorage.getItem('CompanyRef');
    console.log('CompanyReflocalstorage :', CompanyRef);
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



}
