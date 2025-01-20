import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateManageService {
  private CurrentGAAProjectRef = 0;
  private CurrentGAAProjectName = '';

  private CurrentGAAProjectRefForProductVersion = 0;
  private CurrentGAAProjectNameForProductVersion = '';

  private CurrentGAAProjectRefForProductInputChannel = 0;
  private CurrentGAAProjectNameForProductInputChannel = '';

  private CurrentGAAProjectRefForProductOutputChannel = 0;
  private CurrentGAAProjectNameForProductOutputChannel = '';

  private CustomerName = '';
  private CustomerRef = 0;
  private GAAProjectRef = 0;
  // private GAAProjectName = '';
  private projectCount = 0
  private Theme = '';
  public readonly StorageKey = sessionStorage
  public devUserId: string = 'deployment@gladiance.com'
  public devPassword: string = 'maths@4321'

  private IsForgetPasswordClickedValue = false

  constructor() { }

  // //--------- project Ref Start
  // getCurrentGAAProjectRef() {
  //   return this.CurrentGAAProjectRef;
  // }
  // setCurrentGAAProjectRef(val: number) {
  //   this.CurrentGAAProjectRef = val;
  // }
  // resetCurrentGAAProjectRef() {
  //   this.CurrentGAAProjectRef = 0;
  // }
  // //------------ project Ref End

  // // ----------- project Name Start
  // getCurrentGAAProjectName() {
  //   return this.CurrentGAAProjectName;
  // }
  // setCurrentGAAProjectName(val: string) {
  //   this.CurrentGAAProjectName = val;
  // }
  // resetCurrentGAAProjectName() {
  //   this.CurrentGAAProjectName = '';
  // }
  // //---------- project Name End

  // //--------- project Ref for product version Start
  // getCurrentGAAProjectRefForProductVersion() {
  //   return this.CurrentGAAProjectRefForProductVersion;
  // }
  // setCurrentGAAProjectRefForProductVersion(val: number) {
  //   this.CurrentGAAProjectRefForProductVersion = val;
  // }
  // resetCurrentGAAProjectRefForProductVersion() {
  //   this.CurrentGAAProjectRefForProductVersion = 0;
  // }
  // //------------ project Ref for product version End

  // // ----------- project Name for product version Start
  // getCurrentGAAProjectNameForProductVersion() {
  //   return this.CurrentGAAProjectNameForProductVersion;
  // }
  // setCurrentGAAProjectNameForProductVersion(val: string) {
  //   this.CurrentGAAProjectNameForProductVersion = val;
  // }
  // resetCurrentGAAProjectNameForProductVersion() {
  //   this.CurrentGAAProjectNameForProductVersion = '';
  // }
  // //---------- project Name for product version End

  // //--------- project Ref for product Input Channel Start
  // getCurrentGAAProjectRefForProductInputChannel() {
  //   return this.CurrentGAAProjectRefForProductInputChannel;
  // }
  // setCurrentGAAProjectRefForProductInputChannel(val: number) {
  //   this.CurrentGAAProjectRefForProductInputChannel = val;
  // }
  // resetCurrentGAAProjectRefForProductInputChannel() {
  //   this.CurrentGAAProjectRefForProductInputChannel = 0;
  // }
  // //------------ project Ref for product Input Channel End

  // // ----------- project Name for product Input Channel Start
  // getCurrentGAAProjectNameForProductInputChannel() {
  //   return this.CurrentGAAProjectNameForProductInputChannel;
  // }
  // setCurrentGAAProjectNameForProductInputChannel(val: string) {
  //   this.CurrentGAAProjectNameForProductInputChannel = val;
  // }
  // resetCurrentGAAProjectNameForProductInputChannel() {
  //   this.CurrentGAAProjectNameForProductInputChannel = '';
  // }
  // //---------- project Name for product Input Channel End

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
  getCurrentGAAProjectRef(): number {
    const projRef = this.StorageKey.getItem('CurrentGAAProjectRef');
    return projRef ? +projRef : 0 // Return the project reference or 0 if not found
  }
  setCurrentGAAProjectRef(val: number): void {
    this.CurrentGAAProjectRef = val;
    this.StorageKey.setItem('CurrentGAAProjectRef', val.toString()); // Store project reference in local storage
  }
  resetCurrentGAAProjectRef(): void {
    this.StorageKey.setItem('CurrentGAAProjectRef', '0');
  }
  // //------------ project Ref End

  //--------- project Ref for product version Start
  getCurrentGAAProjectRefForProductVersion(): number {
    const projversionRef = this.StorageKey.getItem('CurrentGAAProjectRefForProductVersion');
    return projversionRef ? +projversionRef : 0 // Return the project reference or 0 if not found
  }
  setCurrentGAAProjectRefForProductVersion(val: number): void {
    this.CurrentGAAProjectRefForProductVersion = val;
    this.StorageKey.setItem('CurrentGAAProjectRefForProductVersion', val.toString()); // Store project reference in local storage
  }
  resetCurrentGAAProjectRefForProductVersion(): void {
    this.StorageKey.setItem('CurrentGAAProjectRefForProductVersion', '0');
  }
  //--------- project Ref for product version End



  // // ----------- project Name for product version Start

  getCurrentGAAProjectNameForProductVersion(): string {
    const projversionName = this.StorageKey.getItem('CurrentGAAProjectNameForProductVersion');
    return projversionName ? projversionName : ''; // Return the project reference or 0 if not found
  }
  setCurrentGAAProjectNameForProductVersion(val: string): void {
    this.CurrentGAAProjectNameForProductVersion = val;
    this.StorageKey.setItem('CurrentGAAProjectNameForProductVersion', val); // Store project reference in local storage
  }
  resetCurrentGAAProjectNameForProductVersion(): void {
    this.StorageKey.setItem('CurrentGAAProjectNameForProductVersion', '');
  }
  //---------- project Name for product version End

  //---------- project Name
  getCurrentGAAProjectName(): string {
    const projname = this.StorageKey.getItem('CurrentGAAProjectName');
    return projname ? projname : ''; // Return the project reference or 0 if not found
  }

  setCurrentGAAProjectName(val: string): void {
    this.CurrentGAAProjectName = val;
    this.StorageKey.setItem('CurrentGAAProjectName', val); // Store project reference in local storage
  }

  resetCurrentGAAProjectName(): void {
    this.StorageKey.setItem('CurrentGAAProjectName', '');
  }
  //---------- project Name End

  // //--------- project Ref for product Input Channel Start
  getCurrentGAAProjectRefForProductInputChannel(): number {
    const productInputChannelRef = this.StorageKey.getItem('CurrentGAAProjectRefForProductInputChannel');
    return productInputChannelRef ? +productInputChannelRef : 0 // Return the project reference or 0 if not found
  }
  setCurrentGAAProjectRefForProductInputChannel(val: number): void {
    this.CurrentGAAProjectRefForProductInputChannel = val;
    this.StorageKey.setItem('CurrentGAAProjectRefForProductInputChannel', val.toString()); // Store project reference in local storage
  }
  resetCurrentGAAProjectRefForProductInputChannel(): void {
    this.StorageKey.setItem('CurrentGAAProjectRefForProductInputChannel', '0');
  }
  //------------ project Ref for product Input Channel End

  // ----------- project Name for product Input Channel Start
  getCurrentGAAProjectNameForProductInputChannel(): string {
    const productInputChannelName = this.StorageKey.getItem('CurrentGAAProjectNameForProductInputChannel');
    return productInputChannelName ? productInputChannelName : ''; // Return the project reference or 0 if not found
  }

  setCurrentGAAProjectNameForProductInputChannel(val: string): void {
    this.CurrentGAAProjectNameForProductInputChannel = val;
    this.StorageKey.setItem('CurrentGAAProjectNameForProductInputChannel', val); // Store project reference in local storage
  }

  resetCurrentGAAProjectNameForProductInputChannel(): void {
    this.StorageKey.setItem('CurrentGAAProjectNameForProductInputChannel', '');
  }
  //---------- project Name for product Input Channel End


  // // //--------- project Ref for product Output Channel Start
  // getCurrentGAAProjectRefForProductOutputChannel(): number {
  //   const productOutputChannelRef = this.StorageKey.getItem('CurrentGAAProjectRefForProductOutputChannel');
  //   return productOutputChannelRef ? +productOutputChannelRef : 0 // Return the project reference or 0 if not found
  // }
  // setCurrentGAAProjectRefForProductOutputChannel(val: number): void {
  //   this.CurrentGAAProjectRefForProductOutputChannel = val;
  //   this.StorageKey.setItem('CurrentGAAProjectRefForProductOutputChannel', val.toString()); // Store project reference in local storage
  // }
  // resetCurrentGAAProjectRefForProductOutputChannel(): void {
  //   this.StorageKey.setItem('CurrentGAAProjectRefForProductOutputChannel', '0');
  // }
  // //------------ project Ref for product Output Channel End

  // // ----------- project Name for product Output Channel Start
  // getCurrentGAAProjectNameForProductOutputChannel(): string {
  //   const productOutputChannelName = this.StorageKey.getItem('CurrentGAAProjectNameForProductOutputChannel');
  //   return productOutputChannelName ? productOutputChannelName : ''; // Return the project reference or 0 if not found
  // }

  // setCurrentGAAProjectNameForProductOutputChannel(val: string): void {
  //   this.CurrentGAAProjectNameForProductOutputChannel = val;
  //   this.StorageKey.setItem('CurrentGAAProjectNameForProductOutputChannel', val); // Store project reference in local storage
  // }

  // resetCurrentGAAProjectNameForProductOutputChannel(): void {
  //   this.StorageKey.setItem('CurrentGAAProjectNameForProductOutputChannel', '');
  // }
  // //---------- project Name for product Output Channel End


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

  // Customer Ref start

  getCustomerRef(): number {
    const custRef = this.StorageKey.getItem('CustomerRef');
    return custRef ? +custRef : 0 // Return the project reference or 0 if not found
  }
  setCustomerRef(val: number): void {
    this.CustomerRef = val;
    this.StorageKey.setItem('CustomerRef', val.toString()); // Store project reference in local storage
  }
  resetCustomerRef(): void {
    this.StorageKey.setItem('CustomerRef', '0');
  }
  // Customer Ref End

  // GAAProjectRef  start

  getGAAProjectRef(): number {
    const ProjectRef = this.StorageKey.getItem('GAAProjectRef');
    return ProjectRef ? +ProjectRef : 0 // Return the project reference or 0 if not found
  }
  setGAAProjectRef(val: number): void {
    this.GAAProjectRef = val;
    this.StorageKey.setItem('GAAProjectRef', val.toString()); // Store project reference in local storage
  }
  resetGAAProjectRef(): void {
    this.StorageKey.setItem('GAAProjectRef', '0');
  }
  // GAAProjectRef  End

  // ----------- GAAProjectName Start
  // getGAAProjectName(): string {
  //   const ProjectName = this.StorageKey.getItem('GAAProjectName');
  //   return ProjectName ? ProjectName : ''; // Return the project reference or 0 if not found
  // }

  // setGAAProjectName(val: string): void {
  //   this.GAAProjectName = val;
  //   this.StorageKey.setItem('GAAProjectName', val); // Store project reference in local storage
  // }

  // resetGAAProjectName(): void {
  //   this.StorageKey.setItem('GAAProjectName', '');
  // }
  //---------- GAAProjectName  End



  // getprojectCount  start

  getprojectCount(): number {
    const proCount = this.StorageKey.getItem('projectCount');
    return proCount ? +proCount : 0 // Return the project reference or 0 if not found
  }
  setprojectCount(val: number): void {
    this.projectCount = val;
    this.StorageKey.setItem('projectCount', val.toString()); // Store project reference in local storage
  }
  resetprojectCount(): void {
    this.StorageKey.setItem('projectCount', '0');
  }
  // getprojectCount  End


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
  //---------- Theme End

  // ============================================================ Forgot Password Clicked Value start =========================================================

  getIsForgetPasswordClickedValue() {
    return this.IsForgetPasswordClickedValue;
  }
  setIsForgetPasswordClickedValue(val: boolean) {
    this.IsForgetPasswordClickedValue = val;
  }
  resetIsForgetPasswordClickedValue() {
    this.IsForgetPasswordClickedValue = false;
  }

  // getIsForgetPasswordClickedValue(): boolean {
  //   const value = this.StorageKey.getItem('IsForgetPasswordClickedValue');
  //   return value === 'true'; // Convert the stored string to a boolean
  // }

  // // Set IsSignupClickedValue
  // setIsForgetPasswordClickedValue(val: boolean): void {
  //   this.IsForgetPasswordClickedValue = val;
  //   this.StorageKey.setItem('IsForgetPasswordClickedValue', val.toString()); // Store the boolean value as a string
  // }

  // // Reset IsSignupClickedValue
  // resetIsForgetPasswordClickedValue(): void {
  //   this.StorageKey.setItem('IsForgetPasswordClickedValue', 'false'); // Reset the value to 'false'
  // }

  // ============================================================Forgot Password Clicked Value End =========================================================


  //============================= User JSON Start
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

  //============================= User JSON End

}
