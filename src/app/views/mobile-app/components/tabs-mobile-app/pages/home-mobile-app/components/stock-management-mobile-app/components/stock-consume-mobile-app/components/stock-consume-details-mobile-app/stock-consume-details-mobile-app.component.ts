import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { MaterialCurrentStock } from 'src/app/classes/domain/entities/website/stock_management/Material-Current-Stock/materialcurrentstock';
import { StockConsume } from 'src/app/classes/domain/entities/website/stock_management/stock_consume/stockconsume';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-stock-consume-details-mobile-app',
  templateUrl: './stock-consume-details-mobile-app.component.html',
  styleUrls: ['./stock-consume-details-mobile-app.component.scss'],
  standalone: false
})
export class StockConsumeDetailsMobileAppComponent implements OnInit {

  // UI and State
  isSaveDisabled = false;
  private IsNewEntity = true;
  DetailsFormTitle: 'New Stock Consumption' | 'Edit Stock Consumption' = 'New Stock Consumption';

  // Entity and Lists
  Entity: StockConsume = StockConsume.CreateNewInstance();
  InitialEntity: StockConsume = null as any;
  SiteList: Site[] = [];
  StageList: Stage[] = [];
  MaterialList: StockConsume[] = [];

  // Selections
  selectedSite: any[] = [];
  SiteName = '';
  selectedStage: any[] = [];
  StageName = '';
  selectedMaterial: any[] = [];
  MaterialName = '';

