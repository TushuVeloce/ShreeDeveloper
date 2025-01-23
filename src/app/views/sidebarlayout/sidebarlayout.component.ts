import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';
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

interface SubModule {
  Name: string;
  RouterLink: string;
}

interface module {
  Name: string;
  RouterLink: string;
  WhiteLogo: string;
  BlackLogo: string;
  SubModuleList: SubModule[];
}


@Component({
  selector: 'app-sidebarlayout',
  templateUrl: './sidebarlayout.component.html',
  styleUrls: ['./sidebarlayout.component.scss'],
  imports: [  CommonModule, RouterLink, RouterOutlet, NzIconModule, NzLayoutModule,
    NzMenuModule, NzDropDownModule, NzModalModule, FormsModule]
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

  Name: string = 'Veloce Tech';

  previousActiveSubmodule: string | null = null; // Tracks the active module
  previousActiveModule: string | null = null; // Tracks the active module
  @ViewChild('menuDiv', { static: true }) menuDiv!: ElementRef;

  previousRoute: string = '';

  constructor(public router: Router, public themeService: ThemeService, private el: ElementRef, private renderer: Renderer2,
    private appStateManagement: AppStateManageService,
    private sessionValues: SessionValues, private cdr: ChangeDetectorRef,
    private uiUtils: UIUtils,) {

    this.routerChangedSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousRoute = this.currentRoute;
        this.currentRoute = event.urlAfterRedirects;
        this.updateActiveModuleAndSubmodule(); // Update the active module and submodule
      }
    });
  }
  ModuleList: module[] = [];
  BrowserBack: boolean = false;
  ngOnInit() {
    this.isDarkMode = this.appStateManagement.getTheme() === 'dark';
    this.onThemeToggle();

    this.GenerateAndSetMenuItemModuleList();
    this.isDarkMode = this.appStateManagement.getTheme() === 'dark'
    this.onThemeToggle();

    // Listen to browser back button events
    // this.location.subscribe(event => {
    //   if (event.pop) {
    //     this.BrowserBack = true; // Flag browser back event
    //     this.resetSelectedMenu();
    //   }
    // });
    console.log(this.ModuleList);
    
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
    // await this.uiUtils.askForConfirmation('Log Out', 'Are you sure you want to Log Out?',
    //   async () => {
    //     let req = new UserLogoutRequest();
    //     req.LoginToken = this.sessionValues.CurrentLoginToken;
    //     let _ = await this.serverCommunicator.LogoutUser(req)
    //     await this.router.navigate(['/']);
    //   });
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
        Name: 'Material Master',
        RouterLink: '/homepage/Website/Material_Master',
        LogoPath: '',
      },
      {
        Name: 'Stage Master',
        RouterLink: '/homepage/hotel/ambiance_automation_live_status',
        LogoPath: '',
      },
    ]

    let UserManagementSubModuleList = [
      {
        Name: 'Projects',
        RouterLink: '/homepage/hotel/project_master',
        LogoPath: '',
      },
      {
        Name: 'Users',
        RouterLink: '/homepage/hotel/user_master',
        LogoPath: '',
      },
    ]

    let RoomInventorySubModuleList = [
      {
        Name: 'Space Groups',
        RouterLink: '/homepage/hotel/space_groups',
        LogoPath: '',
      },
      {
        Name: 'Space Types',
        RouterLink: '/homepage/hotel/space_types',
        LogoPath: '',
      },
    ]

    let TelevisionInventrySubModuleList = [
      {
        Name: 'Television Sets',
        RouterLink: '/homepage/hotel/television_master',
        LogoPath: '',
      },
    ]

    let moduleListInternal = [
      {
        Name: 'Dashboards',
        RouterLink: '',
        BlackLogo: '/assets/icons/mastersdark.png',
        WhiteLogo: '/assets/icons/masterswhite.png',
        SubModuleList: DashboardsSubModuleList,
      }, {
        Name: 'User Management',
        RouterLink: '',
        BlackLogo: '/assets/icons/mastersdark.png',
        WhiteLogo: '/assets/icons/masterswhite.png',
        SubModuleList: UserManagementSubModuleList,
      },
      {
        Name: 'Room Inventory',
        RouterLink: '',
        BlackLogo: '/assets/icons/companydark.png',
        WhiteLogo: '/assets/icons/companywhite.png',
        SubModuleList: RoomInventorySubModuleList,
      },
      {
        Name: 'Room Inventory',
        RouterLink: '',
        BlackLogo: '/assets/icons/companydark.png',
        WhiteLogo: '/assets/icons/companywhite.png',
        SubModuleList: TelevisionInventrySubModuleList,
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
}
