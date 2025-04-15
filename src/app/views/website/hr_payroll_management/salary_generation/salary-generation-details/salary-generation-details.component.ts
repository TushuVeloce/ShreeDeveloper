import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { SalaryGeneration } from 'src/app/classes/domain/entities/website/HR_and_Payroll/Salary_Generation/salarygeneration';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-salary-generation-details',
  standalone: false,
  templateUrl: './salary-generation-details.component.html',
  styleUrls: ['./salary-generation-details.component.scss'],
})
export class SalaryGenerationDetailsComponent implements OnInit {
  Entity: SalaryGeneration = SalaryGeneration.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Salary' | 'Edit Salary' = 'New Salary';
  IsDropdownDisabled: boolean = false;
  InitialEntity: SalaryGeneration = null as any;
  EmployeeList: Employee[] = [];
  MonthList = DomainEnums.MonthList(true, '---Select Month---');
  companyName = this.companystatemanagement.SelectedCompanyName;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }

  ngOnInit() {
    this.getEmployeeListByCompanyRef()
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity? 'New Salary': 'Edit Salary';
      this.Entity = SalaryGeneration.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    } else {
      this.Entity = SalaryGeneration.CreateNewInstance();
      SalaryGeneration.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      SalaryGeneration.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as SalaryGeneration;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('EmployeeRef')!;
    txtName.focus();
  }

  getEmployeeListByCompanyRef = async () => {
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
  }

  calculategrosstotal = ()=>{
    const GrossTotal = Math.ceil(this.Entity.p.BasicSalary + this.Entity.p.TotalAllowance + this.Entity.p.TotalIncentive + this.Entity.p.Other)
     this.Entity.p.GrossTotal = GrossTotal
     this.calculatenetsalary()
  }

  calculatetotaldeduction = ()=>{
    const TotalDeduction = Math.ceil(this.Entity.p.TDS + this.Entity.p.PF + this.Entity.p.TotalLeaveDeduction + this.Entity.p.AdvancePayment)
     this.Entity.p.TotalDeduction = TotalDeduction
     this.calculatenetsalary()
  }

  calculatenetsalary = ()=>{
    const NetSalary = Math.ceil(this.Entity.p.GrossTotal - this.Entity.p.TotalDeduction )
     this.Entity.p.NetSalary = NetSalary
  }

   SaveMaterialMaster = async () => {
      this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
      this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
      if (this.Entity.p.CreatedBy == 0) {
        this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      }
      let entityToSave = this.Entity.GetEditableVersion();
      let entitiesToSave = [entityToSave];
      console.log('entityToSave :', entityToSave);
      let tr = await this.utils.SavePersistableEntities(entitiesToSave);
  
      if (!tr.Successful) {
        this.isSaveDisabled = false;
        this.uiUtils.showErrorMessage('Error', tr.Message);
        return;
      } else {
        this.isSaveDisabled = false;
        if (this.IsNewEntity) {
          await this.uiUtils.showSuccessToster('Salary Details saved successfully!');
          this.Entity = SalaryGeneration.CreateNewInstance();
        } else {
          await this.uiUtils.showSuccessToster('Salary Details  Updated successfully!');
          await this.router.navigate(['/homepage/Website/Salary_Generation']);
        }
      }
    };

  async BackSalaryGenaration() {
    this.router.navigate(['/homepage/Website/Salary_Generation']);
  }
}
