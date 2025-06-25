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
  LogoPath: string;
}

interface module {
  Name: string;
  RouterLink: string;
  WhiteLogo: string;
  SubModuleList?: SubModule[];
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
  CompnyList: Company[] = [];
  CompanyRef: number = 0;
  isDropdownDisabled: boolean = false;
  isShow = true;
  isModalOpen: boolean = false;

  // Name: string = 'Veloce Tech';

  previousActiveSubmodule: string | null = null; // Tracks the active module
  previousActiveModule: string | null = null; // Tracks the active module
  @ViewChild('menuDiv', { static: true }) menuDiv!: ElementRef;

  previousRoute: string = '';

  constructor(public router: Router, public themeService: ThemeService, private el: ElementRef, private renderer: Renderer2,
    public appStateManagement: AppStateManageService,
    private sessionValues: SessionValues, private cdr: ChangeDetectorRef,
    private uiUtils: UIUtils, private companystatemanagement: CompanyStateManagement, private servercommunicator: ServerCommunicatorService,) {


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
  async ngOnInit() {
    await this.ongetcompany()
    this.appStateManagement.companyInit$.subscribe(() => {
      this.ongetcompany(); // Called after login
    });
    this.isDarkMode = this.appStateManagement.getTheme() === 'dark';
    this.onThemeToggle();

    this.GenerateAndSetMenuItemModuleList();
    this.isDarkMode = this.appStateManagement.getTheme() === 'dark'
    this.onThemeToggle();
    this.FormulateCompanyList();
    const savedSubmodule = localStorage.getItem('activeSubmodule');
    if (savedSubmodule) {
      this.activeSubmodule = savedSubmodule;
    }

    const savedModule = localStorage.getItem('activeModule');
    if (savedModule) {
      this.newModulename = savedModule;
      this.isShow = true;
    }

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
    // this.BrowserBack = false;
    localStorage.setItem('activeSubmodule', submoduleName);
  }

  newModulename: string = '';
  oldModulename: string = '';
  isShow1: boolean = false;
  count = true;

  // updateActiveModuleAndSubmodule(): void {
  //   // Clear previous selections
  //   this.activeModule = null;
  //   this.activeSubmodule = null;

  //   this.previousActiveModule = null; // Add these to track previous
  //   this.previousActiveSubmodule = null;

  //   // Find the current module
  //   const currentModule = this.ModuleList.filter(module =>
  //     module.SubModuleList?.find(submodule => submodule.RouterLink === this.currentRoute)
  //   );

  //   const previousModule = this.ModuleList.filter(module =>
  //     module.SubModuleList?.find(submodule => submodule.RouterLink === this.previousRoute)
  //   );

  //   if (currentModule.length > 0) {
  //     // Update the active module
  //     this.activeModule = currentModule[0].Name;

  //     // Find the current submodule
  //     const currentSubmodule = currentModule[0]?.SubModuleList?.find(
  //       (submodule: SubModule) => this.currentRoute === submodule.RouterLink
  //     );

  //     if (currentSubmodule) {
  //       this.activeSubmodule = currentSubmodule.Name;
  //     }
  //   }

  //   if (previousModule.length > 0) {
  //     // Update the previous module
  //     this.previousActiveModule = previousModule[0].Name;
  //     // Find the previous submodule
  //     const previousSubmodule = previousModule[0]?.SubModuleList?.find(
  //       (submodule: SubModule) => this.previousRoute === submodule.RouterLink
  //     );

  //     if (this.previousActiveModule == this.activeModule) {
  //       return
  //     } else if (this.previousActiveModule != this.activeModule && this.BrowserBack) {
  //       if (this.activeModule) {
  //         this.SideMenuHideShowForModule(this.activeModule, true)
  //       }
  //     }
  //   }
  // }

  // isRouteActive(route: string, ModuleName: string) {
  //   return this.currentRoute === route;
  // }

  updateActiveModuleAndSubmodule(): void {
    this.activeModule = null;
    this.activeSubmodule = null;

    this.previousActiveModule = null;
    this.previousActiveSubmodule = null;

    // Find the current module and submodule by matching if currentRoute starts with submodule's RouterLink
    const currentModule = this.ModuleList.filter(module =>
      module.SubModuleList?.some(submodule => this.currentRoute.startsWith(submodule.RouterLink))
    );

    const previousModule = this.ModuleList.filter(module =>
      module.SubModuleList?.some(submodule => this.previousRoute.startsWith(submodule.RouterLink))
    );

    if (currentModule.length > 0) {
      this.activeModule = currentModule[0].Name;

      const currentSubmodule = currentModule[0]?.SubModuleList?.find(
        (submodule: SubModule) => this.currentRoute.startsWith(submodule.RouterLink)
      );

      if (currentSubmodule) {
        this.activeSubmodule = currentSubmodule.Name;
      }
    }

    if (previousModule.length > 0) {
      this.previousActiveModule = previousModule[0].Name;

      const previousSubmodule = previousModule[0]?.SubModuleList?.find(
        (submodule: SubModule) => this.previousRoute.startsWith(submodule.RouterLink)
      );

      if (this.previousActiveModule === this.activeModule) {
        return;
      } else if (this.previousActiveModule !== this.activeModule && this.BrowserBack) {
        if (this.activeModule) {
          this.SideMenuHideShowForModule(this.activeModule, true);
        }
      }
    }
  }

  // Also update your isRouteActive() to use startsWith:
  isRouteActive(route: string, ModuleName: string) {
    return this.currentRoute.startsWith(route);
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
        req.LastSelectedCompanyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
        req.EmployeeRef = this.appStateManagement.getEmployeeRef();
        localStorage.removeItem('activeSubmodule');
        localStorage.removeItem('activeModule');
        this.isCollapsed = false
        this.activeModule = null
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

  // SideMenuHideShowForModule = (ModuleName: string, value: boolean) => {
  //   this.isShow = value;
  //   this.isShow1 = false;
  //   if (this.oldModulename == ModuleName && this.count) {
  //     this.isShow = false;
  //     this.count = false;
  //   } else {
  //     this.count = true;
  //   }
  //   this.newModulename = ModuleName;
  //   this.oldModulename = this.newModulename;
  // };

  SideMenuHideShowForModule(moduleName: string, show: boolean): void {
    if (this.newModulename === moduleName) {
      // Toggle collapse if the same module is clicked again
      this.isShow = !this.isShow;

      // If collapsing, clear activeModule from localStorage
      if (!this.isShow) {
        localStorage.removeItem('activeModule');
      }
    } else {
      // New module clicked → set it as active and expand it
      this.newModulename = moduleName;
      this.isShow = true;
      localStorage.setItem('activeModule', moduleName);
    }
  }


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
        LogoPath: '/assets/icons/Material Master.png',
      },
    ]

