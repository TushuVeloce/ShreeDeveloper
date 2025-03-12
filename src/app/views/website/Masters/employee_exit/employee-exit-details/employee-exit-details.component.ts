import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { EmployeeExit } from 'src/app/classes/domain/entities/website/masters/employeeexit/employeeexit';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-employee-exit-details',
  standalone:false,
  templateUrl: './employee-exit-details.component.html',
  styleUrls: ['./employee-exit-details.component.scss'],
})
export class EmployeeExitDetailsComponent  implements OnInit {
  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: EmployeeExit = EmployeeExit.CreateNewInstance();
  DetailsFormTitle: 'New Employee Exit' | 'Edit Employee Exit' = 'New Employee Exit';
  InitialEntity: EmployeeExit = null as any;
  EmployeeList: Employee[] = [];
  companyName = this.companystatemanagement.SelectedCompanyName;
  companyRef = this.companystatemanagement.SelectedCompanyRef;  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils,private companystatemanagement: CompanyStateManagement) { }

  async ngOnInit() {
   this.getEmployeeListByCompanyRef()
    this.appStateManage.setDropdownDisabled(true);
       if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
          this.IsNewEntity = false;
          this.DetailsFormTitle = this.IsNewEntity ? 'New Employee Exit' : 'Edit Employee Exit';
          this.Entity = EmployeeExit.GetCurrentInstance();
          this.appStateManage.StorageKey.removeItem('Editable')
    
        } else {
          this.Entity = EmployeeExit.CreateNewInstance();
          EmployeeExit.SetCurrentInstance(this.Entity);
         
        }
        this.InitialEntity = Object.assign(EmployeeExit.CreateNewInstance(),
        this.utils.DeepCopy(this.Entity)) as EmployeeExit;      
   }

    getEmployeeListByCompanyRef = async () => {
         let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
         this.EmployeeList = lst;
     }

    SaveEmployeeExitMaster = async () => {
      this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
      this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
      let entityToSave = this.Entity.GetEditableVersion();
      console.log('entityToSave :', entityToSave);
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
          await this.uiUtils.showSuccessToster('Employee Exit saved successfully!');
          this.Entity = EmployeeExit.CreateNewInstance();
        } else {
          await this.router.navigate(['/homepage/Website/Employee_Exit_Master'])
          await this.uiUtils.showSuccessToster('Employee Exit Updated successfully!');
        }
      }
    }

  BackEmployeeExit() {
    this.router.navigate(['/homepage/Website/Employee_Exit_Master']);
  }

}