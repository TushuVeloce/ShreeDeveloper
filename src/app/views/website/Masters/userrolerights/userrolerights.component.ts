import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { UserRole } from 'src/app/classes/domain/entities/website/masters/userrole/userrole';
import { UserRoleRights } from 'src/app/classes/domain/entities/website/masters/userrolerights/userrolerights';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-userrolerights',
  standalone: false,
  templateUrl: './userrolerights.component.html',
  styleUrls: ['./userrolerights.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserrolerightsComponent implements OnInit {

  UserRoleList: UserRole[] = [];
  Entity: UserRoleRights = UserRoleRights.CreateNewInstance();
  MasterList: UserRoleRights[] = [];
  DisplayMasterList: UserRoleRights[] = [];
  SearchString: string = '';
  SelectedVehicle: UserRoleRights = UserRoleRights.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  ModuleList = DomainEnums.ModuleList(true, '--Select Module Type--');
  headers: string[] = ['Module Name','Add','Edit','Delete','View','Print','Exports',];
  modules: { name: string; add: boolean; edit: boolean; delete: boolean; view: boolean; print: boolean; exports: boolean }[] = [];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService) { }

  ngOnInit() {
    this.FormulateCountryList();
    this.loadRoleRightsFromStorage();
    console.log('Modules:', this.ModuleList);
    
  }


  private FormulateCountryList = async () => {
    let lst = await UserRole.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.UserRoleList = lst;
  }
  // New Code 
  
  mastermodules = [
    { name: 'Dashboard',add: false, edit: false, delete: false, view: false, print: false, exports: false },
    { name: 'User Management',add: false, edit: false, delete: false, view: false, print: false, exports: false},
    { name: 'Settings',add: false, edit: false, delete: false, view: false, print: false, exports: false},
  ];

  transactionsmodules = [
    { name: 'Dashboarddddd',add: false, edit: false, delete: false, view: false, print: false, exports: false },
    { name: 'User Managementtttt',add: false, edit: false, delete: false, view: false, print: false, exports: false},
    { name: 'Settingssss',add: false, edit: false, delete: false, view: false, print: false, exports: false},
  ];

  reportsmodules = [
    { name: 'DDDDDashboard',add: false, edit: false, delete: false, view: false, print: false, exports: false },
    { name: 'UUUUUser Management',add: false, edit: false, delete: false, view: false, print: false, exports: false},
    { name: 'SSSSSettings',add: false, edit: false, delete: false, view: false, print: false, exports: false},
  ];


  onclick(ref:number){
      if(ref == 0){
        this.modules = []
      }else if(ref == 100){
        this.modules = this.mastermodules
      }else if(ref == 200){
        this.modules = this.transactionsmodules    
      }else if(ref == 300){
        this.modules = this.reportsmodules    
  }
}

  updateRoleRights(index: number, right: keyof typeof this.modules[number]) {
    const module = this.modules[index];
    console.log(`Module: ${module.name}, Right: ${right}, Status: ${module[right]}`);

    // Build the inner object with module names as keys
    const masterEntry = this.modules.reduce((acc: any, mod) => {
      acc[mod.name] = {
        Add: mod.add,
        Edit: mod.edit,
        Delete: mod.delete,
        View: mod.view,
        Print: mod.print,
        Exports: mod.exports
      };
      return acc;
    }, {});
    
    const master = {
      Master: [masterEntry]
    };

    console.log('Master Object:', master);

    localStorage.setItem('userRoleRights', JSON.stringify(master));
  }

  loadRoleRightsFromStorage(): void {
    const storedData = localStorage.getItem('userRoleRights');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData?.Master?.length) {
        const masterEntry = parsedData.Master[0]; // Assuming only one master entry
  
        // Convert the master object back to the modules array
        this.modules = Object.keys(masterEntry).map(moduleName => ({
          name: moduleName,
          add: masterEntry[moduleName].Add,
          edit: masterEntry[moduleName].Edit,
          delete: masterEntry[moduleName].Delete,
          view: masterEntry[moduleName].View,
          print: masterEntry[moduleName].Print,
          exports: masterEntry[moduleName].Exports
        }));
        console.log('Loaded modules:', this.modules);
        
      }
    } else {
      console.log('No role rights data found in local storage.');
    }
  }

}
