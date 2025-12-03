import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationFeatures } from 'src/app/classes/domain/domainenums/domainenums';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { StockConsume } from 'src/app/classes/domain/entities/website/stock_management/stock_consume/stockconsume';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { FeatureAccessMobileAppService } from 'src/app/services/feature-access-mobile-app.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-stock-consume-view-mobile-app',
  templateUrl: './stock-consume-view-mobile-app.component.html',
  styleUrls: ['./stock-consume-view-mobile-app.component.scss'],
  standalone: false,
})
export class StockConsumeViewMobileAppComponent implements OnInit {
  Entity: StockConsume = StockConsume.CreateNewInstance();
  MasterList: StockConsume[] = [];
  DisplayMasterList: StockConsume[] = [];
  SiteList: Site[] = [];
  StageList: Stage[] = [];
  SelectedStockConsume: StockConsume = StockConsume.CreateNewInstance();

  companyRef = 0;
  modalOpen = false;
  filters: FilterItem[] = [];

  // Store current selected values here to preserve selections on filter reload
  selectedFilterValues: Record<string, any> = {};
  featureRef: ApplicationFeatures = ApplicationFeatures.StockConsume;
  showActionColumn = false;

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private DateconversionService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    public access: FeatureAccessMobileAppService
  ) {}

  ngOnInit = async () => {
    // await this.loadStockConsumeIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    this.access.refresh();
    this.showActionColumn =
      this.access.canPrint(this.featureRef) ||
      this.access.canEdit(this.featureRef) ||
      this.access.canDelete(this.featureRef);
    await this.loadStockConsumeIfEmployeeExists();
    this.loadFilters();
  };

  handleRefresh = async (event: CustomEvent) => {
    await this.loadStockConsumeIfEmployeeExists();
    this.loadFilters();
    (event.target as HTMLIonRefresherElement).complete();
  };

  loadFilters = () => {
    this.filters = [
      {
        key: 'site',
        label: 'Site',
        multi: false,
        options: this.SiteList.map((item) => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected:
          this.selectedFilterValues['site'] > 0
            ? this.selectedFilterValues['site']
            : null,
      },
      {
        key: 'stage',
        label: 'Stage',
        multi: false,
        options: this.StageList.map((item) => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected:
          this.selectedFilterValues['stage'] > 0
            ? this.selectedFilterValues['stage']
            : null,
      },
    ];
  };

  onFiltersChanged = async (updatedFilters: any[]) => {
    for (const filter of updatedFilters) {
      const selected = filter.selected;
      const selectedValue =
        selected === null || selected === undefined ? null : selected;

      // Save selected value to preserve after reload
      this.selectedFilterValues[filter.key] = selectedValue ?? null;

      switch (filter.key) {
        case 'site':
          this.Entity.p.SiteRef = selectedValue ?? 0;
          break;
        case 'stage':
          this.Entity.p.StageRef = selectedValue ?? 0;
          break;
      }
    }
    await this.getStockConsumeListByCompanyRefAndStageRef();
    this.loadFilters();
  };

  private loadStockConsumeIfEmployeeExists = async () => {
    try {
      await this.loadingService.show();

      const company =
        this.appStateManage.localStorage.getItem('SelectedCompanyRef');
      this.companyRef = Number(company || 0);

      if (this.companyRef <= 0) {
        await this.toastService.present(
          'Company not selected',
          1000,
          'warning'
        );
        await this.haptic.warning();
        return;
      }

      await this.getSiteListByCompanyRef();
      await this.getStageListByCompanyRef();
      await this.getStockConsumeListByCompanyRefAndStageRef();
    } catch (error) {
      await this.toastService.present(
        'Failed to load Stock Inward',
        1000,
        'danger'
      );
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  };

  private getStageListByCompanyRef = async () => {
    try {
      if (this.companyRef <= 0) return;

      const lst = await Stage.FetchEntireListByCompanyRef(
        this.companyRef,
        async (errMsg) => {
          await this.toastService.present(errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );

      this.StageList = lst || [];
    } catch (err) {
      await this.toastService.present(
        'Error fetching Stage list:' + err,
        1000,
        'danger'
      );
      await this.haptic.error();
    }
  };

  private getSiteListByCompanyRef = async () => {
    try {
      if (this.companyRef <= 0) return;

      const lst = await Site.FetchEntireListByCompanyRef(
        this.companyRef,
        async (errMsg) => {
          await this.toastService.present(errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );

      this.SiteList = lst || [];

      this.Entity.p.SiteRef = 0;
    } catch (err) {
      await this.toastService.present(
        'Error fetching site list:' + err,
        1000,
        'danger'
      );
      await this.haptic.error();
    }
  };

  private getStockConsumeListByCompanyRefAndStageRef = async () => {
    try {
      this.MasterList = [];
      this.DisplayMasterList = [];

      const lst = await StockConsume.FetchEntireListByCompanySiteAndVendorRef(
        this.companyRef,
        this.Entity.p.SiteRef,
        this.Entity.p.StageRef,
        async (errMsg) => {
          await this.toastService.present(errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );

      this.MasterList = lst || [];
      this.DisplayMasterList = [...this.MasterList];
    } catch (err) {
      await this.toastService.present(
        'Error fetching Stock Inward list:' + err,
        1000,
        'danger'
      );
      await this.haptic.error();
    }
  };

  private getConsumeListByCompanyRefAndSiteRef = async () => {
    try {
      this.MasterList = [];
      this.DisplayMasterList = [];

      const lst = await StockConsume.FetchEntireListByCompanySiteAndVendorRef(
        this.companyRef,
        this.Entity.p.SiteRef,
        this.Entity.p.StageRef,
        async (errMsg) => {
          await this.toastService.present(errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );

      this.MasterList = lst || [];
      this.DisplayMasterList = [...this.MasterList];
    } catch (err) {
      await this.toastService.present(
        'Error fetching Stock Inward list:' + err,
        1000,
        'danger'
      );
      await this.haptic.error();
    }
  };

  openModal = (StockConsume: StockConsume) => {
    this.SelectedStockConsume = StockConsume;
    this.modalOpen = true;
  };

  closeModal = () => {
    this.modalOpen = false;
    this.SelectedStockConsume = StockConsume.CreateNewInstance();
  };

  AddStockConsume = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    this.router.navigate([
      '/mobile-app/tabs/dashboard/stock-management/stock-consume/add',
    ]);
  };

  onEditClicked = async (item: StockConsume) => {
    this.SelectedStockConsume = item.GetEditableVersion();
    StockConsume.SetCurrentInstance(this.SelectedStockConsume);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate([
      '/mobile-app/tabs/dashboard/stock-management/stock-consume/edit',
    ]);
  };

  onDeleteClicked = async (stockConsume: StockConsume) => {
    try {
      this.alertService.presentDynamicAlert({
        header: 'Delete',
        subHeader: 'Confirmation needed',
        message: 'Are you sure you want to delete this Stock Inward?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {},
          },
          {
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                await stockConsume.DeleteInstance(async () => {
                  await this.toastService.present(
                    `Deleted Stock Inward on ${this.formatDate(
                      stockConsume.p.ConsumptionDate
                    )}!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                  await this.getStockConsumeListByCompanyRefAndStageRef();
                });
              } catch (err) {
                await this.toastService.present(
                  'Failed to delete Stock Inward',
                  1000,
                  'danger'
                );
                await this.haptic.error();
              }
            },
          },
        ],
      });
    } catch (error) {
      await this.toastService.present(
        'Delete Alert Error:' + error,
        1000,
        'danger'
      );
      await this.haptic.error();
    }
  };

  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  };
}
