import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { EmployeeAppraisal } from 'src/app/classes/domain/entities/website/masters/employeeappraisal/employeeappraisal';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';


@Component({
  selector: 'app-employee-appraisal-details',
  standalone: false,
  templateUrl: './employee-appraisal-details.component.html',
  styleUrls: ['./employee-appraisal-details.component.scss'],
})
export class EmployeeAppraisalDetailsComponent implements OnInit {
  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: EmployeeAppraisal = EmployeeAppraisal.CreateNewInstance();
  DetailsFormTitle: 'New Employee Appraisal' | 'Edit Employee Appraisal' = 'New Employee Appraisal';
  InitialEntity: EmployeeAppraisal = null as any;
  EmployeeList: Employee[] = [];
  companyName = this.companystatemanagement.SelectedCompanyName;
  companyRef = this.companystatemanagement.SelectedCompanyRef; constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }

  async ngOnInit() {
    this.getEmployeeListByCompanyRef()
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Employee Appraisal' : 'Edit Employee Appraisal';
      this.Entity = EmployeeAppraisal.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = EmployeeAppraisal.CreateNewInstance();
      EmployeeAppraisal.SetCurrentInstance(this.Entity);

    }
    this.InitialEntity = Object.assign(EmployeeAppraisal.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)) as EmployeeAppraisal;
  }

  getEmployeeListByCompanyRef = async () => {
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
  }

  SaveEmployeeAppraisalMaster = async () => {
    this.isSaveDisabled = true;
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave]
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return
    }
    else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Employee Appraisal saved successfully');
        this.Entity = EmployeeAppraisal.CreateNewInstance();
      } else {
        await this.router.navigate(['/homepage/Website/Employee_Appraisal_Master'])
        await this.uiUtils.showSuccessToster('Employee Appraisal Updated successfully');
      }
    }
  }

  BackEmployeeAppraisal = () => {
    this.router.navigate(['/homepage/Website/Employee_Appraisal_Master']);
  }

}
