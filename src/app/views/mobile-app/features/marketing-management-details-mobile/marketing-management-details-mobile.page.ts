import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums, MarketingModes } from 'src/app/classes/domain/domainenums/domainenums';
import { MarketingManagement, ServiceSuppliedByVendorProps } from 'src/app/classes/domain/entities/website/MarketingManagement/marketingmanagement';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { VendorService } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { SharedModule } from "../../shared/shared.module";

@Component({
  selector: 'app-marketing-management-details-mobile',
  templateUrl: './marketing-management-details-mobile.page.html',
  styleUrls: ['./marketing-management-details-mobile.page.scss'],
  standalone:false
})
export class MarketingManagementDetailsMobilePage implements OnInit {

  isLoading: boolean = false;
  Entity: MarketingManagement = MarketingManagement.CreateNewInstance();
  IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Marketing' | 'Edit Marketing' = 'New Marketing';
  IsDropdownDisabled: boolean = false;
  InitialEntity: MarketingManagement = null as any;
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  VendorServiceList: ServiceSuppliedByVendorProps[] = [];
  VendorServiceListByVendor: VendorService[] = [];
  EmployeeList: Employee[] = [];
  MarketingTypesList = DomainEnums.MarketingModesList();
  MarketingType = MarketingModes
  companyRef: number = 0;
  companyName: any = '';
  serviceNamesString: string = '';
  strCDT: string = ''
  Date: string | null = null;
  SiteName: string = '';
  MarketingTypeName: string = '';
  VendorName: string = '';
  VendorServiceName: string = '';
  selectedEmployee: any[] = [];
  selectedEmployeeName: string = '';
  selectedVendorServices: any[] = [];
  selectedVendor: any[] = [];
  selectedMarketingType: any[] = [];
  selectedSite: any[] = [];


  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private dtu: DTU,
  ) { }

  async ngOnInit() {
    this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));
    this.companyName = this.appStateManage.localStorage.getItem('companyName') ? this.appStateManage.localStorage.getItem('companyName') : '';
    this.loadMarketingManagementIfEmployeeExists();
  }
  ngOnDestroy(): void {
    // cleanup logic if needed later
  }
  private async loadMarketingManagementIfEmployeeExists(): Promise<void> {
    try {
      this.isLoading = true;
      this.appStateManage.setDropdownDisabled(true);
      this.getVendorListByCompanyRef()
      this.getEmployeeListByCompanyRef()
      this.SiteList = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      if (this.appStateManage.localStorage.getItem('Editable') == 'Edit') {
        this.IsNewEntity = false;
        this.DetailsFormTitle = this.IsNewEntity ? 'New Marketing' : 'Edit Marketing';
        this.Entity = MarketingManagement.GetCurrentInstance();
        this.appStateManage.localStorage.removeItem('Editable');
        this.Entity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
        if (this.Entity.p.Date != '') {
          this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date)
        }
        this.getVendorServiceListByVendorRef(this.Entity.p.VendorRef);
        this.selectedSite = [{ p: { Ref: this.Entity.p.SiteRef, Name: this.Entity.p.SiteName } }];
        this.SiteName = this.Entity.p.SiteName;
        this.selectedVendor = [{ p: { Ref: this.Entity.p.VendorRef, Name: this.Entity.p.VendorName } }];
        this.VendorName = this.Entity.p.VendorName;
        this.selectedVendorServices = [{ p: { Ref: this.Entity.p.VendorServiceRef, Name: this.Entity.p.VendorServiceName } }];
        this.VendorServiceName = this.Entity.p.VendorServiceName;
        this.selectedEmployee = [{ p: { Ref: this.Entity.p.Name, Name: this.Entity.p.Name } }];
        this.selectedEmployeeName = await this.getEmployeeNameByEmployeeRef(this.Entity.p.Name) ?? '';
        this.selectedMarketingType = [{ p: { Ref: this.Entity.p.MarketingType, Name: this.Entity.p.MarketingTypeName } }];
        this.MarketingTypeName = this.Entity.p.MarketingTypeName;

      } else {
        this.Entity = MarketingManagement.CreateNewInstance();
        MarketingManagement.SetCurrentInstance(this.Entity);
        if (this.Entity.p.Date == '') {
          this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
          let parts = this.strCDT.substring(0, 16).split('-');
          // Construct the new date format
          this.Entity.p.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
          this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
        }
      }
      this.InitialEntity = Object.assign(
        MarketingManagement.CreateNewInstance(),
        this.utils.DeepCopy(this.Entity)
      ) as MarketingManagement;
      // this.focusInput();
    } catch (error) {

    } finally {
      this.isLoading = false;
    }
  }

  getEmployeeNameByEmployeeRef = async (EmployeeRef: number) => {
    // Find employee object in list with matching EmployeeRef
    const employee = this.EmployeeList.find(emp => emp.p.Ref === EmployeeRef);
    // Return the employee name if found, else null
    return employee ? employee.p.Name : '';
  }

  getEmployeeListByCompanyRef = async () => {
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
  }

  getVendorListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Vendor.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = lst;
  }

  private FormulateVendorServiceList = async () => {
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.VendorServiceListByVendor = []
    let lst = await VendorService.FetchEntireListByCompanyRef(this.companyRef,
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.VendorServiceListByVendor = lst;
  };

  getVendorServiceListByVendorRef = async (VendorRef: number) => {
    if (this.IsNewEntity) {
      this.Entity.p.VendorServiceRef = 0
    }
    this.VendorServiceList = []
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Vendor.FetchInstance(VendorRef, this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorServiceList = lst.p.ServiceListSuppliedByVendor;
    this.VendorServiceListByVendor = []; // Clear existing list first
    if (this.VendorServiceList.length > 0) {
      await this.FormulateVendorServiceList();
      const refArray = this.VendorServiceList.map(s => Number(s));
      const matched = this.VendorServiceListByVendor.filter(service => refArray.includes(service.p.Ref));
      this.VendorServiceListByVendor = matched; // Either matched list or stays empty
    }
  }

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  onVendorChange = async (vendorref: number) => {
    this.serviceNamesString = '';
    const services = await VendorService.FetchInstance(vendorref, async errMsg =>
      await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    const name = services?.p?.Name || '';
    this.serviceNamesString = name;
  };

  calculateTotal = () => {
    const Rate = Number(this.Entity.p.Rate);
    const Quantity = Number(this.Entity.p.Quantity);
    this.Entity.p.Total = Math.ceil(Rate * Quantity);
  }

  SaveMarketingManagementMaster = async () => {
    this.Entity.p.CompanyRef = this.companyRef;
    this.Entity.p.CompanyName = this.companyName;
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.Date)
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];

    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Marketing saved successfully');
        this.Entity = MarketingManagement.CreateNewInstance();
        this.router.navigate(['/mobileapp/tabs/dashboard/marketing-management']);
      } else {
        await this.uiUtils.showSuccessToster('Marketin Updated successfully');
        this.router.navigate(['/mobileapp/tabs/dashboard/marketing-management']);
      }
    }
  };

  public async selectEmployeeBottomsheet(): Promise<void> {
    try {
      const options = this.EmployeeList;
      this.openSelectModal(options, this.selectedEmployee, false, 'Select Employee', 1, (selected) => {
        this.selectedEmployee = selected;
        this.Entity.p.Name = this.selectedEmployee[0].p.Ref;
        this.selectedEmployeeName = this.selectedEmployee[0].p.Name;
      });
    } catch (error) {

    }
  }
  public async selectVendorServicesBottomsheet(): Promise<void> {
    try {
      if (this.Entity.p.VendorRef <= 0) {
        await this.uiUtils.showWarningToster('Please Select Vendor');
        return;
      }
      const options = this.VendorServiceListByVendor;
      this.openSelectModal(options, this.selectedVendorServices, false, 'Select Services', 1, (selected) => {
        this.selectedVendorServices = selected;
        this.Entity.p.VendorServiceRef = selected[0].p.Ref;
        this.VendorServiceName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }
  public async selectVendorBottomsheet(): Promise<void> {
    try {
      const options = this.VendorList;
      this.openSelectModal(options, this.selectedVendor, false, 'Select Vendor', 1, (selected) => {
        this.selectedVendor = selected;
        this.Entity.p.VendorRef = selected[0].p.Ref;
        this.VendorName = selected[0].p.Name;
        this.getVendorServiceListByVendorRef(this.Entity.p.VendorRef)
      });
    } catch (error) {

    }
  }
  public async selectMarketingTypeBottomsheet(): Promise<void> {
    try {
      const options = this.MarketingTypesList.map((item) => ({ p: item }));
      this.openSelectModal(options, this.selectedMarketingType, false, 'Select Marketing Type', 1, (selected) => {
        this.selectedMarketingType = selected;
        this.Entity.p.MarketingType = selected[0].p.Ref;
        this.MarketingTypeName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }
  public async selectSiteBottomsheet(): Promise<void> {
    try {
      const options = this.SiteList;
      this.openSelectModal(options, this.selectedSite, false, 'Select Site', 1, (selected) => {
        this.selectedSite = selected;
        this.Entity.p.SiteRef = selected[0].p.Ref;
        this.SiteName = selected[0].p.Name;
      });
    } catch (error) {

    }
  }
  private async openSelectModal(
    dataList: any[],
    selectedItems: any[],
    multiSelect: boolean,
    title: string,
    MaxSelection: number,
    updateCallback: (selected: any[]) => void
  ): Promise<void> {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(dataList, selectedItems, multiSelect, title, MaxSelection);
    if (selected) updateCallback(selected);
  }
  isDataFilled(): boolean {
    const emptyEntity = MarketingManagement.CreateNewInstance();
    console.log('emptyEntity :', emptyEntity);
    console.log('this Entity :', this.Entity);
    return !this.deepEqualIgnoringKeys(this.Entity, emptyEntity, ['p.Date']);
  }

  deepEqualIgnoringKeys(obj1: any, obj2: any, ignorePaths: string[]): boolean {
    const clean = (obj: any, path = ''): any => {
      if (obj === null || typeof obj !== 'object') return obj;

      const result: any = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        const fullPath = path ? `${path}.${key}` : key;
        if (ignorePaths.includes(fullPath)) continue;
        result[key] = clean(obj[key], fullPath);
      }
      return result;
    };

    const cleanedObj1 = clean(obj1);
    const cleanedObj2 = clean(obj2);

    return JSON.stringify(cleanedObj1) === JSON.stringify(cleanedObj2);
  }

  goBack = async () => {
    // Replace this with your actual condition to check if data is filled
    const isDataFilled = this.isDataFilled(); // Implement this function based on your form

    if (isDataFilled) {
      await this.uiUtils.showConfirmationMessage(
        'Warning',
        `You have unsaved data. Are you sure you want to go back? All data will be lost.`,
        async () => {
          this.router.navigate(['/mobileapp/tabs/dashboard/marketing-managementt'], { replaceUrl: true });
        }
      );
    } else {
      this.router.navigate(['/mobileapp/tabs/dashboard/marketing-management'], { replaceUrl: true });
    }
  }
}
