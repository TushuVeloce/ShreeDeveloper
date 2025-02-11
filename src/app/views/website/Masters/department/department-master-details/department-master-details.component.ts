import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { Country } from 'src/app/classes/domain/entities/website/masters/country/country';
import { UIUtils } from 'src/app/services/uiutils.service';


@Component({
  selector: 'app-department-master-details',
  standalone: false,
  templateUrl: './department-master-details.component.html',
  styleUrls: ['./department-master-details.component.scss'],
})
export class DepartmentMasterDetailsComponent implements OnInit {

  CompanyList: Company[] = [];
  CompanyRef: number = 0;

  constructor(private uiUtils: UIUtils,private router: Router) { }

  async ngOnInit() {
    await this.GetCompantList();
   }

   private GetCompantList = async () => {
    let lst = await Company.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.CompanyList = lst;
  }

  BackDepartment() {
    this.router.navigate(['/homepage/Website/Department_Master']);
  }

}