    let MasterSubModuleList = [
      {
        Name: 'Unit Master',
        RouterLink: '/homepage/Website/Unit_Master',
        LogoPath: '/assets/icons/Unit Master.png',
      },
      {
        Name: 'Material Master',
        RouterLink: '/homepage/Website/Material_Master',
        LogoPath: '/assets/icons/Material Master.png',
      },
      {
        Name: 'Stage Master',
        RouterLink: '/homepage/Website/Stage_Master',
        LogoPath: '/assets/icons/Stage Master.png',
      },
      {
        Name: 'Sub Stage Master',
        RouterLink: '/homepage/Website/Sub_Stage_Master',
        LogoPath: '/assets/icons/Sub Stage Master.png',
      },
      {
        Name: 'Expense Type Master',
        RouterLink: '/homepage/Website/Expense_Type_Master',
        LogoPath: '/assets/icons/Expense Type.png',
      },
      // {
      //   Name: 'Account Main Ledger',
      //   RouterLink: '/homepage/Website/Account_Main_Ledger',
      //  LogoPath:'/assets/icons/Material Master.png',
      // },
      // {
      //   Name: 'Account Sub Ledger',
      //   RouterLink: '/homepage/Website/Account_Sub_Ledger',
      //  LogoPath:'/assets/icons/Material Master.png',
      // },
      {
        Name: 'Marketing Type Master',
        RouterLink: '/homepage/Website/Marketing_Type_Master',
        LogoPath: '/assets/icons/Marketing Type Master.png',
      },
      {
        Name: 'Vendor Service Master',
        RouterLink: '/homepage/Website/Vendor_Services_Master',
        LogoPath: '/assets/icons/Vendor Service Master.png',
      },
      {
        Name: 'Vendor Master',
        RouterLink: '/homepage/Website/Vendor_Master',
        LogoPath: '/assets/icons/Vendor Master.png',
      },
      // {
      //   Name: 'Vehicle Master',
      //   RouterLink: '/homepage/Website/Vehicle_Master',
      //  LogoPath:'/assets/icons/Material Master.png',
      // },
      {
        Name: 'Bank Account Master',
        RouterLink: '/homepage/Website/Bank_Account_Master',
        LogoPath: '/assets/icons/Bank Account Master.png',
      },
      {
        Name: 'Country Master',
        RouterLink: '/homepage/Website/Country',
        LogoPath: '/assets/icons/Country Master.png',
      },
      {
        Name: 'State Master',
        RouterLink: '/homepage/Website/State',
        LogoPath: '/assets/icons/State Master.png',
      },
      {
        Name: 'City Master',
        RouterLink: '/homepage/Website/City',
        LogoPath: '/assets/icons/Material Master.png',
      },
      {
        Name: 'Department Master',
        RouterLink: '/homepage/Website/Department_Master',
        LogoPath: '/assets/icons/Department Master.png',
      },
      {
        Name: 'Designation Master',
        RouterLink: '/homepage/Website/Designation_Master',
        LogoPath: '/assets/icons/Designation Master.png',
      },
      // {
      //   Name: 'User Role Master',
      //   RouterLink: '/homepage/Website/User_Role_Master',
      //  LogoPath:'/assets/icons/Material Master.png',
      // },
      {
        Name: 'User Role Right',
        RouterLink: '/homepage/Website/User_Role_Rights',
        LogoPath: '/assets/icons/Material Master.png',
      },
      // {
      //   Name: 'External Users',
      //   RouterLink: '/homepage/Website/External_Users',
      //  LogoPath:'/assets/icons/Material Master.png',
      // },
      {
        Name: 'Company Master',
        RouterLink: '/homepage/Website/Company_Master',
        LogoPath: '/assets/icons/Company Master.png',
      },
      {
        Name: 'Financial Year Master',
        RouterLink: '/homepage/Website/Financial_Year_Master',
        LogoPath: '/assets/icons/Financial Year Master.png',
      },
      {
        Name: 'Employee Master',
        RouterLink: '/homepage/Website/Employee_Master',
        LogoPath: '/assets/icons/Employee Master.png',
      },
      // {
      //   Name: 'Employee Appraisal Master',
      //   RouterLink: '/homepage/Website/Employee_Appraisal_Master',
      //  LogoPath:'/assets/icons/Employee Appraisal Master.png',
      // },
      // {
      //   Name: 'Employee Exit Master',
      //   RouterLink: '/homepage/Website/Employee_Exit_Master',
      //  LogoPath:'/assets/icons/Employee Exit Master.png',
      // },

    ]

