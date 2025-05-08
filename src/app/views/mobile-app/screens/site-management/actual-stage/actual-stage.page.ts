import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseType } from 'src/app/classes/domain/entities/website/masters/expensetype/expensetype';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { ActualStages } from 'src/app/classes/domain/entities/website/site_management/actualstages/actualstages';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-actual-stage',
  templateUrl: './actual-stage.page.html',
  styleUrls: ['./actual-stage.page.scss'],
  standalone: false
})
export class ActualStagePage implements OnInit {
  ModalOpen: boolean = false;
  isLoading: boolean = false;

  Entity: ActualStages = ActualStages.CreateNewInstance();
  ActualStagesList: ActualStages[] = [];
  FilteredActualStagesList: ActualStages[] = [];
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
  FromDate: string | null = null;
  ToDate: string | null = null;
  companyRef: number = 0;
  companyName: string| null = '';
  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private dateService: DateconversionService,
    private appStateManagement:AppStateManageService
  ) { }

  ngOnInit(): void {
    this.companyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
    this.companyName = this.appStateManagement.StorageKey.getItem('companyName') ? this.appStateManagement.StorageKey.getItem('companyName') : '';
    this.loadActualStageIfCompanyExists();
  }

  ionViewWillEnter = async () => {
    this.companyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
    this.companyName = this.appStateManagement.StorageKey.getItem('companyName') ? this.appStateManagement.StorageKey.getItem('companyName') : '';
    console.log('companyRef :', this.companyRef);
    await this.loadActualStageIfCompanyExists();
  };

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadActualStageIfCompanyExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async loadActualStageIfCompanyExists(): Promise<void> {
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.SiteList = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.StageList = await Stage.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.VendorList = await Vendor.FetchEntireListByCompanyRef(this.companyRef, async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.getActualStageListByCompanyRef();
  }

  onViewClicked(item: ActualStages) {
    this.SelectedActualStages = item;
    this.ModalOpen = true;
  }

  formatDate = (date: string | Date): string =>
    this.dateService.formatDate(date);

  closeModal() {
    this.ModalOpen = false;
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
    this.ActualStagesList = [];
    this.FilteredActualStagesList = [];
    this.MachinaryExpenseList = [];
    this.LabourExpenseList = [];
    this.OtherExpenseList = [];
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await ActualStages.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.ActualStagesList = lst;
    this.FilteredActualStagesList = lst;
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
  }

  getActualStageListByAllFilters = async () => {
    this.ActualStagesList = [];
    this.FilteredActualStagesList = [];
    this.MachinaryExpenseList = [];
    this.LabourExpenseList = [];
    this.OtherExpenseList = [];
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await ActualStages.FetchEntireListByAllFilters(this.companyRef, this.FromDate??'', this.ToDate??'', this.Entity.p.SiteRef, this.Entity.p.VendorRef, this.Entity.p.StageRef, this.Entity.p.ExpenseTypeRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.ActualStagesList = lst;
    this.FilteredActualStagesList = lst;
    console.log('DisplayMasterList :', this.FilteredActualStagesList);
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
  }
  onEditClicked = async (item: ActualStages) => {
    this.SelectedActualStages = item.GetEditableVersion();
    ActualStages.SetCurrentInstance(this.SelectedActualStages);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Marketing_Management_Master']);
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
        });
      }
    );
  };

  AddActualStages = async () => {
    await this.router.navigate(['app_homepage/tabs/site-management/actual-stage/add']);
  }
}
