import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { StockTransfer } from 'src/app/classes/domain/entities/website/stock_management/stock-transfer/stocktransfer';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-stock-transfer-view-mobile-app',
  templateUrl: './stock-transfer-view-mobile-app.component.html',
  styleUrls: ['./stock-transfer-view-mobile-app.component.scss'],
  standalone:false
})
export class StockTransferViewMobileAppComponent  implements OnInit {

  Entity: StockTransfer = StockTransfer.CreateNewInstance();
  MasterList: StockTransfer[] = [];
  DisplayMasterList: StockTransfer[] = [];
  SiteList: Site[] = [];
  SelectedStockTransfer: StockTransfer = StockTransfer.CreateNewInstance();

  companyRef = 0;
  modalOpen = false;
  filters: FilterItem[] = [];

  // Store current selected values here to preserve selections on filter reload
  selectedFilterValues: Record<string, any> = {};

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private DateconversionService: DateconversionService,
    private dtu: DTU,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private baseUrl: BaseUrlService,
    private utils: Utils,
  ) { }

  ngOnInit = async () => {
    // await this.loadStockTransferIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    await this.loadStockTransferIfEmployeeExists();
    await this.loadFilters();
  };

  async handleRefresh(event: CustomEvent) {
    await this.loadStockTransferIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

   loadFilters() {
    this.filters = [
      {
        key: 'fromsite',
        label: 'From Site',
        multi: false,
        options: this.SiteList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected: this.selectedFilterValues['fromsite'] > 0 ? this.selectedFilterValues['fromsite'] : null,
      },
      {
        key: 'tosite',
        label: 'To Site',
        multi: false,
        options: this.SiteList.map(item => ({
          Ref: item.p.Ref,
          Name: item.p.Name,
        })),
        selected: this.selectedFilterValues['tosite'] > 0 ? this.selectedFilterValues['tosite'] : null,
      }
    ];
  }

  async onFiltersChanged(updatedFilters: any[]) {
    // debugger

    for (const filter of updatedFilters) {
      const selected = filter.selected;
      const selectedValue = (selected === null || selected === undefined) ? null : selected;

      // Save selected value to preserve after reload
      this.selectedFilterValues[filter.key] = selectedValue ?? null;

      switch (filter.key) {
        case 'fromsite':
          if (this.Entity.p.FromSiteRef == this.Entity.p.ToSiteRef) {
            await this.toastService.present('Same site can not selected', 1000, 'danger');
            break;
          }
          this.Entity.p.FromSiteRef = selectedValue ?? 0;
          break;

        case 'tosite':
          if (this.Entity.p.FromSiteRef == this.Entity.p.ToSiteRef) {
            await this.toastService.present('Same site can not selected', 1000, 'danger');
            break;
          }
          this.Entity.p.ToSiteRef = selectedValue ?? 0;
          break;
      }
    }
    await this.getStockTransferListByCompanyRefAndSiteRef();
    this.loadFilters(); // Reload filters with updated options & preserve selections
  }


  private async loadStockTransferIfEmployeeExists() {
    try {
      await this.loadingService.show();

      const company = this.appStateManage.localStorage.getItem('SelectedCompanyRef');
      this.companyRef = Number(company || 0);

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }

      await this.getSiteListByCompanyRef();
      await this.getStockTransferListByCompanyRef();
    } catch (error) {
      console.error('Error in loadStockTransferIfEmployeeExists:', error);
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
        await this.toastService.present('Error: ' + errMsg, 1000, 'danger');
        await this.haptic.error();
      });

      this.SiteList = lst || [];

      this.Entity.p.FromSiteRef = 0
      this.Entity.p.ToSiteRef = 0
    } catch (err) {
      console.error('Error fetching site list:', err);
    }
  }

  private async getStockTransferListByCompanyRef() {
    try {
      this.MasterList = [];
      this.DisplayMasterList = [];

      const lst = await StockTransfer.FetchEntireListByCompanyRef(this.companyRef, async (errMsg) => {
        await this.toastService.present('Error: ' + errMsg, 1000, 'danger');
        await this.haptic.error();
      });

      this.MasterList = lst || [];
      this.DisplayMasterList = [...this.MasterList];
    } catch (err) {
      console.error('Error fetching Stock Transfer list:', err);
    }
  }

  private async getStockTransferListByCompanyRefAndSiteRef() {
    try {
      this.MasterList = [];
      this.DisplayMasterList = [];

      const lst = await StockTransfer.FetchEntireListByCompanyRefAndSiteRef(this.companyRef, this.Entity.p.FromSiteRef, this.Entity.p.ToSiteRef, async (errMsg) => {
        await this.toastService.present('Error: ' + errMsg, 1000, 'danger');
        await this.haptic.error();
      });

      this.MasterList = lst || [];
      this.DisplayMasterList = [...this.MasterList];
    } catch (err) {
      console.error('Error fetching Stock Transfer list:', err);
    }
  }

  openModal(StockTransfer: StockTransfer) {
    this.SelectedStockTransfer = StockTransfer;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedStockTransfer = StockTransfer.CreateNewInstance();
  }

  AddStockTransfer = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
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
            handler: () => {
            },
          },
          {
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                // await StockTransfer.DeleteInstance(async () => {
                //   await this.toastService.present(
                //     `Deleted Stock Transfer on ${this.formatDate(StockTransfer.p.PurchaseOrderDate)}!`,
                //     1000,
                //     'success'
                //   );
                //   await this.haptic.success();
                //   await this.loadStockTransferIfEmployeeExists();
                // });
                // debugger
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
                console.error('Error deleting Stock Transfer:', err);
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
      console.error('Delete Alert Error:', error);
      await this.toastService.present('Something went wrong', 1000, 'danger');
      await this.haptic.error();
    }
  };

  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  };

}
