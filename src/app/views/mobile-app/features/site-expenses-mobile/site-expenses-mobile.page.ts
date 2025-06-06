import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ExpenseTypeRefs, UnitRefs } from 'src/app/classes/domain/constants';
import { ExpenseType } from 'src/app/classes/domain/entities/website/masters/expensetype/expensetype';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { ActualStages } from 'src/app/classes/domain/entities/website/site_management/actualstages/actualstages';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { FilterService } from 'src/app/services/filter.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-site-expenses-mobile',
  templateUrl: './site-expenses-mobile.page.html',
  styleUrls: ['./site-expenses-mobile.page.scss'],
  standalone:false
})
export class SiteExpensesMobilePage implements OnInit {

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
  companyName: string | null = '';
  siteRef: number = 0;
  siteName: string | null = '';

  ExpenseTypeRef: number = ExpenseTypeRefs.MachinaryExpense
  LabourExpenseRef: number = ExpenseTypeRefs.LabourExpense
  OtherExpenseRef: number = ExpenseTypeRefs.OtherExpense
  TimeUnitRef: number = UnitRefs.TimeUnitRef

  selectedFilters: any[] = [];

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private dateService: DateconversionService,
    private appStateManagement: AppStateManageService,
    private filterService: FilterService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadActualStageIfCompanyExists();
  }

  ionViewWillEnter = async () => {
    await this.loadActualStageIfCompanyExists();
  };

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadActualStageIfCompanyExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async loadActualStageIfCompanyExists(): Promise<void> {
    try {
      this.isLoading = true;
      this.companyRef = Number(this.appStateManagement.StorageKey.getItem('SelectedCompanyRef'));
      this.companyName = this.appStateManagement.StorageKey.getItem('companyName') ? this.appStateManagement.StorageKey.getItem('companyName') : '';
      this.siteRef = Number(this.appStateManagement.StorageKey.getItem('siteRf'));
      this.siteName = this.appStateManagement.StorageKey.getItem('siteName') ? this.appStateManagement.StorageKey.getItem('siteName') : '';
      this.Entity.p.SiteRef = this.siteRef;
      if (this.companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      this.SiteList = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.StageList = await Stage.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.VendorList = await Vendor.FetchEntireListByCompanyRef(this.companyRef, async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
      await this.getActualStageListByAllFilters();
    } catch (error) {

    } finally {
      this.isLoading = false;
    }
  }


  async onPrintClicked(item: any) {
    this.router.navigate(['mobileapp/tabs/dashboard/site-management/site-expenses/print'], {
      state: { printData: item.GetEditableVersion() }
    });
  }

  // formatDate(dateStr: string): string {
  //   // Your existing date formatting logic
  //   const date = new Date(dateStr);
  //   return date.toLocaleDateString();
  // }

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
    let lst = await ActualStages.FetchEntireListByAllFilters(this.companyRef, this.FromDate ?? '', this.ToDate ?? '', this.Entity.p.SiteRef, this.Entity.p.VendorRef, this.Entity.p.StageRef, this.Entity.p.ExpenseTypeRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log('lst :', lst);
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

  onEditClicked = async (item: ActualStages) => {
    this.SelectedActualStages = item.GetEditableVersion();
    ActualStages.SetCurrentInstance(this.SelectedActualStages);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['mobileapp/tabs/dashboard/site-management/site-expenses/edit']);
  };

  onDeleteClicked = async (ActualStages: ActualStages) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
       Are you sure that you want to DELETE this actual stage?`,
      async () => {
        await ActualStages.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Actual Stages ${ActualStages.p.ChalanNo} has been deleted!`
          );
          await this.getActualStageListByAllFilters();
          this.SearchString = '';
        });
      }
    );
  };

  getTotalWorkedHours(TimeDetails: any): number {
    return TimeDetails.reduce((total: number, item: any) => {
      return total + Number(item.WorkedHours || 0);
    }, 0);
  }

  AddActualStages = async () => {
    await this.router.navigate(['mobileapp/tabs/dashboard/site-management/site-expenses/add']);
  }
  formatData = (list: any[]) => {
    return list.map(item => ({
      Ref: item.p.Ref,
      Name: item.p.Name
    }));
  };

  openFilterSheet = async () => {
    const filterData = {
      categories: [
        {
          Name: 'Vendor',
          Ref: 100,
          multi: false,
          date: false,
          dependUponRef: 0,
          options: this.formatData(this.VendorList)
        },
        {
          Name: 'Stage',
          Ref: 200,
          multi: false,
          date: false,
          dependUponRef: 0,
          options: this.formatData(this.StageList)
        },
        {
          Name: 'Expense Type',
          Ref: 300,
          multi: false,
          date: false,
          dependUponRef: 200,
          options: []
        }
        // ,
        // {
        //   Name: 'From Date',
        //   Ref: 400,
        //   multi: false,
        //   date: true,
        //   dependUponRef: 0,
        //   options: []
        // },
        // {
        //   Name: 'To Date',
        //   Ref: 500,
        //   multi: false,
        //   date: true,
        //   dependUponRef: 0,
        //   options: []
        // }
      ]
    };

    // console.log('Vendor List:', this.VendorList);
    // console.log('Stage List:', this.StageList);

    try {
      const res = await this.filterService.openFilter(filterData, this.selectedFilters);
      console.log('res :', res);

      if (res.selected && res.selected.length > 0) {
        this.selectedFilters = res.selected;
        // console.log('Selected Filters:', this.selectedFilters);

        for (const filter of this.selectedFilters) {
          // console.log('Filter:', filter);

          switch (filter.category.Ref) {
            case 100:
              this.Entity.p.VendorRef = filter.selectedOptions[0].Ref;
              break;
            case 200:
              this.Entity.p.StageRef = filter.selectedOptions[0].Ref;
              break;
            case 300:
              // this.Entity.p.SomeDateRef = filter.SelectedValue;
              break;
          }
        }

        this.getActualStageListByAllFilters();
      } else {
        this.Entity.p.VendorRef = 0;
        // console.log('this.Entity.p.VendorRef :', this.Entity.p.VendorRef);
        this.Entity.p.StageRef = 0;
        // console.log('this.Entity.p.StageRef :', this.Entity.p.StageRef);
        this.selectedFilters = [];
        // this.Entity.p.SiteRef = 0;
        this.getActualStageListByAllFilters();
      }
    } catch (error) {
      console.error('Error in filter selection:', error);
    }
  };
}
