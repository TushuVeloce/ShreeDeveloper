import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { UserRole } from 'src/app/classes/domain/entities/website/masters/userrole/userrole';
import { UserRoleRights } from 'src/app/classes/domain/entities/website/masters/userrolerights/userrolerights';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

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
  private IsNewEntity: boolean = true;
  MasterList: UserRoleRights[] = [];
  DisplayMasterList: UserRoleRights[] = [];
  SearchString: string = '';
  SelectedVehicle: UserRoleRights = UserRoleRights.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  ModuleList = DomainEnums.ModuleList(true, '--Select Module Type--');
  headers: string[] = ['Module Name', 'Add', 'Edit', 'Delete', 'View', 'Print', 'Exports',];
  modules: { FeatureName: string; CanAdd: boolean; CanEdit: boolean; CanDelete: boolean; CanView: boolean; CanPrint: boolean; CanExport: boolean }[] = [];

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  constructor(private uiUtils: UIUtils, private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private utils: Utils) { }

  async ngOnInit() {
    this.FormulateUserRoleList();
    this.mastermodules.forEach(e => this.Entity.p.Feature.push(e as any));
    // this.loadRoleRightsFromStorage();
    console.log('Modules:', this.ModuleList);

    let lst = await UserRoleRights.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;

  }


  private FormulateUserRoleList = async () => {
    let lst = await UserRole.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.UserRoleList = lst;
    console.log('UserRoleList :', this.UserRoleList);

  }
  // New Code 

  mastermodules = [
    { FeatureName: 'Department Master', CanAdd: false, CanEdit: false, CanDelete: false, CanView: false, CanPrint: false, CanExport: false },
    { FeatureName: 'Material Master', CanAdd: false, CanEdit: false, CanDelete: false, CanView: false, CanPrint: false, CanExport: false },
    { FeatureName: 'Stage Master', CanAdd: false, CanEdit: false, CanDelete: false, CanView: false, CanPrint: false, CanExport: false },
    { FeatureName: 'Marketing Master', CanAdd: false, CanEdit: false, CanDelete: false, CanView: false, CanPrint: false, CanExport: false },
    { FeatureName: 'Vendor Master', CanAdd: false, CanEdit: false, CanDelete: false, CanView: false, CanPrint: false, CanExport: false },
    { FeatureName: 'Vehicle Master', CanAdd: false, CanEdit: false, CanDelete: false, CanView: false, CanPrint: false, CanExport: false },
    { FeatureName: 'User Master', CanAdd: false, CanEdit: false, CanDelete: false, CanView: false, CanPrint: false, CanExport: false },
    // { Feature: 'Department Master', add: false, edit: false, delete: false, view: false, print: false, exports: false },
    // { Feature: 'User Role Master', add: false, edit: false, delete: false, view: false, print: false, exports: false },
    // { Feature: 'Employee Master', add: false, edit: false, delete: false, view: false, print: false, exports: false },
  ];

  transactionsmodules = [
    { FeatureName: 'Account Transactions', CanAdd: false, CanEdit: false, CanDelete: false, CanView: false, CanPrint: false, CanExport: false },
    { FeatureName: 'Expense Transactions', CanAdd: false, CanEdit: false, CanDelete: false, CanView: false, CanPrint: false, CanExport: false },
    { FeatureName: 'Income Transactions', CanAdd: false, CanEdit: false, CanDelete: false, CanView: false, CanPrint: false, CanExport: false },
  ];

  reportsmodules = [
    { FeatureName: 'Billing Report', CanAdd: false, CanEdit: false, CanDelete: false, CanView: false, CanPrint: false, CanExport: false },
    { FeatureName: 'Office Report', CanAdd: false, CanEdit: false, CanDelete: false, CanView: false, CanPrint: false, CanExport: false },
    { FeatureName: 'Stock Report', CanAdd: false, CanEdit: false, CanDelete: false, CanView: false, CanPrint: false, CanExport: false },
    { FeatureName: 'CRM Report', CanAdd: false, CanEdit: false, CanDelete: false, CanView: false, CanPrint: false, CanExport: false },
    { FeatureName: 'Booking Report', CanAdd: false, CanEdit: false, CanDelete: false, CanView: false, CanPrint: false, CanExport: false },
    // { Feature: 'Billing Report', add: false, edit: false, delete: false, view: false, print: false, exports: false },
    // { Feature: 'Office Report', add: false, edit: false, delete: false, view: false, print: false, exports: false },
    // { Feature: 'Stock Report', add: false, edit: false, delete: false, view: false, print: false, exports: false },
    // { Feature: 'CRM Report', add: false, edit: false, delete: false, view: false, print: false, exports: false },
    // { Feature: 'Booking Report', add: false, edit: false, delete: false, view: false, print: false, exports: false },
    // { Feature: 'Follow Up Report', add: false, edit: false, delete: false, view: false, print: false, exports: false },
    // { Feature: 'Employee Report', add: false, edit: false, delete: false, view: false, print: false, exports: false },
    // { Feature: 'Marketing Report', add: false, edit: false, delete: false, view: false, print: false, exports: false },
    // { Feature: 'Stages Report', add: false, edit: false, delete: false, view: false, print: false, exports: false },
    // { Feature: 'Account Report', add: false, edit: false, delete: false, view: false, print: false, exports: false },
  ];


  onclick(ref: number) {
    if (ref == 0) {
      this.modules = []
    } else if (ref == 100) {
      this.modules = this.mastermodules
    } else if (ref == 200) {
      this.modules = this.transactionsmodules
    } else if (ref == 300) {
      this.modules = this.reportsmodules
    }
  }

  updateRoleRights(index: number, right: keyof typeof this.modules[number]) {
    const module = this.modules[index];
    console.log(`Module: ${module.FeatureName}, Right: ${right}, Status: ${module[right]}`);


    // Build the updated JSON structure
    // const roleRightsObject = {
    //   Ref: 0,
    //   UserRoleRef: 1,
    //   CompanyRef: 1,
    //   Entries: {
    //     Master: this.mastermodules.map(mod => ({
    //       Feature: mod.Feature,
    //       Add: mod.CanAdd,
    //       Edit: mod.edit,
    //       Delete: mod.delete,
    //       View: mod.view,
    //       Print: mod.print,
    //       Exports: mod.exports
    //     }))
    //   }
    // };
    // console.log('Updated Role Rights Object:', roleRightsObject);
    // localStorage.setItem('userRoleRights', JSON.stringify(roleRightsObject));
  }

  // loadRoleRightsFromStorage(): void {
  //   const storedData = localStorage.getItem('userRoleRights');
  //   // console.log('Stored Data:', storedData);

  //   if (storedData) {
  //     const parsedData = JSON.parse(storedData);
  //     if (parsedData?.Master?.length) {
  //       const masterEntry = parsedData.Master[0]; // Assuming only one master entry

  //       // Convert the master object back to the modules array
  //       this.modules = Object.keys(masterEntry).map(moduleName => ({
  //         name: moduleName,
  //         add: masterEntry[moduleName].Add,
  //         edit: masterEntry[moduleName].Edit,
  //         delete: masterEntry[moduleName].Delete,
  //         view: masterEntry[moduleName].View,
  //         print: masterEntry[moduleName].Print,
  //         exports: masterEntry[moduleName].Exports
  //       }));
  //       console.log('Loaded modules:', this.modules);

  //     }
  //   } else {
  //     console.log('No role rights data found in local storage.');
  //   }
  // }

  SaveUserRoleRights = async () => {
    // this.modules.forEach(e=> this.Entity.p.Feature.push(e as any));
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    // this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    let entityToSave = this.Entity.GetEditableVersion();
    console.log('Entity to Save:', entityToSave);


    let entitiesToSave = [entityToSave]
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      // this.isSaveDisabled = false;
      this.uiUtils.showErrorToster(tr.Message);
      return
    }
    else {
      // this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('User Role Rights saved successfully!');
        this.Entity = UserRoleRights.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('User Role Rights Updated successfully!');
      }
    }
  }

  getUserRoleRights = async (UserRoleRef: number) => {
    if (UserRoleRef <= 0) {
      await this.uiUtils.showErrorToster('Select User Role');
      return;
    }
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Select Company');
      return;
    }
    let lst = await UserRoleRights.FetchEntireListByUserRoleRef(UserRoleRef, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = lst;
    console.log('UserRoleSelected :', this.DisplayMasterList);
}



}