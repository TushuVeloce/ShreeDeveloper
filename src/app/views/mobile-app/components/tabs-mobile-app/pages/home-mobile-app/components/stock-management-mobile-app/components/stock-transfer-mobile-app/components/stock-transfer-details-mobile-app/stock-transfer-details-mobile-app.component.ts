// Angular and App imports
import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { MaterialCurrentStock } from 'src/app/classes/domain/entities/website/stock_management/Material-Current-Stock/materialcurrentstock';
import { StockTransfer } from 'src/app/classes/domain/entities/website/stock_management/stock-transfer/stocktransfer';
import { StockConsume } from 'src/app/classes/domain/entities/website/stock_management/stock_consume/stockconsume';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { DTU } from 'src/app/services/dtu.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-stock-transfer-details-mobile-app',
  templateUrl: './stock-transfer-details-mobile-app.component.html',
  styleUrls: ['./stock-transfer-details-mobile-app.component.scss'],
  standalone: false
})
export class StockTransferDetailsMobileAppComponent implements OnInit, OnDestroy {
  isSaveDisabled = false;
  private IsNewEntity = true;
  Entity: StockTransfer = StockTransfer.CreateNewInstance();
  DetailsFormTitle: 'New Stock Transfer' | 'Edit Stock Transfer' = 'New Stock Transfer';
  SiteList: Site[] = [];
  FromSiteList: Site[] = [];
  ToSiteList: Site[] = [];
  MaterialList: StockConsume[] = [];
  companyRef = 0;

