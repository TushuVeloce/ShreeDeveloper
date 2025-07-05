import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { StockConsume } from 'src/app/classes/domain/entities/website/stock_management/stock_consume/stockconsume';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ToastService } from '../../core/toast.service';
import { HapticService } from '../../core/haptic.service';
import { AlertService } from '../../core/alert.service';
import { LoadingService } from '../../core/loading.service';
import { Utils } from 'src/app/services/utils.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { DatePipe } from '@angular/common';
import { MaterialCurrentStock } from 'src/app/classes/domain/entities/website/stock_management/Material-Current-Stock/materialcurrentstock';

@Component({
  selector: 'app-stock-consume-details-mobile',
  templateUrl: './stock-consume-details-mobile.page.html',
  styleUrls: ['./stock-consume-details-mobile.page.scss'],
  standalone: false
})
export class StockConsumeDetailsMobilePage implements OnInit {
  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: StockConsume = StockConsume.CreateNewInstance();
  DetailsFormTitle: 'New Stock Consumption' | 'Edit Stock Consumption' =
    'New Stock Consumption';
  InitialEntity: StockConsume = null as any;
  SiteList: Site[] = [];
  MaterialList: StockConsume[] = [];
  StageList: Stage[] = [];
  companyRef: number = 0;

  gstName: string = '';
  selectedGST: any[] = [];

  selectedSite: any[] = [];
  SiteName: string = '';

  selectedStage: any[] = [];
  StageName: string = '';

  selectedMaterial: any[] = [];
  MaterialName: string = '';