    let SiteManagementSubModuleList = [
      {
        Name: 'New Site',
        RouterLink: '/homepage/Website/Site_Management',
        LogoPath: '/assets/icons/New Site.png',
      },
      {
        Name: 'Plot Details',
        RouterLink: '/homepage/Website/Plot_Master',
        LogoPath: '/assets/icons/Plot Details.png',
      },
      {
        Name: 'Actual Stage',
        RouterLink: '/homepage/Website/Actual_Stage',
        LogoPath: '/assets/icons/Actual Stages.png',
      },
      {
        Name: 'Estimate Stage',
        RouterLink: '/homepage/Website/Estimate_Stages',
        LogoPath: '/assets/icons/Estimated Stages.png',
      },
    ]

    let StockManagementSubModuleList = [
      {
        Name: 'Material Requisition',
        RouterLink: '/homepage/Website/Material_Requisition',
        LogoPath: '/assets/icons/Office Duty_Time.png',
      },
      {
        Name: 'Quotation',
        RouterLink: '/homepage/Website/Quotation',
        LogoPath: '/assets/icons/Office Duty_Time.png',
      },
      {
        Name: 'Stock Order',
        RouterLink: '/homepage/Website/Stock_Order',
        LogoPath: '/assets/icons/Office Duty_Time.png',
      },
      {
        Name: 'Stock Inward',
        RouterLink: '/homepage/Website/Stock_Inward',
        LogoPath: '/assets/icons/Office Duty_Time.png',
      },
      {
        Name: 'Stock Consume',
        RouterLink: '/homepage/Website/Stock_Consume',
        LogoPath: '/assets/icons/Office Duty_Time.png',
      },
      {
        Name: 'Stock Transfer',
        RouterLink: '/homepage/Website/Stock_Transfer',
        LogoPath: '/assets/icons/Office Duty_Time.png',
      },
    ]