  // UI fields
  TransferDate: string | null = null;
  selectedGST: any[] = [];
  selectedFromSite: any[] = [];
  selectedToSite: any[] = [];
  selectedMaterial: any[] = [];
  FromSiteName = '';
  ToSiteName = '';
  MaterialName = '';

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private dtu: DTU,
    private datePipe: DatePipe,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private utils: Utils
  ) { }

  ngOnInit = async () => { };

  ionViewWillEnter = async () => {
    await this.loadMaterialRequisitionDetailsIfCompanyExists();
  };

  ngOnDestroy(): void { }

  private async loadMaterialRequisitionDetailsIfCompanyExists() {
    try {
      await this.loadingService.show();
      this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }

      this.appStateManage.setDropdownDisabled(true);
      await this.getSiteListByCompanyRef();

      const isEditable = this.appStateManage.StorageKey.getItem('Editable') === 'Edit';
      this.IsNewEntity = !isEditable;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Stock Transfer' : 'Edit Stock Transfer';

      if (isEditable) {
        this.Entity = StockTransfer.GetCurrentInstance();
        this.appStateManage.StorageKey.removeItem('Editable');

        this.TransferDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
        this.selectedFromSite = [{ p: { Ref: this.Entity.p.FromSiteRef, Name: this.Entity.p.FromSiteName } }];
        this.FromSiteName = this.Entity.p.FromSiteName;

        this.selectedToSite = [{ p: { Ref: this.Entity.p.ToSiteRef, Name: this.Entity.p.ToSiteName } }];
        this.ToSiteName = this.Entity.p.ToSiteName;

        this.selectedMaterial = [{ p: { Ref: this.Entity.p.MaterialRef, Name: this.Entity.p.MaterialName } }];
        this.MaterialName = this.Entity.p.MaterialName;

        await this.getMaterialListBySiteRef(this.Entity.p.FromSiteRef);
        await this.getUnitByMaterialRef(this.Entity.p.FromSiteRef, this.Entity.p.MaterialRef);
      } else {
        this.Entity = StockTransfer.CreateNewInstance();
        StockTransfer.SetCurrentInstance(this.Entity);

        const strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
        const parts = strCDT.substring(0, 16).split('-');
        this.Entity.p.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        this.TransferDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);

        this.Entity.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));
      }
    } catch (error) {
      await this.toastService.present('Failed to load stock Transfer details', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  private async getSiteListByCompanyRef() {
    if (this.companyRef <= 0) return;

    const lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });

    this.SiteList = lst;
    this.FromSiteList = lst;
    this.ToSiteList = [...lst];
  }

  private async getMaterialListBySiteRef(siteRef: number) {
    this.MaterialList = [];
    if (this.companyRef <= 0 || siteRef <= 0) return;

    const lst = await StockConsume.FetchMaterialListBySiteRef(siteRef, this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.MaterialList = lst;
  }

  private async getUnitByMaterialRef(siteRef: number, materialRef: number) {
    const lst = await MaterialCurrentStock.FetchMaterialData(siteRef, materialRef, this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });

    if (lst && lst.length > 0) {
      const data = lst[0];
      this.Entity.p.UnitRef = data.p.UnitRef;
      this.Entity.p.UnitName = data.p.UnitName;
      this.Entity.p.CurrentQuantity = data.p.CurrentQuantity;
      this.calculateRemainingQuantity();
    }
  }

  public async onTransferDateChange(date: any): Promise<void> {
    this.TransferDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.Date = this.TransferDate;
  }

  public async selectFromSiteBottomsheet(): Promise<void> {
    const options = this.FromSiteList;
    const selected = await this.bottomsheetMobileAppService.openSelectModal(options, this.selectedFromSite, false, 'Select From Site', 1);

    if (selected) {
      this.selectedFromSite = selected;
      this.Entity.p.FromSiteRef = selected[0]?.p?.Ref || 0;
      this.FromSiteName = selected[0]?.p?.Name || '';

      this.ToSiteList = this.SiteList.filter(site => site.p.Ref !== this.Entity.p.FromSiteRef);

      await this.getMaterialListBySiteRef(this.Entity.p.FromSiteRef);
      this.onSiteChange();
    }
  }

  public async selectToSiteBottomsheet(): Promise<void> {
    const options = this.ToSiteList;
    const selected = await this.bottomsheetMobileAppService.openSelectModal(options, this.selectedToSite, false, 'Select To Site', 1);

    if (selected) {
      this.selectedToSite = selected;
      this.Entity.p.ToSiteRef = selected[0]?.p?.Ref || 0;
      this.ToSiteName = selected[0]?.p?.Name || '';

      if (this.Entity.p.FromSiteRef === this.Entity.p.ToSiteRef) {
        await this.toastService.present('From Site and To Site cannot be the same', 1000, 'warning');
        await this.haptic.warning();
        this.Entity.p.ToSiteRef = 0;
        this.ToSiteName = '';
      }
    }
  }

  public async selectMaterialBottomsheet(): Promise<void> {
    const options = this.MaterialList.map(item => ({
      ...item,
      p: { ...item.p, Name: item.p.MaterialName, Ref: item.p.MaterialRef }
    }));

    const selected = await this.bottomsheetMobileAppService.openSelectModal(options, this.selectedMaterial, false, 'Select Material', 1);

    if (selected) {
      this.selectedMaterial = selected;
      this.Entity.p.MaterialRef = selected[0].p.MaterialRef;
      this.MaterialName = selected[0].p.MaterialName;

      await this.getUnitByMaterialRef(this.Entity.p.FromSiteRef, this.Entity.p.MaterialRef);
    }
  }

  private onSiteChange() {
    this.selectedMaterial = [];
    this.MaterialName = '';
    this.ToSiteName = '';
    this.selectedToSite = [];
    this.Entity.p.MaterialRef = 0;
    this.Entity.p.UnitRef = 0;
    this.Entity.p.UnitName = '';
    this.Entity.p.CurrentQuantity = 0;
    this.Entity.p.TransferredQuantity = 0;
    this.Entity.p.RemainingQuantity = 0;
  }

  public async SaveStockTransfer(): Promise<void> {
    try {
      this.loadingService.show();
      this.Entity.p.CompanyRef = this.companyRef;
      this.Entity.p.CompanyName = this.appStateManage.localStorage.getItem('companyName') || '';
      this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.Date);
      this.Entity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));
      this.Entity.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));

      const result = await this.utils.SavePersistableEntities([this.Entity.GetEditableVersion()]);

      if (!result.Successful) {
        await this.toastService.present('Error ' + result.Message, 1000, 'danger');
        await this.haptic.error();
        return;
      }

      await this.toastService.present(
        this.IsNewEntity ? 'Stock Transfer saved successfully' : 'Stock Transfer updated successfully',
        1000,
        'success'
      );
      await this.haptic.success();
      await this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/stock-transfer']);
    } catch (error) {
      console.error('Save Error:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  calculateRemainingQuantity() {
    this.Entity.p.RemainingQuantity = Math.ceil(this.Entity.p.CurrentQuantity - this.Entity.p.TransferredQuantity);
  }

  public goBack = async () => {
    if (this.isDataFilled()) {
      this.alertService.presentDynamicAlert({
        header: 'Warning',
        subHeader: 'Confirmation needed',
        message: 'You have unsaved data. Are you sure you want to go back? All data will be lost.',
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Yes, Close',
            handler: async () => {
              await this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/stock-transfer'], { replaceUrl: true });
              this.haptic.success();
            }
          }
        ]
      });
    } else {
      await this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/stock-transfer'], { replaceUrl: true });
      this.haptic.success();
    }
  };

  private isDataFilled(): boolean {
    const empty = StockTransfer.CreateNewInstance();
    return !this.deepEqualIgnoringKeys(this.Entity, empty, ['p.Date']);
  }

  private deepEqualIgnoringKeys(obj1: any, obj2: any, ignorePaths: string[]): boolean {
    const clean = (obj: any, path = ''): any => {
      if (obj === null || typeof obj !== 'object') return obj;
      const result: any = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        const fullPath = path ? `${path}.${key}` : key;
        if (ignorePaths.includes(fullPath)) continue;
        result[key] = clean(obj[key], fullPath);
      }
      return result;
    };
    return JSON.stringify(clean(obj1)) === JSON.stringify(clean(obj2));
  }
}
