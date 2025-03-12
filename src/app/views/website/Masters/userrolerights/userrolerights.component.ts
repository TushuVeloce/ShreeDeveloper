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

  DepartmentRef: number = 0;

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
  Feature: FeatureProps[] = [];

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  constructor(private uiUtils: UIUtils, private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private utils: Utils) { }

  async ngOnInit() {
    console.log(this.FeatureToGroupMapList);
    this.resetFeatureList()
    this.FormulateDepartmentList();
    this.FormulateDesignationList();
    // this.mastermodules.forEach(e => this.Entity.p.Feature.push(e as any));
    // this.loadRoleRightsFromStorage();
    console.log('Modules:', this.ModuleList);
  }

  resetFeatureList = () => {
    debugger
    this.Feature = []
    if (this.FeatureToGroupMapList.length > 0) {
      debugger
      this.FeatureToGroupMapList.forEach(e => {
        const item = new FeatureProps();
        item.FeatureRef = e.Ref;
        item.FeatureName = e.Name;
        item.FeatureGroupRef = e.FeatureGroupRef;
        // this.Entity.p.Feature.push(item)
        this.Feature.push(item)
      })
    }
    console.log(this.Feature);

  }


  private FormulateDepartmentList = async () => {
    // this.DisplayMasterList = []
    let lst = await Department.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DepartmentList = lst;
  }
  private FormulateDesignationList = async () => {

    let lst = await Designation.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DesignationList = lst;

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
    this.DisplayFeature = this.Feature.filter(e => e.FeatureGroupRef == featureGroupRef);
    // console.log(this.DisplayFeature);
  }

  getUserRoleRights = async (departmentref: number, designationref: number) => {
    debugger
    // For Fetching Data 
    let lst = await UserRoleRight.FetchEntireListBydepartmentRef(departmentref, designationref, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = lst;
    this.resetFeatureList()
    console.log(this.DisplayMasterList);
    this.DisplayFeature = []
    if (lst.length > 0) {
      lst.forEach(e => {
        e.p.Feature.forEach(f => {
          debugger
          let mod = this.Feature.find(m => m.FeatureRef == f.FeatureRef);
          if (mod) {
            mod.CanAdd = f.CanAdd;
            mod.CanEdit = f.CanEdit;
            mod.CanDelete = f.CanDelete;
            mod.CanView = f.CanView;
            mod.CanPrint = f.CanPrint;
            mod.CanExport = f.CanExport;
          }
        });
      });
      this.DisplayFeature = this.Feature;
    }

  }


  SaveUserRoleRights = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.Feature = this.DisplayFeature;
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


  // private FormulateDepartmentList = async () => {
  //   this.DisplayMasterList = []
  //   let lst = await Department.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  //   this.DepartmentList = lst;
  //   if (this.DepartmentList.length > 0) {
  //     let departmentrRef = this.appStateManage.getDepartmentRef();
  //     let isDepartmentListFound = this.DepartmentList.filter(e => e.p.Ref == departmentrRef);
  //     if (this.appStateManage.getDepartmentRef() > 0 && isDepartmentListFound.length > 0) {
  //       this.DepartmentRef = departmentrRef;
  //       await this.getDesignationByDepartmentRefList(departmentrRef);
  //     }
  //     else{
  //       this.DepartmentRef = this.DepartmentList[0].p.Ref;
  //     }
  //   }
  //   console.log('DepartmentList :', this.DepartmentList);
  // }

  // private getDesignationByDepartmentRefList = async (departmentrRef: number) => {
  //   this.DepartmentList = [];
  //   this.DepartmentList = [];
  //   if (departmentrRef <= 0) {
  //     await this.uiUtils.showWarningToster(`Please Select Department`);
  //     return
  //   }
  //   this.appStateManage.setDepartmentRef(departmentrRef);
  //   let lst = await Designation.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  //   this.DesignationList = lst;
  //   if (this.DesignationList.length > 0) {
  //     let designationref = this.appStateManage.getDesignationRef();
  //     let designationRefFound = this.DesignationList.filter(e=> e.p.Ref == designationref);

  //   }
  //   else{
  //     this.Entity.p.DesignationRef = this.DesignationList[0].p.Ref;
  //   }

  //   console.log('DesignationList :', this.DesignationList);
  // }
}
