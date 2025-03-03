import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule, formatDate, WeekDay } from '@angular/common';
import { ThemeService } from 'src/app/services/theme.service';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { SessionValues } from 'src/app/services/sessionvalues.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { UserLogoutRequest } from 'src/app/classes/infrastructure/request_response/userlogoutrequest';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';


interface SubModule {
  Name: string;
  RouterLink: string;
}

interface module {
  Name: string;
  RouterLink: string;
  WhiteLogo: string;
  SubModuleList: SubModule[];
}


@Component({
  selector: 'app-sidebarlayout',
  templateUrl: './sidebarlayout.component.html',
  styleUrls: ['./sidebarlayout.component.scss'],
  imports: [CommonModule, RouterLink, RouterOutlet, NzIconModule, NzLayoutModule,
    NzMenuModule, NzDropDownModule, NzModalModule, FormsModule, FontAwesomeModule, NzSelectModule]
})
export class SidebarlayoutComponent implements OnInit {
  isDarkMode: boolean = false; // Two-way binding to checkbox
  themeLabel: string = '';
  theme: string = '';
  isCollapsed: boolean = false;
  isVisible: boolean = false;
  currentRoute: string = '';
  routerChangedSubscription: Subscription | undefined;
  activeModule: string | null = null; // Tracks the active module
  activeSubmodule: string | null = null; // Tracks the active submodule
  CompnyList : Company[] = [];
  CompanyRef: number = 0;
  isDropdownDisabled: boolean = false;
  // Name: string = 'Veloce Tech';

  previousActiveSubmodule: string | null = null; // Tracks the active module
  previousActiveModule: string | null = null; // Tracks the active module
  @ViewChild('menuDiv', { static: true }) menuDiv!: ElementRef;

  previousRoute: string = '';

