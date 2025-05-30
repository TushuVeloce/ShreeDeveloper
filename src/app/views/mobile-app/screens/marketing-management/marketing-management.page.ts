import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums, MarketingModes } from 'src/app/classes/domain/domainenums/domainenums';
import { MarketingManagement } from 'src/app/classes/domain/entities/website/MarketingManagement/marketingmanagement';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { FilterService } from 'src/app/services/filter.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-marketing-management',
  templateUrl: './marketing-management.page.html',
  styleUrls: ['./marketing-management.page.scss'],
  standalone: false
})
export class MarketingManagementPage implements OnInit {
  Entity: MarketingManagement = MarketingManagement.CreateNewInstance();
  MasterList: MarketingManagement[] = [];
  DisplayMasterList: MarketingManagement[] = [];
  EmployeeList: Employee[] = [];
  SiteList: Site[] = [];
  VendorList: Vendor[] = [];
  ModalOpen: boolean = false;
  isLoading: boolean = false;

  SelectedMarketingManagement: MarketingManagement = MarketingManagement.CreateNewInstance();
  MarketingModesList = DomainEnums.MarketingModesList();
  MarketingModes = MarketingModes;
  FromDate = '';
  ToDate = '';
  companyRef: number = 0;
  selectedFilters: any[] = [];

  ngOnInit(): void {
    this.loadMarketingManagementIfCompanyExists();
  }

  ionViewWillEnter = async () => {
    await this.loadMarketingManagementIfCompanyExists();
  };

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadMarketingManagementIfCompanyExists();
    await this.getActualStageListByAllFilters();
    (event.target as HTMLIonRefresherElement).complete();
  }
  private async loadMarketingManagementIfCompanyExists(): Promise<void> {
    try {
      this.isLoading = true;
      this.companyRef = Number(this.appStateManage.StorageKey.getItem('SelectedCompanyRef'));
      this.SiteList = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.VendorList = await Vendor.FetchEntireListByCompanyRef(this.companyRef,
        async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.getMarketingListByCompanyRef();
      this.getEmployeeListByCompanyRef();
    } catch (error) {

    } finally {
      this.isLoading = false;
    }
  }

  constructor(private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private dtu: DTU,
    private DateconversionService: DateconversionService,
    private filterService: FilterService
  ) { }


  getEmployeeListByCompanyRef = async () => {
    let lst = await Employee.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.EmployeeList = lst;
  }

  getMarketingListByCompanyRef = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await MarketingManagement.FetchEntireListByCompanyRef(this.companyRef, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  }

  getActualStageListByAllFilters = async () => {
    try {
      this.isLoading = true;
      this.MasterList = [];
      this.DisplayMasterList = [];
      let FromDate = this.dtu.ConvertStringDateToFullFormat(this.FromDate);
      let ToDate = this.dtu.ConvertStringDateToFullFormat(this.ToDate);
      if (this.companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      let lst = await MarketingManagement.FetchEntireListByAllFilters(this.companyRef, FromDate, ToDate, this.Entity.p.SiteRef, this.Entity.p.VendorRef, this.Entity.p.MarketingType, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
      this.MasterList = lst;
      this.DisplayMasterList = this.MasterList;
    } catch (error) {

    } finally {
      this.isLoading = false;
    }
  }

  formatShortDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  onEditClicked = async (item: MarketingManagement) => {
    this.SelectedMarketingManagement = item.GetEditableVersion();
    MarketingManagement.SetCurrentInstance(this.SelectedMarketingManagement);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['app_homepage/tabs/marketing-management/edit']);
  };

  onDeleteClicked = async (marketing: MarketingManagement) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Marketing?`,
      async () => {
        await marketing.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `Marketing ${marketing.p.MarketingTypeName} has been deleted!`
          );
          if (this.selectedFilters.length > 0) {
            await this.getActualStageListByAllFilters();
          } else {
            await this.getMarketingListByCompanyRef();
          }
        });
      }
    );
  };

  onViewClicked(item: MarketingManagement) {
    this.SelectedMarketingManagement = item;
    this.ModalOpen = true;
  }

  closeModal() {
    this.ModalOpen = false;
  }

  async AddMarketing() {
    try {
      if (this.companyRef <= 0) {
        await this.uiUtils.showErrorToster('Company not Selected');
        return;
      }
      this.router.navigate(['app_homepage/tabs/marketing-management/add']);
    } catch (error: any) {
      await this.uiUtils.showErrorMessage('Error', error?.message || 'Failed to open the add form.');
    }
  }

  formatData = (list: any[]) => {
    return list.map(item => ({
      Ref: item.p.Ref,
      Name: item.p.Name
    }));
  };

  openFilterSheet = async () => {
    console.log('Before Selected Filters:', this.selectedFilters);
    const filterData = {
      categories: [
        {
          Name: 'Site',
          Ref: 100,
          multi: false,
          date: false,
          dependUponRef: 0,
          options: this.formatData(this.SiteList)
        }, {
          Name: 'Vendor',
          Ref: 200,
          multi: false,
          date: false,
          dependUponRef: 0,
          options: this.formatData(this.VendorList)
        },
        {
          Name: 'Marketing Modes',
          Ref: 300,
          multi: false,
          date: false,
          dependUponRef: 0,
          options: this.MarketingModesList
        }
      ]
    };

    try {
      const res = await this.filterService.openFilter(filterData, this.selectedFilters);

      if (res.selected && res.selected.length > 0) {
        this.selectedFilters = res.selected;
        console.log('After Selected Filters:', this.selectedFilters);

        for (const filter of this.selectedFilters) {
          // console.log('Filter:', filter);

          switch (filter.category.Ref) {
            case 200:
              this.Entity.p.VendorRef = filter.selectedOptions[0].Ref;
              break;
            case 100:
              this.Entity.p.SiteRef = filter.selectedOptions[0].Ref;
              break;
            case 300:
              this.Entity.p.MarketingType = filter.selectedOptions[0].Ref;
              break;
          }
        }

        this.getActualStageListByAllFilters();
      } else {
        this.Entity.p.VendorRef = 0;
        // console.log('this.Entity.p.VendorRef :', this.Entity.p.VendorRef);
        this.Entity.p.SiteRef = 0;
        // console.log('this.Entity.p.StageRef :', this.Entity.p.StageRef);
        this.Entity.p.MarketingType = 0;
        this.selectedFilters = [];
        this.getActualStageListByAllFilters();
      }
    } catch (error) {
      console.error('Error in filter selection:', error);
    }
  };

}