  ConsumptionDate: string | null = null;
  companyRef = 0;

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private dtu: DTU,
    private DateconversionService: DateconversionService,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private utils: Utils,
    private datePipe: DatePipe
  ) { }

  ngOnInit = async () => { }

  ionViewWillEnter = async () => {
    await this.loadInitialData();
  }

  private async loadInitialData() {
    try {
      await this.loadingService.show();
      this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));

      if (this.companyRef <= 0) {
        await this.toastService.present('Company not selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }

      this.appStateManage.setDropdownDisabled(true);
      await Promise.all([this.getSiteListByCompanyRef(), this.getStageListByCompanyRef()]);

      const isEditable = this.appStateManage.StorageKey.getItem('Editable') === 'Edit';
      this.IsNewEntity = !isEditable;
      this.DetailsFormTitle = isEditable ? 'Edit Stock Consumption' : 'New Stock Consumption';

      if (isEditable) {
        this.Entity = StockConsume.GetCurrentInstance();
        this.appStateManage.StorageKey.removeItem('Editable');

        // Format and assign existing data
        if (this.Entity.p.ConsumptionDate) {
          this.Entity.p.ConsumptionDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.ConsumptionDate);
          this.ConsumptionDate = this.Entity.p.ConsumptionDate;
        }

        this.SiteName = this.Entity.p.SiteName;
        this.StageName = this.Entity.p.StageName;
        this.MaterialName = this.Entity.p.MaterialName;

        this.selectedSite = [{ p: { Ref: this.Entity.p.SiteRef, Name: this.SiteName } }];
        this.selectedStage = [{ p: { Ref: this.Entity.p.StageRef, Name: this.StageName } }];
        this.selectedMaterial = [{ p: { Ref: this.Entity.p.MaterialRef, Name: this.MaterialName } }];

        if (this.Entity.p.SiteRef > 0) {
          await this.getMaterialListBySiteRef(this.Entity.p.SiteRef);
        }
      } else {
        this.Entity = StockConsume.CreateNewInstance();
        StockConsume.SetCurrentInstance(this.Entity);

        const strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
        const parts = strCDT.substring(0, 16).split('-');
        this.Entity.p.ConsumptionDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
        this.ConsumptionDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.ConsumptionDate);
        this.Entity.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));
      }

      this.InitialEntity = Object.assign(
        StockConsume.CreateNewInstance(),
        this.utils.DeepCopy(this.Entity)
      );
    } catch (error) {
      await this.toastService.present('Failed to load stock details', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  // Date Selection
  public async onConsumptionDateChange(date: any): Promise<void> {
    this.Entity.p.ConsumptionDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.ConsumptionDate = this.Entity.p.ConsumptionDate ?? null;
  }

  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  // Dropdown Fetchers
  getSiteListByCompanyRef = async () => {
    this.SiteList = [];
    if (this.companyRef <= 0) return;
    this.SiteList = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
  }

  getStageListByCompanyRef = async () => {
    this.StageList = [];
    if (this.companyRef <= 0) return;
    this.StageList = await Stage.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
  }

  getMaterialListBySiteRef = async (siteRef: number) => {
    this.MaterialList = [];
    if (siteRef <= 0 || this.companyRef <= 0) return;
    this.MaterialList = await StockConsume.FetchMaterialListBySiteRef(siteRef, this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
  }

  onSiteChange = () => {
    this.Entity.p.MaterialRef = 0;
    this.selectedMaterial = [];
    this.MaterialName = '';
  }

  getUnitByMaterialRef = async (siteRef: number, materialRef: number) => {
    try {
      if (siteRef <= 0 || materialRef <= 0) return;

      await this.loadingService.show();
      const lst = await MaterialCurrentStock.FetchMaterialData(siteRef, materialRef, this.companyRef, async errMsg => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      });

      if (lst?.length) {
        this.Entity.p.UnitRef = lst[0].p.UnitRef;
        this.Entity.p.UnitName = lst[0].p.UnitName;
        this.Entity.p.CurrentQuantity = lst[0].p.CurrentQuantity;
        this.CalculateRemainingQty();
      }
    } finally {
      await this.loadingService.hide();
    }
  }

  CalculateRemainingQty = () => {
    const currentQty = Number(this.Entity.p.CurrentQuantity);
    const consumedQty = Number(this.Entity.p.ConsumedQuantity);
    this.Entity.p.RemainingQuantity = currentQty - consumedQty;
  }

  // Save logic
  SaveStockConsumption = async () => {
    try {
      this.isSaveDisabled = true;
      this.Entity.p.CompanyRef = this.companyRef;
      this.Entity.p.CompanyName = this.appStateManage.localStorage.getItem('companyName') || '';
      this.Entity.p.ConsumptionDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.ConsumptionDate);
      this.Entity.p.UpdatedBy = this.companyRef;
      this.Entity.p.CreatedBy = this.companyRef;

      const entityToSave = this.Entity.GetEditableVersion();
      await this.Entity.EnsurePrimaryKeysWithValidValues();
      const tr = await this.utils.SavePersistableEntities([entityToSave]);

      if (!tr.Successful) {
        await this.toastService.present(tr.Message, 1000, 'danger');
        await this.haptic.error();
        return;
      }

      await this.toastService.present(this.IsNewEntity ? 'Stock Consume saved' : 'Stock Consume updated', 1000, 'success');
      await this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/stock-consume']);
      await this.haptic.success();
    } finally {
      this.isSaveDisabled = false;
    }
  }

  // Bottom Sheet Selectors
  public async selectSiteBottomsheet(): Promise<void> {
    const options = this.SiteList;
    this.openSelectModal(options, this.selectedSite, false, 'Select Site', 1, async (selected) => {
      this.selectedSite = selected;
      this.Entity.p.SiteRef = selected[0].p.Ref || 0;
      this.SiteName = selected[0].p.Name || '';
      await this.getMaterialListBySiteRef(this.Entity.p.SiteRef);
      this.onSiteChange();
    });
  }

  public async selectMaterialBottomsheet(): Promise<void> {
    const options = this.MaterialList.map(item => ({
      ...item,
      p: { ...item.p, Name: item.p.MaterialName, Ref: item.p.MaterialRef }
    }));
    this.openSelectModal(options, this.selectedMaterial, false, 'Select Material', 1, async (selected) => {
      this.selectedMaterial = selected;
      this.Entity.p.MaterialRef = selected[0].p.MaterialRef || 0;
      this.MaterialName = selected[0].p.MaterialName || '';
      if (this.Entity.p.SiteRef && this.Entity.p.MaterialRef) {
        await this.getUnitByMaterialRef(this.Entity.p.SiteRef, this.Entity.p.MaterialRef);
      }
    });
  }

  public async selectStageBottomsheet(): Promise<void> {
    const options = this.StageList;
    this.openSelectModal(options, this.selectedStage, false, 'Select Stage', 1, async (selected) => {
      this.selectedStage = selected;
      this.Entity.p.StageRef = selected[0]?.p?.Ref || 0;
      this.StageName = selected[0]?.p?.Name || '';
    });
  }

  private async openSelectModal(dataList: any[], selectedItems: any[], multiSelect: boolean, title: string, MaxSelection: number, updateCallback: (selected: any[]) => void) {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(dataList, selectedItems, multiSelect, title, MaxSelection);
    if (selected) updateCallback(selected);
  }

  isDataFilled(): boolean {
    const emptyEntity = StockConsume.CreateNewInstance();
    return !this.deepEqualIgnoringKeys(this.Entity, emptyEntity, ['p.ConsumptionDate']);
  }

  deepEqualIgnoringKeys(obj1: any, obj2: any, ignorePaths: string[]): boolean {
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

  goBack = async () => {
    if (this.isDataFilled()) {
      this.alertService.presentDynamicAlert({
        header: 'Warning',
        subHeader: 'Confirmation needed',
        message: 'You have unsaved data. Are you sure you want to go back? All data will be lost.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => console.log('User cancelled.')
          },
          {
            text: 'Yes, Close',
            cssClass: 'custom-confirm',
            handler: () => {
              this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/stock-consume'], { replaceUrl: true });
              this.haptic.success();
            }
          }
        ]
      });
    } else {
      this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/stock-consume'], { replaceUrl: true });
      this.haptic.success();
    }
  }
}