    let CustomerManagementSubModuleList = [
      {
        Name: 'Customer Enquiry',
        RouterLink: '/homepage/Website/Customer_Enquiry',
        LogoPath: '/assets/icons/Customer Enquiry.png',
      },
      {
        Name: 'Customer Follow Up',
        RouterLink: '/homepage/Website/Customer_FollowUp',
        LogoPath: '/assets/icons/Customer Followup.png',
      },
      {
        Name: 'Pending Follow Up',
        RouterLink: '/homepage/Website/Pending_FollowUp',
        LogoPath: '/assets/icons/Customer Followup.png',
      },
      {
        Name: 'Registered Customer',
        RouterLink: '/homepage/Website/Registered_Customer',
        LogoPath: '/assets/icons/Registered Customer.png',
      }
    ]

    let GovernmentOfficeSubModuleList = [
      {
        Name: 'Site Work Group',
        RouterLink: '/homepage/Website/Site_Work_Group',
        LogoPath: '/assets/icons/Site Work Group.png',
      },
      {
        Name: 'Site Work Master',
        RouterLink: '/homepage/Website/Site_Work_Master',
        LogoPath: '/assets/icons/Site Work Master.png',
      },
      {
        Name: 'Site Work Done',
        RouterLink: '/homepage/Website/Site_Work_Done',
        LogoPath: '/assets/icons/Site Work Done.png',
      },
      {
        Name: 'Progress Report',
        RouterLink: '/homepage/Website/Site_Progress_Report',
        LogoPath: '/assets/icons/Progress Report.png',
      },
      {
        Name: 'Document List',
        RouterLink: '/homepage/Website/Document',
        LogoPath: '/assets/icons/Document List.png',
      },
      // {
      //   Name: 'Government Transaction',
      //   RouterLink: '/homepage/Website/Government_Transaction',
      //  LogoPath:'/assets/icons/Material Master.png',
      // },
    ]
    // let RegistrarOfficeSubModuleList = [
    //   {
    //     Name: 'Registrar Office',
    //     RouterLink: '/homepage/Website/Registrar_Office',
    //    LogoPath:'/assets/icons/Material Master.png',
    //   },
    // ]
    // let MarketingManagementSubModuleList = [
    //   {
    //     Name: 'Marketing Management',
    //     RouterLink: '/homepage/Website/Marketing_Management',
    //    LogoPath:'/assets/icons/Material Master.png',
    //   },
    // ]

