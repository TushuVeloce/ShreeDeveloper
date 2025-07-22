import { Component, effect, OnInit } from '@angular/core';
import { CRMReports } from 'src/app/classes/domain/entities/website/customer_management/crmreports/crmreport';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-customerinfo-report',
  standalone: false,
  templateUrl: './customerinfo-report.component.html',
  styleUrls: ['./customerinfo-report.component.scss'],
})
export class CustomerinfoReportComponent implements OnInit {

  Entity: CRMReports = CRMReports.CreateNewInstance();
  MasterList: CRMReports[] = [];
  DisplayMasterList: CRMReports[] = [];
  SiteList: Site[] = [];
  CustomerList: CRMReports[] = [];
  SiteRef: number = 0;
  CustomerRef: number = 0;

  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Customer ID', 'Customer Name', 'Address', 'Contact No', 'Pan', 'Aadhar No', 'Lead Source', 'Booking Remark', 'Plot No', 'Area in Sqm', 'Area in Sqft', 'Basic per Rate', 'Discount Rate on Area', 'Total Plot Amount', 'Government Value', 'Value of Agreement', 'Reg Tax Value In %', 'Stamp Duties', 'Gst Total Amount', 'Goods Services Tax', 'Legal Charges', 'Total Cheque Recieved', 'Total Cash Recieved', 'Total Amount Recieved', 'Grand Total'];


  constructor(private uiUtils: UIUtils, private companystatemanagement: CompanyStateManagement) {
    effect(async () => {
      await this.FormulateSiteListByCompanyRef(); this.getCustomerReportByCompanyRef();
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

  }

  getCustomerReportByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }

    let lst = await CRMReports.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log('lst :', lst);
    this.DisplayMasterList = lst;
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
    this.DisplayMasterList = lst;
  }

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };


  OnCustomerSelection = () => {
    let report = this.CustomerList.filter((data) => data.p.CustomerEnquiryRef == this.CustomerRef);
    if (report.length > 0) {
      this.Entity = report[0];
    }
  }

}

