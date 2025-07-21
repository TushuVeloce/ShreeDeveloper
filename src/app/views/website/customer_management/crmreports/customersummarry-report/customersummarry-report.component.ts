import { Component, effect, OnInit } from '@angular/core';
import { CRMReports } from 'src/app/classes/domain/entities/website/customer_management/crmreports/crmreport';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
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
  SiteList: Site[] = [];
  CustomerList: CRMReports[] = [];
  SiteRef: number = 0;
  CustomerRef: number = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  constructor(private uiUtils: UIUtils, private companystatemanagement: CompanyStateManagement) {
    effect(async () => {
      await this.FormulateSiteListByCompanyRef();
    });
  }

  ngOnInit() { }


  FormulateSiteListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.SiteList = [];
    this.SiteRef = 0;
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    if (this.SiteRef == 0 && lst.length > 0) {
      this.SiteRef = lst[0].p.Ref
      this.getCustomerReportByCompanyAndSiteRef();
    }
  }

  getCustomerReportByCompanyAndSiteRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    if (this.SiteRef <= 0) {
      await this.uiUtils.showErrorToster('Site not Selected');
      return;
    }
    let lst = await CRMReports.FetchEntireListByCompanyAndSiteRef(this.companyRef(), this.SiteRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.CustomerList = lst;
    if (this.CustomerRef == 0 && lst.length > 0) {
      this.CustomerRef = lst[0].p.CustomerEnquiryRef
      this.OnCustomerSelection();
    }

  }

  OnCustomerSelection = () => {
    let report = this.CustomerList.filter((data) => data.p.CustomerEnquiryRef == this.CustomerRef);
    if (report.length > 0) {
      this.Entity = report[0];
    }
  }

}