    let HrPayrollManagement = [
      {
        Name: 'Office Duty & Time',
        RouterLink: '/homepage/Website/Office_Duty_Time',
        LogoPath: '/assets/icons/Office Duty_Time.png',
      },
      {
        Name: 'Attendance',
        RouterLink: '/homepage/Website/Attendance_Logs',
        LogoPath: '/assets/icons/Attendance.png',
      },
      {
        Name: 'Salary Generation',
        RouterLink: '/homepage/Website/Salary_Generation',
        LogoPath: '/assets/icons/Salary Genration.png',
      },
      {
        Name: 'Leave Approval',
        RouterLink: '/homepage/Website/Leave_Approval',
        LogoPath: '/assets/icons/Leave Approval.png',
      },
      {
        Name: 'Salary Slip Approval',
        RouterLink: '/homepage/Website/Salary_Slip_Approval',
        LogoPath: '/assets/icons/Salary Slip Approval.png',
      },
      {
        Name: 'Employee Overtime',
        RouterLink: '/homepage/Website/Employee_Overtime',
        LogoPath: '/assets/icons/Salary Slip Approval.png',
      },
      {
        Name: 'Company Holidays',
        RouterLink: '/homepage/Website/Company_Holidays',
        LogoPath: '/assets/icons/Salary Slip Approval.png',
      }

    ]

    // let StockManagement = [
    //   {
    //     Name: 'Material Requisition',
    //     RouterLink: '/homepage/Website/material_requisition',
    //     LogoPath: '/assets/icons/Office Duty_Time.png',
    //   },
    // ]

    let RequestSubModulelist = [
      {
        Name: 'Employee Attendance Logs',
        RouterLink: '/homepage/Website/Employee_Attendance_Logs',
        LogoPath: '/assets/icons/Employee Attendance Logs.png',
      },
      {
        Name: 'Leave Request',
        RouterLink: '/homepage/Website/Leave_Request',
        LogoPath: '/assets/icons/Leave Requests.png',
      },
      {
        Name: 'Salary Slip Request',
        RouterLink: '/homepage/Website/Salary_Slip_Request',
        LogoPath: '/assets/icons/Salary Slip Request.png',
      }
    ]
    // let RazorpaySubModulelist = [
    //   {
    //     Name: 'Razorpay',
    //     RouterLink: '/homepage/Website/Razorpay',
    //     LogoPath: '/assets/icons/Material Master.png',
    //   }
    // ]

    let moduleListInternal = [
      {
        Name: 'Dashboards',
        RouterLink: '/homepage/Website/',
        WhiteLogo: '/assets/icons/dashboard.png',
        // SubModuleList: DashboardsSubModuleList,
      },
      {
        Name: 'Master',
        RouterLink: '',
        WhiteLogo: '/assets/icons/Masters.png',
        SubModuleList: MasterSubModuleList,
      },
      {
        Name: 'Site Management',
        RouterLink: '',
        WhiteLogo: '/assets/icons/Site Management.png',
        SubModuleList: SiteManagementSubModuleList,
      },
      {
        Name: 'Customer Management',
        RouterLink: '',
        WhiteLogo: '/assets/icons/Customer-Management.png',
        SubModuleList: CustomerManagementSubModuleList,
      },
      {
        Name: 'Government Office',
        RouterLink: '',
        WhiteLogo: '/assets/icons/Government Office.png',
        SubModuleList: GovernmentOfficeSubModuleList,
      },
      {
        Name: 'Registrar Office',
        RouterLink: '/homepage/Website/Registrar_Office',
        WhiteLogo: '/assets/icons/Registrar Office.png',
        // SubModuleList: RegistrarOfficeSubModuleList,
      },
      {
        Name: 'Marketing Management',
        RouterLink: '/homepage/Website/Marketing_Management',
        WhiteLogo: '/assets/icons/Marketing Management.png',
        // SubModuleList: MarketingManagementSubModuleList,
      },
      {
        Name: 'Stock Management',
        RouterLink: '',
        WhiteLogo: '/assets/icons/Hr-Payroll Management.png',
        SubModuleList: StockManagementSubModuleList,
      },
      // {
      //   Name: 'Stock Management',
      //   RouterLink: '',
      //   WhiteLogo: '/assets/icons/Hr-Payroll Management.png',
      //   SubModuleList: StockManagement,
      // },
      {
        Name: 'Hr-Payroll Management',
        RouterLink: '',
        WhiteLogo: '/assets/icons/Hr-Payroll Management.png',
        SubModuleList: HrPayrollManagement,
      },
      {
        Name: 'Employee Request',
        RouterLink: '',
        WhiteLogo: '/assets/icons/Request.png',
        SubModuleList: RequestSubModulelist,
      },
      // {
      //   Name: 'RazorPay',
      //   RouterLink: '/homepage/Website/Razorpay',
      //   WhiteLogo: '/assets/icons/Razorpay.png',
      //   // SubModuleList: RazorpaySubModulelist,
      // },
    ]