  showConsumptionDatePicker = false;
  ConsumptionDate = '';
  DisplayConsumptionDate = '';

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
    private DateconversionService: DateconversionService,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private utils: Utils,
    private datePipe: DatePipe,
    private baseUrl: BaseUrlService,
  ) { }

  ngOnInit = async () => {
    await this.loadMaterialRequisitionDetailsIfCompanyExists();

  }
  ionViewWillEnter = async () => {
    await this.loadMaterialRequisitionDetailsIfCompanyExists();
  }
  ngOnDestroy() {
    // Cleanup if needed
  }

  private async loadMaterialRequisitionDetailsIfCompanyExists() {
    try {
      await this.loadingService.show();
      this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));

      if (this.companyRef > 0) {
        this.appStateManage.setDropdownDisabled(true);
        this.getSiteListByCompanyRef;
        this.getStageListByCompanyRef;

        const isEditable = this.appStateManage.StorageKey.getItem('Editable') === 'Edit';
        this.IsNewEntity = !isEditable;
        this.DetailsFormTitle = this.IsNewEntity
          ? 'New Stock Consumption'
          : 'Edit Stock Consumption';
        if (isEditable) {
          this.IsNewEntity = false;
          this.Entity = StockConsume.GetCurrentInstance();
          this.appStateManage.StorageKey.removeItem('Editable');
          if (this.Entity.p.ConsumptionDate != '') {
            this.Entity.p.ConsumptionDate = this.dtu.ConvertStringDateToShortFormat(
              this.Entity.p.ConsumptionDate
            );
          }
          if (this.Entity.p.SiteRef > 0) {
            this.getMaterialListBySiteRef(this.Entity.p.SiteRef);
          }
          this.selectedSite = [{ p: { Ref: this.Entity.p.SiteRef, Name: this.Entity.p.SiteName } }];
          this.SiteName = this.Entity.p.SiteName;
          this.selectedStage = [{ p: { Ref: this.Entity.p.StageRef, Name: this.Entity.p.StageName } }];
          this.StageName = this.Entity.p.StageName;
          this.selectedMaterial = [{ p: { Ref: this.Entity.p.MaterialRef, Name: this.Entity.p.MaterialName } }];
          this.MaterialName = this.Entity.p.MaterialName;

          this.appStateManage.StorageKey.removeItem('Editable');
        } else {
          this.Entity = StockConsume.CreateNewInstance();
          StockConsume.SetCurrentInstance(this.Entity);
          this.Entity.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));
        }
        this.InitialEntity = Object.assign(
          StockConsume.CreateNewInstance(),
          this.utils.DeepCopy(this.Entity)
        ) as StockConsume;

      } else {
        await this.toastService.present('Company not selected', 1000, 'danger');
        await this.haptic.error();
      }
    } catch (error) {
      console.error('Error loading stock Transfer details:', error);
      await this.toastService.present('Failed to load stock Transfer details', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }


  public async onConsumptionDateChange(date: any): Promise<void> {
    console.log('date :', date);
    this.ConsumptionDate = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.ConsumptionDate = this.ConsumptionDate;
    this.DisplayConsumptionDate = this.ConsumptionDate;
  }

  // Extracted from services date conversion //
  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }
  getSiteListByCompanyRef = async () => {
    this.SiteList = [];
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SiteList = lst;
  }


  getMaterialListBySiteRef = async (SiteRef: number) => {
    this.MaterialList = [];
    if(SiteRef <= 0){
      return;
    }
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await StockConsume.FetchMaterialListBySiteRef(SiteRef,this.companyRef,async (errMsg) => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error '+ errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    console.log('lst :', lst);
    this.MaterialList = lst;
    // const uniqueMap = new Map();
    // lst.forEach((item) => {
    //   if (!uniqueMap.has(item.p.MaterialRef)) {
    //     uniqueMap.set(item.p.MaterialRef, item);
    //   }
    // });
    // this.MaterialList = Array.from(uniqueMap.values());
    // this.Entity.p.SiteRef = this.SiteList[0].p.Ref;
  };

 onSiteChange = () => {
    this.Entity.p.MaterialRef = 0;
    this.Entity.p.UnitRef = 0;
    this.Entity.p.UnitName = '';
    this.Entity.p.CurrentQuantity = 0;
    this.Entity.p.ConsumedQuantity = 0;
    this.Entity.p.RemainingQuantity = 0;
  };

  getStageListByCompanyRef = async () => {
    // this.Entity.p.StageRef = 0;
    this.StageList = [];
    if (this.companyRef <= 0) {
      // await this.uiUtils.showErrorToster('Company not Selected');
      await this.toastService.present('Company not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    let lst = await Stage.FetchEntireListByCompanyRef(
      this.companyRef,
      async (errMsg) => {
        // await this.uiUtils.showErrorMessage('Error', errMsg)
        await this.toastService.present('Error ' + errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    this.StageList = lst;
  };

  getUnitByMaterialRef = async (siteref:number,materialref: number) => {
    this.Entity.p.UnitRef = 0;
    this.Entity.p.UnitName = '';
    this.Entity.p.CurrentQuantity = 0;
    if(siteref < 0){
       return;
    }
    if (materialref <= 0) {
      return;
    }
    let lst = await MaterialCurrentStock.FetchMaterialData(siteref,materialref, this.companyRef, async errMsg => {
      // await this.uiUtils.showErrorMessage('Error', errMsg)
      await this.toastService.present('Error ' + errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    console.log('lst :', lst);
    // const UnitData = this.MaterialList.find(
    //   (data) => data.p.MaterialRef == materialref
    // );
    if (lst) {
      this.Entity.p.UnitRef = lst[0].p.UnitRef;
      this.Entity.p.UnitName = lst[0].p.UnitName;
      this.Entity.p.CurrentQuantity = lst[0].p.CurrentQuantity;
      this.CalculateRemainingQty();
    }
  };

  CalculateRemainingQty = () => {
    const inwardqty = Number(this.Entity.p.ConsumedQuantity);
    const currentqty = Number(this.Entity.p.CurrentQuantity);
    this.Entity.p.RemainingQuantity = currentqty - inwardqty;
  };

  SaveStockConsumption = async () => {
    this.Entity.p.CompanyRef = this.companyRef;
    this.Entity.p.CompanyName = this.appStateManage.localStorage.getItem('companyName') ||''
    this.Entity.p.ConsumptionDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.ConsumptionDate);
    this.Entity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'))
    this.Entity.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'))
    if(this.Entity.p.Remark == ''){
      this.Entity.p.Remark == ''
    }
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entitiesToSave :', entitiesToSave);
    await this.Entity.EnsurePrimaryKeysWithValidValues();
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      // this.uiUtils.showErrorMessage('Error', tr.Message);
      await this.toastService.present('Error ' + tr.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        // await this.uiUtils.showSuccessToster(
        //   'Stock Consume saved successfully'
        // );
        await this.toastService.present('Stock Consume saved successfully', 1000, 'success');
        await this.haptic.success();
        this.Entity = StockConsume.CreateNewInstance();
        // this.resetAllControls();
      } else {
        // await this.uiUtils.showSuccessToster(
        //   'Stock Consume Updated successfully'
        // );
        await this.toastService.present('Stock Consume Updated successfully', 1000, 'success');
        await this.haptic.success();
        await this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-consume']);
      }
    }
  };

  
  public async selectMaterialBottomsheet(): Promise<void> {
    try {
      const options = this.MaterialList.map(item => ({
        ...item,
        p: {
          ...item.p,
          Name: item.p.MaterialName, // Add 'Name'
          Ref: item.p.MaterialRef   // Add 'Ref'
        }
      }));
      // const options = this.MaterialList;
      this.openSelectModal(options, this.selectedMaterial, false, 'Select Material', 1, async (selected) => {
        this.selectedMaterial = selected;
        this.Entity.p.MaterialRef = selected[0].p.MaterialRef || 0;
        this.MaterialName = selected[0].p.MaterialName || '';

        if (this.Entity.p.SiteRef && this.Entity.p.MaterialRef) {
          await this.getUnitByMaterialRef(this.Entity.p.SiteRef, this.Entity.p.MaterialRef);
        }
      });
    } catch (error) {
      console.error('Material selection error:', error);
    }
  }

  public async selectSiteBottomsheet(): Promise<void> {
    try {
      const options = this.SiteList;
      this.openSelectModal(options, this.selectedSite, false, 'Select Site', 1, async (selected) => {
        this.selectedSite = selected;
        this.Entity.p.SiteRef = selected[0]?.p?.Ref || 0;
        this.SiteName = selected[0]?.p?.Name || '';

        await this.getMaterialListBySiteRef(this.Entity.p.SiteRef);
        // this.onSiteChange();
        // await this.SiteValidation();
      });
    } catch (error) {
      console.error('site selection error:', error);
    }
  }

  public async selectStageBottomsheet(): Promise<void> {
    try {
      const options = this.SiteList;
      this.openSelectModal(options, this.selectedStage, false, 'Select Stage', 1, async (selected) => {
        this.selectedStage = selected;
        this.Entity.p.StageRef = selected[0]?.p?.Ref || 0;
        this.StageName = selected[0]?.p?.Name || '';
        // await this.SiteValidation();
      });
    } catch (error) {
      console.error('stage selection error:', error);
    }
  }
  private async openSelectModal(
    dataList: any[],
    selectedItems: any[],
    multiSelect: boolean,
    title: string,
    MaxSelection: number,
    updateCallback: (selected: any[]) => void
  ): Promise<void> {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(dataList, selectedItems, multiSelect, title, MaxSelection);
    if (selected) updateCallback(selected);
  }
  isDataFilled(): boolean {
    const emptyEntity = StockConsume.CreateNewInstance();
    console.log('emptyEntity :', emptyEntity);
    console.log('this Entity :', this.Entity);
    return !this.deepEqualIgnoringKeys(this.Entity, emptyEntity, ['p.Date']);
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

    const cleanedObj1 = clean(obj1);
    const cleanedObj2 = clean(obj2);

    return JSON.stringify(cleanedObj1) === JSON.stringify(cleanedObj2);
  }

  goBack = async () => {
    // Replace this with your actual condition to check if data is filled
    const isDataFilled = this.isDataFilled(); // Implement this function based on your form

    if (isDataFilled) {
      this.alertService.presentDynamicAlert({
        header: 'Warning',
        subHeader: 'Confirmation needed',
        message: 'You have unsaved data. Are you sure you want to go back? All data will be lost.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {
              console.log('User cancelled.');
            }
          },
          {
            text: 'Yes, Close',
            cssClass: 'custom-confirm',
            handler: () => {
              this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-consume'], { replaceUrl: true });
              this.haptic.success();
              console.log('User confirmed.');
            }
          }
        ]
      });
    } else {
      this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/stock-consume'], { replaceUrl: true });
      this.haptic.success();
    }
  }
}
