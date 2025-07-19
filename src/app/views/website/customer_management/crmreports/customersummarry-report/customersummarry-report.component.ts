import { Component, effect, OnInit } from '@angular/core';
import { CRMReports } from 'src/app/classes/domain/entities/website/customer_management/crmreports/crmreport';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-customersummarry-report',
  standalone: false,
  templateUrl: './customersummarry-report.component.html',
  styleUrls: ['./customersummarry-report.component.scss'],
})
export class CustomersummarryReportComponent implements OnInit {
  Entity: CRMReports = CRMReports.CreateNewInstance();
  MasterList: CRMReports[] = [];
  DisplayMasterList: CRMReports[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  constructor(private uiUtils: UIUtils, private companystatemanagement: CompanyStateManagement) {
    effect(() => {
      this.getEstimatedStagesListByCompanyRef();
    });
  }

  ngOnInit() { }

  getEstimatedStagesListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await CRMReports.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log('lst :', lst);
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  }

}
