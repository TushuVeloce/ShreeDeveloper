import { Component, effect, OnInit } from '@angular/core';
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
  MachinaryExpenseList: ActualStages[] = [];
  LabourExpenseList: ActualStages[] = [];
  OtherExpenseList: ActualStages[] = [];
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  StageList: Stage[] = [];
  ExpenseTypeList: ExpenseType[] = [];
  SearchString: string = '';
  SelectedActualStages: ActualStages = ActualStages.CreateNewInstance();
  total = 0;
  FromDate = '';
  ToDate = '';
  currentPage = {
    master: 1,
    machinary: 1,
    labour: 1,
    other: 1,
  };
  
  pageSize = {
    master: 1,
    machinary: 5,
    labour: 5,
    other: 5,
  };
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  MachinaryHeaders: string[] = ['Sr.No.', 'Date', 'Chalan No.', 'Vehicle No', 'Description', 'Vendor Name', 'Rate', 'Unit', 'Quantity', 'Amount', 'Action'];
  LabourHeaders: string[] = ['Sr.No.', 'Date', 'Chalan No.', 'Description', 'Vendor Name','Amount', 'Action'];
  Headers: string[] = ['Sr.No.', 'Date', 'Chalan No.', 'Description', 'Vendor Name', 'Rate', 'Quantity', 'Amount', 'Action'];


  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    effect(async () => {
      await this.getActualStageListByCompanyRef();
    });
  }


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

  getActualStageListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    this.MachinaryExpenseList = [];
    this.LabourExpenseList = [];
    this.OtherExpenseList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await ActualStages.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    console.log('DisplayMasterList :', this.DisplayMasterList);
    for (const item of lst) {
      switch (item.p.ExpenseTypeRef) {
        case 100:
          this.MachinaryExpenseList.push(item);
          break;
        case 200:
          this.LabourExpenseList.push(item);
          break;
        default:
          this.OtherExpenseList.push(item);
          break;
      }
    }
    this.loadPaginationData();
  }

  navigateToPrint = async (item: ActualStages) => {
    await this.router.navigate(['/homepage/Website/Actual_Stage_Print']);
    this.SelectedActualStages = item.GetEditableVersion();
    ActualStages.SetCurrentInstance(this.SelectedActualStages);
    // this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Actual_Stage_Print']);
  }

  onEditClicked = async (item: ActualStages) => {
    this.SelectedActualStages = item.GetEditableVersion();
    ActualStages.SetCurrentInstance(this.SelectedActualStages);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Site_Management_Actual_Stage_Details']);
  };


  onDeleteClicked = async (material: ActualStages) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
       Are you sure that you want to DELETE this Material?`,
      async () => {
        await material.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Material ${material.p.SiteName} has been deleted!`
          );
          await this.getActualStageListByCompanyRef();
          this.SearchString = '';
          this.loadPaginationData();
        });
      }
    );
  };

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };

  paginatedList(type: 'master' | 'machinary' | 'labour' | 'other') {
    const listMap = {
      master: this.DisplayMasterList,
      machinary: this.MachinaryExpenseList,
      labour: this.LabourExpenseList,
      other: this.OtherExpenseList,
    };
  
    const start = (this.currentPage[type] - 1) * this.pageSize[type];
    return listMap[type].slice(start, start + this.pageSize[type]);
  }

  onPageChange(type: 'master' | 'machinary' | 'labour' | 'other', pageIndex: number): void {
    this.currentPage[type] = pageIndex;
  }


  get totalMachinaryAmount(): number {
    return this.MachinaryExpenseList.reduce((sum, item) => sum + (item.p.Amount || 0), 0);
  }

  get totalLabourAmount(): number {
    return this.LabourExpenseList.reduce((sum, item) => sum + (item.p.Amount || 0), 0);
  }
  
  get totalOtherAmount(): number {
    return this.OtherExpenseList.reduce((sum, item) => sum + (item.p.Amount || 0), 0);
  }

  // get totalMacinaryAmountInWords(): string {
  //   return this.convertNumberToWords(this.totalMacinaryAmount);
  // }

  AddStages = async () => {
    await this.router.navigate(['/homepage/Website/Site_Management_Actual_Stage_Details']);
  }

  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }

}

