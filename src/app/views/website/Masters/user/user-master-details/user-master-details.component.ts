import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Department } from 'src/app/classes/domain/entities/website/masters/department/department';
import { User } from 'src/app/classes/domain/entities/website/masters/user/user';
import { UserRole } from 'src/app/classes/domain/entities/website/masters/userrole/userrole';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-user-master-details',
  standalone: false,
  templateUrl: './user-master-details.component.html',
  styleUrls: ['./user-master-details.component.scss'],
})
export class UserMasterDetailsComponent implements OnInit {

  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: User = User.CreateNewInstance();
  DetailsFormTitle: 'New User' | 'Edit User' = 'New User';
  InitialEntity: User = null as any;
  UserRoleList: UserRole[] = [];
  DepartmentList: Department[] = [];

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }


  async ngOnInit() {
    this.UserRoleList = await UserRole.FetchEntireList();
    this.DepartmentList = await Department.FetchEntireList();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity ? 'New User' : 'Edit User';
      this.Entity = User.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = User.CreateNewInstance();
      User.SetCurrentInstance(this.Entity);

    }
    this.InitialEntity = Object.assign(User.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)) as User;
    // this.focusInput();
  }

  SaveUserMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    // this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
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
        await this.uiUtils.showSuccessToster('User saved successfully!');
        this.Entity = User.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('User Updated successfully!');
      }
    }
  }

  BackUser() {
    this.router.navigate(['/homepage/Website/User_Master']);
  }

}
