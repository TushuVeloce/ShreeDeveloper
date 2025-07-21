import { Component, effect, OnInit, ViewEncapsulation } from '@angular/core';
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
  FeatureGroupList = DomainEnums.ApplicationFeatureGroupList(true, '-- Select Feature Group --');
  FeatureToGroupMapList = DomainEnums.FeatureToFeatureGroupMapList();

  FeatureGroupRef: number = 0;

  DepartmentRef: number = 0;
  hideEditDelete: boolean = false;

  // headers: string[] = ['Features', 'Add', 'Edit', 'Delete', 'View', 'Print', 'Exports',];
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

  IsReportDisplay: boolean = false;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  constructor(private uiUtils: UIUtils, private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private utils: Utils) {
    effect(() => {
      this.getDepartmentListByCompanyRef()
    });
  }

  async ngOnInit() {
    this.resetFeatureList()
  }

  resetFeatureList = () => {
    this.Feature = []
    if (this.FeatureToGroupMapList.length > 0) {
      this.FeatureToGroupMapList.forEach(e => {
        const item = new FeatureProps();
        item.FeatureRef = e.Ref;
        item.FeatureName = e.Name;
        item.FeatureGroupRef = e.FeatureGroupRef;
        // this.Entity.p.Feature.push(item)
        this.Feature.push(item)
      })
    }

  }

  private getDepartmentListByCompanyRef = async () => {
    this.DisplayMasterList = [];
    this.Entity.p.DepartmentRef = 0;
    this.Entity.p.DesignationRef = 0;
    this.FeatureGroupRef = 0;

    let lst = await Department.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DepartmentList = lst;
  }

  getDesignationByDepartmentRefList = async (departmentrRef: number) => {
    this.DesignationList = [];
    this.Entity.p.DesignationRef = 0
    this.DisplayFeature = [];
    this.FeatureGroupRef = 0;
    if (departmentrRef <= 0) {
      await this.uiUtils.showWarningToster(`Please Select Department`);
      return
    }
    let lst = await Designation.FetchEntireListByCompanyAndDepartmentRef(this.companyRef(), departmentrRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DesignationList = lst;
  }


  onFeatureGroupSelected = async (featureGroupRef: number) => {
    if (this.Entity.p.DepartmentRef <= 0) {
      await this.uiUtils.showWarningToster(`Please Select Department`);
      setTimeout(() => this.FeatureGroupRef = 0);
      return;
    }
    if (this.Entity.p.DesignationRef <= 0) {
      featureGroupRef = 0;
      await this.uiUtils.showWarningToster(`Please Select Designation`);
      setTimeout(() => this.FeatureGroupRef = 0);
      return;
    }

    if (featureGroupRef == 0) {
      await this.uiUtils.showWarningToster(`Please Select Feature`);
      setTimeout(() => this.FeatureGroupRef = 0);
      return;
    }

    this.hideEditDelete = (featureGroupRef === 30);

    this.DisplayFeature = []
    this.DisplayFeature = this.Feature.filter(e => e.FeatureGroupRef == featureGroupRef);
  }

  getUserRoleRights = async (departmentref: number, designationref: number) => {
    // For Fetching Data
    this.FeatureGroupRef = 0;
    this.DisplayFeature = []
    this.resetFeatureList()

    let lst = await UserRoleRight.FetchEntireListBydepartmentRef(departmentref, designationref, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.DisplayMasterList = lst;
    if (lst.length > 0) {
      lst.forEach(e => {
        e.p.Feature.forEach(f => {
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

    let entitiesToSave = [entityToSave]

    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);


    if (!tr.Successful) {
      // this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return
    }
    else {
      // this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('User Role Rights saved successfully');
        let departmentRef = this.Entity.p.DepartmentRef;
        let designationRef = this.Entity.p.DesignationRef;
        let featureGroupRef = this.FeatureGroupRef;
        this.Entity = UserRoleRight.CreateNewInstance();
        this.Entity.p.DepartmentRef = departmentRef;
        this.Entity.p.DesignationRef = designationRef;
        this.FeatureGroupRef = featureGroupRef

        // this.getUserRoleRights(departmentRef, designationRef);
        // this.onFeatureGroupSelected(featureGroupRef);

      } else {
        await this.uiUtils.showSuccessToster('User Role Rights Updated successfully');
      }
    }
  }
}