  constructor(public router: Router, public themeService: ThemeService, private el: ElementRef, private renderer: Renderer2,
    public appStateManagement: AppStateManageService,
    private sessionValues: SessionValues, private cdr: ChangeDetectorRef,
    private uiUtils: UIUtils, private companystatemanagement: CompanyStateManagement,private servercommunicator: ServerCommunicatorService,) {

      
    this.routerChangedSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousRoute = this.currentRoute;
        this.currentRoute = event.urlAfterRedirects;
        this.updateActiveModuleAndSubmodule(); // Update the active module and submodule
      }
    });
  }

  // navigateTo(route: string, disableDropdown: boolean = false) {
  //   this.appStateManagement.setDropdownDisabled(disableDropdown);
  //   this.router.navigate([route]);
  // }

  ModuleList: module[] = [];
  BrowserBack: boolean = false;


  myDate = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  d = new Date();
  myDay = WeekDay[this.d.getDay()];

  isMenuFolded: boolean = false; // Tracks whether the menu is folded

  toggleMenu(): void {
    this.isMenuFolded = !this.isMenuFolded; // Toggles the menu state
  }
  ngOnInit() {
    this.ongetcompany()
        this.isDarkMode = this.appStateManagement.getTheme() === 'dark';
    this.onThemeToggle();

    this.GenerateAndSetMenuItemModuleList();
    this.isDarkMode = this.appStateManagement.getTheme() === 'dark'
    this.onThemeToggle();
    this.FormulateCompanyList();

    // Listen to browser back button events
    // this.location.subscribe(event => {
    //   if (event.pop) {
    //     this.BrowserBack = true; // Flag browser back event
    //     this.resetSelectedMenu();
    //   }
    // });

  }
 

  // Method to clear active menu selections
  resetSelectedMenu(): void {
    this.activeModule = null;
    this.activeSubmodule = null;
    this.BrowserBack = true;

    // Force Angular to detect changes
    this.cdr.detectChanges();

    // Reset the flag after rendering to prevent CSS conflicts
    setTimeout(() => (this.BrowserBack = false), 100);
  }
  onMenuItemClick(submoduleName: string): void {
    this.activeSubmodule = submoduleName;
    this.BrowserBack = false;
  }

  newModulename: string = '';
  oldModulename: string = '';
  isShow: boolean = false;
  isShow1: boolean = false;
  count = true;

  updateActiveModuleAndSubmodule(): void {
    // Clear previous selections
    this.activeModule = null;
    this.activeSubmodule = null;

    this.previousActiveModule = null; // Add these to track previous
    this.previousActiveSubmodule = null;

    // Find the current module
    const currentModule = this.ModuleList.filter(module =>
      module.SubModuleList.find(submodule => submodule.RouterLink === this.currentRoute)
    );

    const previousModule = this.ModuleList.filter(module =>
      module.SubModuleList.find(submodule => submodule.RouterLink === this.previousRoute)
    );

    if (currentModule.length > 0) {
      // Update the active module
      this.activeModule = currentModule[0].Name;

      // Find the current submodule
      const currentSubmodule = currentModule[0].SubModuleList.find(
        (submodule: SubModule) => this.currentRoute === submodule.RouterLink
      );

      if (currentSubmodule) {
        this.activeSubmodule = currentSubmodule.Name;
      }
    }

    if (previousModule.length > 0) {
      // Update the previous module
      this.previousActiveModule = previousModule[0].Name;
      // Find the previous submodule
      const previousSubmodule = previousModule[0].SubModuleList.find(
        (submodule: SubModule) => this.previousRoute === submodule.RouterLink
      );

      if (this.previousActiveModule == this.activeModule) {
        return
      } else if (this.previousActiveModule != this.activeModule && this.BrowserBack) {
        if (this.activeModule) {
          this.SideMenuHideShowForModule(this.activeModule, true)
        }
      }
    }
  }

  isRouteActive(route: string, ModuleName: string) {
    return this.currentRoute === route;
  }
  ngOnDestroy(): void {
    if (this.routerChangedSubscription) {
      this.routerChangedSubscription.unsubscribe();
    }
  }

  logout = async () => {
    await this.uiUtils.showConfirmationMessage('Log Out', 'Are you sure you want to Log Out?',
      async () => {
        let req = new UserLogoutRequest();
        req.LoginToken = this.sessionValues.CurrentLoginToken;
        let _ = await this.servercommunicator.LogoutUser(req)
        await this.router.navigate(['/']);
      });
  }

  openMap: { [name: string]: boolean } = {
    sub1: true,
    sub2: false,
    sub3: false,
  };

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  SideMenuHideShowForModule = (ModuleName: string, value: boolean) => {
    this.isShow = value;
    this.isShow1 = false;
    if (this.oldModulename == ModuleName && this.count) {
      this.isShow = false;
      this.count = false;
    } else {
      this.count = true;
    }
    this.newModulename = ModuleName;
    this.oldModulename = this.newModulename;
  };

  NavigationFromLogo(RouterLink: any) {
    if (RouterLink != '') {
      this.router.navigate([RouterLink]);
    }
  }

  onThemeToggle() {
    const theme = this.isDarkMode ? 'dark' : 'light';
    this.themeLabel = theme === 'dark' ? 'Dark' : 'Light'; // Update label
    this.themeService.toggleTheme(theme); // Call service method to toggle theme
    this.appStateManagement.setTheme(theme)
    this.themeService.theme = theme;
  }

  private GenerateAndSetMenuItemModuleList = () => {
    // let validMenuItemIds = this.appStateManagement.getValidMenuItemIds();

    let DashboardsSubModuleList = [
      {
        Name: 'Dashboard',
        RouterLink: '/homepage/Website/',
        LogoPath: '',
      },
    ]

    let MasterSubModuleList = [
      {
        Name: 'Unit Master',
        RouterLink: '/homepage/Website/Unit_Master',
        LogoPath: '',
      },
      {
        Name: 'Material Master',
        RouterLink: '/homepage/Website/Material_Master',
        LogoPath: '',
      },
      {
        Name: 'Stage Master',
        RouterLink: '/homepage/Website/Stage_Master',
        LogoPath: '',
      },
      {
        Name: 'Account Main Ledger',
        RouterLink: '/homepage/Website/Account_Main_Ledger',
        LogoPath: '',
      },
      {
        Name: 'Account Sub Ledger',
        RouterLink: '/homepage/Website/Account_Sub_Ledger',
        LogoPath: '',
      },
      {
        Name: 'Marketing Type Master',
        RouterLink: '/homepage/Website/Marketing_Master',
        LogoPath: '',
      },
      {
        Name: 'Vendor Master',
        RouterLink: '/homepage/Website/Vendor_Master',
        LogoPath: '',
      },
      // {
      //   Name: 'Vehicle Master',
      //   RouterLink: '/homepage/Website/Vehicle_Master',
      //   LogoPath: '',
      // },
      {
        Name: 'Bank Account Master',
        RouterLink: '/homepage/Website/Bank_Master',
        LogoPath: '',
      },
      {
        Name: 'Country Master',
        RouterLink: '/homepage/Website/Country',
        LogoPath: '',
      },
      {
        Name: 'State Master',
        RouterLink: '/homepage/Website/State',
        LogoPath: '',
      },
      {
        Name: 'City Master',
        RouterLink: '/homepage/Website/City',
        LogoPath: '',
      },
      {
        Name: 'Department Master',
        RouterLink: '/homepage/Website/Department_Master',
        LogoPath: '',
      },
      {
        Name: 'User Role Master',
        RouterLink: '/homepage/Website/User_Role_Master',
        LogoPath: '',
      },
      {
        Name: 'User Role Rights',
        RouterLink: '/homepage/Website/User_Role_Rights',
        LogoPath: '',
      },
      {
        Name: 'External Users Master',
        RouterLink: '/homepage/Website/User_Master',
        LogoPath: '',
      },
      {
        Name: 'Company Master',
        RouterLink: '/homepage/Website/Company_Master',
        LogoPath: '',
      },
      {
        Name: 'Financial Year Master',
        RouterLink: '/homepage/Website/Financial_Year_Master',
        LogoPath: '',
      },
      {
        Name: 'Employee Master',
        RouterLink: '/homepage/Website/Employee_Master',
        LogoPath: '',
      },
    ]

    let SiteManagementSubModuleList = [
      {
        Name: 'New Site',
        RouterLink: '/homepage/Website/site_management_Master',
        LogoPath: '',
      },
      {
        Name: 'Actual Stages',
        RouterLink: '/homepage/Website/site_management_actual_stage',
        LogoPath: '',
      },
      {
        Name: 'Estimate Stages',
        RouterLink: '/homepage/Website/Estimate_Stages',
        LogoPath: '',
      },
    ]

    let StockManagementSubModuleList = [
      {
        Name: 'Material Requisition',
        RouterLink: '/homepage/Website/Material_Requisition',
        LogoPath: '',
      },
      {
        Name: 'Stock Order',
        RouterLink: '/homepage/Website/Stock_Order',
        LogoPath: '',
      },
      {
        Name: 'Stock Inward',
        RouterLink: '/homepage/Website/Stock_Inward',
        LogoPath: '',
      },
      {
        Name: 'Stock Consume',
        RouterLink: '/homepage/Website/Stock_Consume',
        LogoPath: '',
      },
      {
        Name: 'Stock Transfer',
        RouterLink: '/homepage/Website/Stock_Transfer',
        LogoPath: '',
      },
    ]

    let moduleListInternal = [
      {
        Name: 'Dashboards',
        RouterLink: '',
        WhiteLogo: '/assets/icons/dashboard.png',
        SubModuleList: DashboardsSubModuleList,
      }, {
        Name: 'Master',
        RouterLink: '',
        WhiteLogo: '/assets/icons/master.png',
        SubModuleList: MasterSubModuleList,
      },
      {
        Name: 'Site Management',
        RouterLink: '',
        WhiteLogo: '/assets/icons/site.png',
        SubModuleList: SiteManagementSubModuleList,
      },
      {
        Name: 'Stock Management',
        RouterLink: '',
        WhiteLogo: '/assets/icons/stock.png',
        SubModuleList: StockManagementSubModuleList,
      },
    ].filter(e => e.SubModuleList.length > 0);

    this.ModuleList = moduleListInternal;
  }

  openModal(): void {
    const modalElement = document.getElementById('sidebarModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  closeModal() {
    const modalElement = document.getElementById('sidebarModal');
    if (modalElement) {
      // Bootstrap method to hide the modal
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  navigatetodashboard() {
    this.router.navigate(['/homepage/hotel/dashboard']);
  }

 private FormulateCompanyList = async () => {
    let lst = await Company.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.CompnyList = lst;
  }

  changecompany(ref: number) {    
    const selectedCompany = this.CompnyList.find(company => company.p.Ref === ref);
    if (selectedCompany) {
      this.appStateManagement.StorageKey.setItem('SelectedCompanyRef',selectedCompany.p.Ref.toString());
      this.appStateManagement.StorageKey.setItem('companyName', selectedCompany.p.Name);
      this.companystatemanagement.setCompanyRef(ref, selectedCompany.p.Name);
    this.CompanyRef = ref;
    }else {
      console.warn('Selected company not found');
    }

  }
  
  ongetcompany(){
    const storedCompanyRef =  this.appStateManagement.StorageKey.getItem('SelectedCompanyRef');
    const storedCompanyName =  this.appStateManagement.StorageKey.getItem('companyName');
    if (storedCompanyRef && storedCompanyName) {
      const ref = Number(storedCompanyRef);
      this.CompanyRef = ref; 
      this.companystatemanagement.setCompanyRef(ref, storedCompanyName);
    }
  }
}
