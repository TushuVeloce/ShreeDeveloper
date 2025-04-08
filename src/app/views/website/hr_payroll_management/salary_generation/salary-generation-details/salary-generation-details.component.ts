import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
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
export class SalaryGenerationDetailsComponent  implements OnInit {
    isSaveDisabled: boolean = false;
    private IsNewEntity: boolean = true;
    // Entity: EmployeeExit = EmployeeExit.CreateNewInstance();
    DetailsFormTitle: 'New Employee Exit' | 'Edit Employee Exit' = 'New Employee Exit';
    EmployeeList: Employee[] = [];
    MonthList = DomainEnums.MonthList(true, '---Select Month---');
    companyName = this.companystatemanagement.SelectedCompanyName;
    companyRef = this.companystatemanagement.SelectedCompanyRef;
   constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) {}

  ngOnInit() {
    this.getEmployeeListByCompanyRef()

  }

  getEmployeeListByCompanyRef = async () => {
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
  }

  async BackOfficeTime() {
    this.router.navigate(['/homepage/Website/Office_Duty_Time']);
  }
}