    this.ModuleList = moduleListInternal;
  }

  openModal(): void {
    // const modalElement = document.getElementById('sidebarModal');
    // if (modalElement) {
    //   const modal = new Modal(modalElement);
    //   modal.show();
    // }
    this.isModalOpen = true;
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


  private async FormulateCompanyList() {
    let lst = await Company.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.CompnyList = lst;

    // Set default selection if there is no stored value
    this.ongetcompany();
  }

  async ongetcompany() {
    const storedCompanyRef = this.appStateManagement.StorageKey.getItem('SelectedCompanyRef');
    const storedCompanyName = this.appStateManagement.StorageKey.getItem('companyName');

    if (storedCompanyRef && storedCompanyName) {
      const ref = Number(storedCompanyRef);
      this.CompanyRef = ref;
      this.companystatemanagement.setCompanyRef(ref, storedCompanyName);
    } else if (this.CompnyList && this.CompnyList.length > 0) {
      // Select first company if no stored value is found
      const firstCompany = this.CompnyList[0];
      await this.changecompany(firstCompany.p.Ref); // Assuming changecompany is also async
    }
  }

  changecompany(ref: number) {
    const selectedCompany = this.CompnyList.find(company => company.p.Ref === ref);
    if (selectedCompany) {
      this.appStateManagement.StorageKey.setItem('SelectedCompanyRef', selectedCompany.p.Ref.toString());
      this.appStateManagement.StorageKey.setItem('companyName', selectedCompany.p.Name);

      this.companystatemanagement.setCompanyRef(ref, selectedCompany.p.Name);
      this.CompanyRef = ref;
    } else {
      console.warn('Selected company not found');
    }
  }

  //  private FormulateCompanyList = async () => {
  //     let lst = await Company.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  //     this.CompnyList = lst;
  //   }

  //   changecompany(ref: number) {
  //     const selectedCompany = this.CompnyList.find(company => company.p.Ref === ref);
  //     if (selectedCompany) {
  //       this.appStateManagement.StorageKey.setItem('SelectedCompanyRef',selectedCompany.p.Ref.toString());
  //       this.appStateManagement.StorageKey.setItem('companyName', selectedCompany.p.Name);
  //       this.companystatemanagement.setCompanyRef(ref, selectedCompany.p.Name);
  //     this.CompanyRef = ref;
  //     }else {
  //       console.warn('Selected company not found');
  //     }

  //   }

  //   ongetcompany(){
  //     const storedCompanyRef =  this.appStateManagement.StorageKey.getItem('SelectedCompanyRef');
  //     const storedCompanyName =  this.appStateManagement.StorageKey.getItem('companyName');
  //     if (storedCompanyRef && storedCompanyName) {
  //       const ref = Number(storedCompanyRef);
  //       this.CompanyRef = ref;
  //       this.companystatemanagement.setCompanyRef(ref, storedCompanyName);
  //     }
  //   }
}
