import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Department } from 'src/app/classes/domain/entities/website/masters/department/department';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { UserRole } from 'src/app/classes/domain/entities/website/masters/userrole/userrole';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-employee-master-details',
  standalone: false,
  templateUrl: './employee-master-details.component.html',
  styleUrls: ['./employee-master-details.component.scss'],
})
export class EmployeeMasterDetailsComponent implements OnInit {

  Entity: Employee = Employee.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Employee' | 'Edit Employee' = 'New Employee';
  IsDropdownDisabled: boolean = false
  InitialEntity: Employee = null as any;

  UserRoleList: UserRole[] = [];
  DepartmentList: Department[] = [];
  GenderList = DomainEnums.GenderTypeList(true,"---Select Gender---");

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils) { }

  async ngOnInit() {

    this.UserRoleList = await UserRole.FetchEntireList();
    this.DepartmentList = await Department.FetchEntireList();

    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity ? 'New Employee' : 'Edit Employee';
      this.Entity = Employee.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = Employee.CreateNewInstance();
      Employee.SetCurrentInstance(this.Entity);

    }
    this.InitialEntity = Object.assign(Employee.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)) as Employee;
    // this.focusInput();
  }


  SaveEmployeeMaster = async () => {
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
        await this.uiUtils.showSuccessToster('Employee saved successfully!');
        this.Entity = Employee.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Employee Updated successfully!');
      }
    }
  }

  BackEmployee() {
    this.router.navigate(['/homepage/Website/Employee_Master']);
  }

  // Remaining 

  LoginStatusRef: number = 0;
  LoginStatusList: string[] = ['Enable','Disable'];
  getLoginStatusRef(Ref:any) {
  }

}
