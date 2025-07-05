import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { StockTransfer } from 'src/app/classes/domain/entities/website/stock_management/stock-transfer/stocktransfer';
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
  selector: 'app-stock-transfer-mobile',
  templateUrl: './stock-transfer-mobile.page.html',
  styleUrls: ['./stock-transfer-mobile.page.scss'],
  standalone:false
})
export class StockTransferMobilePage implements OnInit {


  Entity: StockTransfer = StockTransfer.CreateNewInstance();
  MasterList: StockTransfer[] = [];
  DisplayMasterList: StockTransfer[] = [];
  SiteList: Site[] = [];
  SelectedStockTransfer: StockTransfer = StockTransfer.CreateNewInstance();

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
    private baseUrl: BaseUrlService,
    private utils: Utils,
  ) { }

  ngOnInit = async () => {
    await this.loadStockTransferIfEmployeeExists();
  };

  ionViewWillEnter = async () => {
    await this.loadStockTransferIfEmployeeExists();
  };

  async handleRefresh(event: CustomEvent) {
    await this.loadStockTransferIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
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

    this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-transfer/add']);
  };

  onEditClicked = async (item: StockTransfer) => {
    this.SelectedStockTransfer = item.GetEditableVersion();
    StockTransfer.SetCurrentInstance(this.SelectedStockTransfer);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-transfer/edit']);
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
              console.log('Deletion cancelled.');
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
              }finally{
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
