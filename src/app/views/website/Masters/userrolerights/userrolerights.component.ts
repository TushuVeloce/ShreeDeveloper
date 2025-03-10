import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Department } from 'src/app/classes/domain/entities/website/masters/department/department';
import { Designation } from 'src/app/classes/domain/entities/website/masters/designation/designation';
import { UserRole } from 'src/app/classes/domain/entities/website/masters/userrole/userrole';
import { FeatureProps, UserRoleRight } from 'src/app/classes/domain/entities/website/masters/userrolerights/userrolerights';
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
  Entity: UserRoleRight = UserRoleRight.CreateNewInstance();
  private IsNewEntity: boolean = true;
  MasterList: UserRoleRight[] = [];
  DisplayMasterList: UserRoleRight[] = [];
  DepartmentList: Department[] = [];
  DesignationList: Designation[] = [];
  SearchString: string = '';
  SelectedVehicle: UserRoleRight = UserRoleRight.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  ModuleList = DomainEnums.ModuleList(true, '--Select Module Type--');
  FeatureGroupList = DomainEnums.ApplicationFeatureGroupList(true, '--Select Feature Group--');
  FeatureToGroupMapList = DomainEnums.FeatureToFeatureGroupMapList();

  FeatureGroupRef: number = 0;

  headers: string[] = ['Features', 'Add', 'Edit', 'Delete', 'View', 'Print', 'Exports',];
  // modules: { FeatureName: string; CanAdd: boolean; CanEdit: boolean; CanDelete: boolean; CanView: boolean; CanPrint: boolean; CanExport: boolean }[] = [{
  //   FeatureName: '',
  //   CanAdd: false,
  //   CanEdit: false,
  //   CanDelete: false,
  //   CanView: false,
  //   CanPrint: false,
  //   CanExport: false
  // }];
  // Feature: FeatureO[] = [];
  DisplayFeature: FeatureProps[] = [];

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  constructor(private uiUtils: UIUtils, private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private utils: Utils) { }

  async ngOnInit() {
    console.log(this.FeatureToGroupMapList);

    if (this.FeatureToGroupMapList.length > 0) {
      this.FeatureToGroupMapList.forEach(e => {
        const item = new FeatureProps();
        item.FeatureRef = e.Ref;
        item.FeatureName = e.Name;
        item.FeatureGroupRef = e.FeatureGroupRef;
        this.Entity.p.Feature.push(item)
      })
    }
    console.log(this.Entity.p.Feature);


    this.FormulateDepartmentList();
    this.FormulateDesignationList();
    // this.mastermodules.forEach(e => this.Entity.p.Feature.push(e as any));
    // this.loadRoleRightsFromStorage();
    console.log('Modules:', this.ModuleList);
  }


  private FormulateDepartmentList = async () => {
    let lst = await Department.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DepartmentList = lst;
    console.log('DepartmentList :', this.DepartmentList);
  }
  private FormulateDesignationList = async () => {
    let lst = await Designation.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DesignationList = lst;
    console.log('DesignationList :', this.DesignationList);
  }



  async onclick(featureGroupRef: number) {
    if (this.Entity.p.DepartmentRef <= 0) {
      alert("Please select Department.");
      setTimeout(() => this.FeatureGroupRef = 0);
      return;
    }
    if (this.Entity.p.DesignationRef <= 0) {
      alert("Please select Designation.");
      setTimeout(() => this.FeatureGroupRef = 0);
      return;
    }

    if (featureGroupRef == 0) {
      alert("Select Feature Group");
      setTimeout(() => this.FeatureGroupRef = 0);
      return;
    }

    this.DisplayFeature = []
    this.DisplayFeature = this.Entity.p.Feature.filter(e => e.FeatureGroupRef == featureGroupRef);
    console.log(this.DisplayFeature);
  }

  getUserRoleRights = async (departmentref: number, designationref: number) => {
    // For Fetching Data 
    let lst = await UserRoleRight.FetchEntireListByUserRoleRef(departmentref, designationref, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = lst;
    console.log(this.DisplayMasterList);

  }


  SaveUserRoleRights = async () => {
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
        this.Entity = UserRoleRight.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('User Role Rights Updated successfully!');
      }
    }
  }
}
