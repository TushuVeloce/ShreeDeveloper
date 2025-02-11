import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/classes/domain/entities/website/masters/userrole/userrole';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-user-role-master-details',
  standalone: false,
  templateUrl: './user-role-master-details.component.html',
  styleUrls: ['./user-role-master-details.component.scss'],
})
export class UserRoleMasterDetailsComponent  implements OnInit {

  Entity: UserRole = UserRole.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New User Role' | 'Edit User Role' = 'New User Role';
  IsDropdownDisabled: boolean = false
  InitialEntity: UserRole = null as any;


  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils) { }

  ngOnInit() {

    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New User Role' : 'Edit User Role';
      this.Entity = UserRole.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = UserRole.CreateNewInstance();
      UserRole.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(UserRole.CreateNewInstance(),
    this.utils.DeepCopy(this.Entity)) as UserRole;
    this.focusInput();
  }

  SaveUserRole = async () => {
    this.isSaveDisabled = true;
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
        await this.uiUtils.showSuccessToster('User Role saved successfully!');
        this.Entity = UserRole.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('User Role Updated successfully!');
      }

    }
  }

  focusInput = () => {
    let txtName = document.getElementById('Name')!;
    txtName.focus();
  }

  BackUserRole(){
    this.router.navigate(['/homepage/Website/User_Role_Master']);
   }

}
