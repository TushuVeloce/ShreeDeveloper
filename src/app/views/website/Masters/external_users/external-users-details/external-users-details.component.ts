import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Department } from 'src/app/classes/domain/entities/website/masters/department/department';
import { ExternalUsers } from 'src/app/classes/domain/entities/website/masters/externalusers/externalusers';
import { UserRole } from 'src/app/classes/domain/entities/website/masters/userrole/userrole';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-external-users-details',
  standalone: false,
  templateUrl: './external-users-details.component.html',
  styleUrls: ['./external-users-details.component.scss'],
})
export class ExternalUsersMasterDetailsComponent implements OnInit {

  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: ExternalUsers = ExternalUsers.CreateNewInstance();
  DetailsFormTitle: 'New External User' | 'Edit External User' = 'New External User'
  InitialEntity: ExternalUsers = null as any;
  UserRoleList: UserRole[] = [];
  DepartmentList: Department[] = [];
  companyName = this.companystatemanagement.SelectedCompanyName;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement)  {
      effect(() => {
        this.getDepartmentListByCompanyRef()
        this.getUserRoleListByCompanyRef()
      });
     }
  

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true)
    // this.UserRoleList = await UserRole.FetchEntireList();
    // this.DepartmentList = await Department.FetchEntireList();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New External User' : 'Edit External User';
      this.Entity = ExternalUsers.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')
    } else {
      this.Entity = ExternalUsers.CreateNewInstance();
      ExternalUsers.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(ExternalUsers.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)) as ExternalUsers;
    // this.focusInput();
  }


  getDepartmentListByCompanyRef = async () => {
      let lst = await Department.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.DepartmentList = lst;
  }

  getUserRoleListByCompanyRef = async () => {
    let lst = await UserRole.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.UserRoleList = lst;
}

  SaveExternalUserMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave]
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorToster(tr.Message);
      return
    }
    else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('External User saved successfully!');
        this.Entity = ExternalUsers.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('External User Updated successfully!');
      }
    }
  }

  BackExternalUser() {
    this.router.navigate(['/homepage/Website/External_Users']);
  }

}
