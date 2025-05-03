import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { ExpenseType } from 'src/app/classes/domain/entities/website/masters/expensetype/expensetype';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { ActualStages } from 'src/app/classes/domain/entities/website/site_management/actualstages/actualstages';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-site-management-actual-stages',
  templateUrl: './site-management-actual-stages.component.html',
  styleUrls: ['./site-management-actual-stages.component.scss'],
  standalone: false,
})
export class SiteManagementActualStagesComponent implements OnInit {
  Entity: ActualStages = ActualStages.CreateNewInstance();
  MasterList: ActualStages[] = [];
  DisplayMasterList: ActualStages[] = [];
  DigitalList: ActualStages[] = [];
  ElectronicsList: ActualStages[] = [];
  OutdoorList: ActualStages[] = [];
  PrintingMediaList: ActualStages[] = [];
  BrokerList: ActualStages[] = [];
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  StageList: Stage[] = [];
  ExpenseTypeList: ExpenseType[] = [];
  SearchString: string = '';
  SelectedActualStages: ActualStages = ActualStages.CreateNewInstance();
  pageSize = 8; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  FromDate = '';
  ToDate = '';
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  headers: string[] = ['Sr.No.', 'Date', 'Chalan No.', 'Vehicle Type', 'Description', 'Owner Name', 'Rate', 'Unit', 'Quantity', 'Amount', 'Action'];
  Labour_Expense: string[] = ['Sr.No.', 'Date', 'Chalan No.', 'Description', 'Department', 'Owner Name', 'Quantity', 'Amount', 'Action'];
  Other_Expense: string[] = ['Sr.No.', 'Date', 'Chalan No.', 'Description', 'Department', 'Owner Name', 'Rate', 'Quantity', 'Amount', 'Action'];
  Office_Details: string[] = ['Sr.No.', 'Date', 'Chalan No.', 'Expense Type', 'Description', 'Receiver Name', 'Amount', 'Action'];
  Government_Details: string[] = ['Sr.No.', 'Date', 'Chalan No.', 'Expense Type', 'Description', 'Receiver Name', 'Amount', 'Action'];

 constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {}


  async ngOnInit() {
    this.SiteList = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.StageList = await Stage.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = await Vendor.FetchEntireListByCompanyRef(this.companyRef(),
    async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.appStateManage.setDropdownDisabled(false);
  }

  OnStageChange = async (StageRef: number) => {
    await this.getExpenseListByStageRef(StageRef);
  }

  getExpenseListByStageRef = async (StageRef: number) => {
    if (StageRef <= 0) {
      await this.uiUtils.showErrorToster('Stage not Selected');
      return;
    }
    let lst = await ExpenseType.FetchEntireListByStageRef(StageRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.ExpenseTypeList = lst;
  }

  Title: string = 'Site Management Actual Stages';

  AddStages = async () => {
    await this.router.navigate(['/homepage/Website/Site_Management_Actual_Stage_Details']);
  }

  OwnerRef: number = 0;
  StageRef: number = 0;
  OwnerList: string[] = ['Owner1', 'Owner2', 'Owner3'];
  StagesList: string[] = ['Stage1', 'Stage2', 'Stage3'];
  getOwnerRef(Ref: any) {
    // code here
    console.log('OwnerRef');
  }

}
