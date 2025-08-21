import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { StockTransfer } from 'src/app/classes/domain/entities/website/stock_management/stock-transfer/stocktransfer';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-stock-transfer-view-mobile-app',
  templateUrl: './stock-transfer-view-mobile-app.component.html',
  styleUrls: ['./stock-transfer-view-mobile-app.component.scss'],
  standalone: false
})
export class StockTransferViewMobileAppComponent implements OnInit {

  Entity: StockTransfer = StockTransfer.CreateNewInstance();
  MasterList: StockTransfer[] = [];
  DisplayMasterList: StockTransfer[] = [];
  SiteList: Site[] = [];
  FromSiteList: Site[] = [];
  ToSiteList: Site[] = [];
  SelectedStockTransfer: StockTransfer = StockTransfer.CreateNewInstance();

  companyRef = 0;
  modalOpen = false;
  filters: FilterItem[] = [];
  selectedFilterValues: Record<string, any> = {};

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private DateconversionService: DateconversionService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    public loadingService: LoadingService,
  ) { }

  ngOnInit = async () => { };

  ionViewWillEnter = async () => {
    await this.loadStockTransferIfEmployeeExists();
    this.loadFilters();
  };

  handleRefresh = async (event: CustomEvent) => {
    await this.loadStockTransferIfEmployeeExists();
    this.loadFilters();
    (event.target as HTMLIonRefresherElement).complete();
  }

  loadFilters = () => {
    this.FromSiteList = this.SiteList.filter(site => site.p.Ref !== this.Entity.p.ToSiteRef);
    this.ToSiteList = this.SiteList.filter(site => site.p.Ref !== this.Entity.p.FromSiteRef);

    this.filters = [
      {
        key: 'fromsite',
        label: 'From Site',
        multi: false,
        options: this.FromSiteList.map(item => ({ Ref: item.p.Ref, Name: item.p.Name })),
        selected: this.selectedFilterValues['fromsite'] > 0 ? this.selectedFilterValues['fromsite'] : null,
      },
      {
        key: 'tosite',
        label: 'To Site',
        multi: false,
        options: this.ToSiteList.map(item => ({ Ref: item.p.Ref, Name: item.p.Name })),
        selected: this.selectedFilterValues['tosite'] > 0 ? this.selectedFilterValues['tosite'] : null,
      }
    ];
  }

  onFiltersChanged = async (updatedFilters: any[]) => {
    for (const filter of updatedFilters) {
      const selected = filter.selected;
      const selectedValue = (selected === null || selected === undefined) ? null : selected;
      this.selectedFilterValues[filter.key] = selectedValue ?? null;

      switch (filter.key) {
        case 'fromsite':
          this.Entity.p.FromSiteRef = selectedValue ?? 0;
          break;
        case 'tosite':
          this.Entity.p.ToSiteRef = selectedValue ?? 0;
          break;
      }
    }
    await this.getStockTransferListByCompanyRefAndSiteRef();
    this.loadFilters();
  }

  private loadStockTransferIfEmployeeExists = async () => {
    try {
      await this.loadingService.show();
      const company = this.appStateManage.localStorage.getItem('SelectedCompanyRef');
      this.companyRef = Number(company || 0);

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }

      await this.getSiteListByCompanyRef();
      await this.getStockTransferListByCompanyRef();
    } catch (error) {
      await this.toastService.present('Failed to load Stock Transfer', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  private async getSiteListByCompanyRef() {
    try {
      if (this.companyRef <= 0) return;
      const lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      });

      this.SiteList = lst || [];
      this.Entity.p.FromSiteRef = 0;
      this.Entity.p.ToSiteRef = 0;
    } catch (err) {
      await this.toastService.present('Error fetching site list:' + err, 1000, 'danger');
      await this.haptic.error();
    }
  }

  private getStockTransferListByCompanyRef = async () => {
    try {
      this.MasterList = [];
      this.DisplayMasterList = [];

      const lst = await StockTransfer.FetchEntireListByCompanyRef(this.companyRef, async (errMsg) => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      });

      this.MasterList = lst || [];
      this.DisplayMasterList = [...this.MasterList];
    } catch (err) {
      await this.toastService.present('Error fetching Stock Transfer list:' + err, 1000, 'danger');
      await this.haptic.error();
    }
  }

  private getStockTransferListByCompanyRefAndSiteRef = async () => {
    try {
      this.MasterList = [];
      this.DisplayMasterList = [];

      const lst = await StockTransfer.FetchEntireListByCompanyRefAndSiteRef(
        this.companyRef,
        this.Entity.p.FromSiteRef,
        this.Entity.p.ToSiteRef,
        async (errMsg) => {
          await this.toastService.present(errMsg, 1000, 'danger');
          await this.haptic.error();
        }
      );

      this.MasterList = lst || [];
      this.DisplayMasterList = [...this.MasterList];
    } catch (err) {
      await this.toastService.present('Error fetching Stock Transfer list:' + err, 1000, 'danger');
      await this.haptic.error();
    }
  }

  openModal = (StockTransfer: StockTransfer) => {
    this.SelectedStockTransfer = StockTransfer;
    this.modalOpen = true;
  }

  closeModal = () => {
    this.modalOpen = false;
    this.SelectedStockTransfer = StockTransfer.CreateNewInstance();
  }

  AddStockTransfer = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/stock-transfer/add']);
  };

  onEditClicked = async (item: StockTransfer) => {
    this.SelectedStockTransfer = item.GetEditableVersion();
    StockTransfer.SetCurrentInstance(this.SelectedStockTransfer);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/stock-transfer/edit']);
  };

  onDeleteClicked = async (StockTransfer: StockTransfer) => {
    try {
      this.alertService.presentDynamicAlert({
        header: 'Delete',
        subHeader: 'Confirmation needed',
        message: 'Are you sure you want to delete this Stock Transfer?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => { },
          },
          {
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                this.loadingService.show();
                await StockTransfer.DeleteInstance(async () => {
                  await this.toastService.present(
                    `Deleted Stock Transfer on ${this.formatDate(StockTransfer.p.Date)}!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                  if (this.Entity.p.FromSiteRef <= 0) {
                    this.getStockTransferListByCompanyRef();
                  } else {
                    this.getStockTransferListByCompanyRefAndSiteRef();
                  }
                });
              } catch (err) {
                await this.toastService.present('Failed to delete Stock Transfer', 1000, 'danger');
                await this.haptic.error();
              } finally {
                this.loadingService.hide();
              }
            },
          },
        ],
      });
    } catch (error) {
      await this.toastService.present('Something went wrong', 1000, 'danger');
      await this.haptic.error();
    }
  };

  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  };

}