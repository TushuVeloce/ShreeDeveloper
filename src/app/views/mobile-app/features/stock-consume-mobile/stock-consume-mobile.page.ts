import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { StockConsume } from 'src/app/classes/domain/entities/website/stock_management/stock_consume/stockconsume';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ToastService } from '../../core/toast.service';
import { HapticService } from '../../core/haptic.service';
import { AlertService } from '../../core/alert.service';
import { LoadingService } from '../../core/loading.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-stock-consume-mobile',
  templateUrl: './stock-consume-mobile.page.html',
  styleUrls: ['./stock-consume-mobile.page.scss'],
  standalone:false
})
export class StockConsumeMobilePage implements OnInit {

  Entity: StockConsume = StockConsume.CreateNewInstance();
  MasterList: StockConsume[] = [];
  DisplayMasterList: StockConsume[] = [];
  SiteList: Site[] = [];
  SelectedStockConsume: StockConsume = StockConsume.CreateNewInstance();

  companyRef = 0;
  modalOpen = false;

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
    private sanitizer: DomSanitizer,
    private baseUrl: BaseUrlService,
    private utils: Utils,
  ) { }

  ngOnInit = async () => {
    await this.loadStockConsumeIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    await this.loadStockConsumeIfEmployeeExists();
  };

  async handleRefresh(event: CustomEvent) {
    await this.loadStockConsumeIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async loadStockConsumeIfEmployeeExists() {
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
      await this.getStockConsumeListByCompanyRef();
    } catch (error) {
      console.error('Error in loadStockConsumeIfEmployeeExists:', error);
      await this.toastService.present('Failed to load Stock Inward', 1000, 'danger');
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

      this.Entity.p.SiteRef = 0; // Default selection
    } catch (err) {
      console.error('Error fetching site list:', err);
    }
  }

  private async getStockConsumeListByCompanyRef() {
    try {
      this.MasterList = [];
      this.DisplayMasterList = [];

      const lst = await StockConsume.FetchEntireListByCompanyRef(this.companyRef, async (errMsg) => {
        await this.toastService.present('Error: ' + errMsg, 1000, 'danger');
        await this.haptic.error();
      });

      this.MasterList = lst || [];
      this.DisplayMasterList = [...this.MasterList];
    } catch (err) {
      console.error('Error fetching stock inward list:', err);
    }
  }

  private async getInwardListByCompanyRefAndSiteRef() {
    try {
      this.MasterList = [];
      this.DisplayMasterList = [];

      const lst = await StockConsume.FetchEntireListByCompanyRefAndSiteRef(this.companyRef, this.Entity.p.SiteRef, async (errMsg) => {
        await this.toastService.present('Error: ' + errMsg, 1000, 'danger');
        await this.haptic.error();
      });

      this.MasterList = lst || [];
      this.DisplayMasterList = [...this.MasterList];
    } catch (err) {
      console.error('Error fetching stock inward list:', err);
    }
  }

  openModal(StockConsume: StockConsume) {
    this.SelectedStockConsume = StockConsume;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedStockConsume = StockConsume.CreateNewInstance();
  }

  AddStockConsume = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }

    this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-consume/add']);
  };

  onEditClicked = async (item: StockConsume) => {
    this.SelectedStockConsume = item.GetEditableVersion();
    StockConsume.SetCurrentInstance(this.SelectedStockConsume);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-consume/edit']);
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
            handler: () => {
              console.log('Deletion cancelled.');
            },
          },
          {
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                // await StockConsume.DeleteInstance(async () => {
                //   await this.toastService.present(
                //     `Deleted Stock Inward on ${this.formatDate(StockConsume.p.PurchaseOrderDate)}!`,
                //     1000,
                //     'success'
                //   );
                //   await this.haptic.success();
                //   await this.loadStockConsumeIfEmployeeExists();
                // });
                await stockConsume.DeleteInstance(async () => {
                  await this.toastService.present(
                    `Deleted Stock Inward on ${this.formatDate(stockConsume.p.ConsumptionDate)}!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                  if (this.Entity.p.SiteRef <= 0) {
                    this.getStockConsumeListByCompanyRef();
                  } else {
                    this.getInwardListByCompanyRefAndSiteRef();
                  }
                });
              } catch (err) {
                console.error('Error deleting Stock Inward:', err);
                await this.toastService.present('Failed to delete Stock Inward', 1000, 'danger');
                await this.haptic.error();
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
