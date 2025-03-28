import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Department } from 'src/app/classes/domain/entities/website/masters/department/department';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';


@Component({
  selector: 'app-registrar-office-detail',
  standalone: false,
  templateUrl: './registrar-office-detail.component.html',
  styleUrls: ['./registrar-office-detail.component.scss'],
})
export class RegistrarOfficeDetailComponent  implements OnInit {
  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  isChecked = false; // Default value
  Entity: Department = Department.CreateNewInstance();
  DetailsFormTitle: 'New Registrar Office' | 'Edit Registrar Office' = 'New Registrar Office';
  InitialEntity: Department = null as any;
  companyName = this.companystatemanagement.SelectedCompanyName;
  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils,private companystatemanagement: CompanyStateManagement) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
       if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
          this.IsNewEntity = false;
          this.DetailsFormTitle = this.IsNewEntity ? 'New Registrar Office' : 'Edit Registrar Office';
          this.Entity = Department.GetCurrentInstance();
          this.appStateManage.StorageKey.removeItem('Editable')
    
        } else {
          this.Entity = Department.CreateNewInstance();
          Department.SetCurrentInstance(this.Entity);
         
        }
        this.InitialEntity = Object.assign(Department.CreateNewInstance(),
        this.utils.DeepCopy(this.Entity)) as Department;      
   }

    SaveDepartmentMaster = async () => {
      this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
      this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
      let entityToSave = this.Entity.GetEditableVersion();
      console.log('entityToSave :', entityToSave);
      let entitiesToSave = [entityToSave]
      // await this.Entity.EnsurePrimaryKeysWithValidValues()
      let tr = await this.utils.SavePersistableEntities(entitiesToSave);
      if (!tr.Successful) {
        this.isSaveDisabled = false;
        this.uiUtils.showErrorMessage('Error',tr.Message);
        return
      }
      else {
        this.isSaveDisabled = false;
        // this.onEntitySaved.emit(entityToSave);
        if (this.IsNewEntity) {
          await this.uiUtils.showSuccessToster('Registrar Office saved successfully!');
          this.Entity = Department.CreateNewInstance();
        } else {
          await this.router.navigate(['/homepage/Website/Department_Master'])
          await this.uiUtils.showSuccessToster('Department Updated successfully!');
        }
      }
    }

  BackDepartment() {
    this.router.navigate(['/homepage/Website/Department_Master']);
  }

}
