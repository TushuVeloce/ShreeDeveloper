import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ValidationMessages,
  ValidationPatterns,
} from 'src/app/classes/domain/constants';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { MaterialFromOrder } from 'src/app/classes/domain/entities/website/masters/material/orderedmaterial/materialfromorder';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { MaterialCurrentStock } from 'src/app/classes/domain/entities/website/stock_management/Material-Current-Stock/materialcurrentstock';
import { StockConsume } from 'src/app/classes/domain/entities/website/stock_management/stock_consume/stockconsume';
import { InwardMaterial } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/inwardmaterial/inwardmaterial';
import { StockInward } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/stockinward';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-stock-consume-details',
  templateUrl: './stock-consume-details.component.html',
  styleUrls: ['./stock-consume-details.component.scss'],
  standalone: false,
})
export class StockConsumeDetailsComponent implements OnInit {
  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: StockConsume = StockConsume.CreateNewInstance();
  DetailsFormTitle: 'New Stock Consumption' | 'Edit Stock Consumption' =
    'New Stock Consumption';
  InitialEntity: StockConsume = null as any;
  SiteList: Site[] = [];
  MaterialList: StockConsume[] = [];
  StageList: Stage[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  strCDT: string = ''
  Date: string = ''


  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  @ViewChild('consumptionForm') consumptionForm!: NgForm;
  @ViewChild('ConsumptionDateCtrl') ConsumptionDateInputControl!: NgModel;
  @ViewChild('ConsumedQuantityCtrl') ConsumedQuantityCtrlInputControl!: NgModel;
  @ViewChild('DescriptionCtrl') DescriptionInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private dtu: DTU
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.getSiteListByCompanyRef();
    this.getStageListByCompanyRef();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Stock Consumption'
        : 'Edit Stock Consumption';
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
    } else {
      this.Entity = StockConsume.CreateNewInstance();
      StockConsume.SetCurrentInstance(this.Entity);

      this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      let parts = this.strCDT.substring(0, 16).split('-');
      // Construct the new date format
      this.Entity.p.ConsumptionDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
      this.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;

      this.Entity.p.CreatedBy = Number(
        this.appStateManage.StorageKey.getItem('LoginEmployeeRef')
      );
    }
    this.InitialEntity = Object.assign(
      StockConsume.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as StockConsume;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('SiteRef')!;
    txtName.focus();
  };

  getSiteListByCompanyRef = async () => {
    this.SiteList = [];
    this.Entity.p.SiteRef = 0;
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.SiteList = lst;
    // this.Entity.p.SiteRef = this.SiteList[0].p.Ref;
  };

  getMaterialListBySiteRef = async (SiteRef: number) => {
    this.MaterialList = [];
    if (SiteRef <= 0) {
      return;
    }
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await StockConsume.FetchMaterialListBySiteRef(SiteRef, this.companyRef(), async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MaterialList = lst;
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
    this.StageList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Stage.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.StageList = lst;
  };

  getUnitByMaterialRef = async (siteref: number, materialref: number) => {
    this.Entity.p.UnitRef = 0;
    this.Entity.p.UnitName = '';
    this.Entity.p.CurrentQuantity = 0;
    if (siteref < 0) {
      return;
    }
    if (materialref <= 0) {
      return;
    }
    let lst = await MaterialCurrentStock.FetchMaterialData(siteref, materialref, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));

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
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    this.Entity.p.ConsumptionDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.ConsumptionDate);
    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    if (this.Entity.p.Remark == '') {
      this.Entity.p.Remark == ''
    }
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    await this.Entity.EnsurePrimaryKeysWithValidValues();
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster(
          'Stock Consume saved successfully'
        );
        this.Entity = StockConsume.CreateNewInstance();
        this.resetAllControls();
        this.Entity.p.ConsumptionDate = this.Date;
      } else {
        await this.uiUtils.showSuccessToster(
          'Stock Consume Updated successfully'
        );
        await this.router.navigate(['/homepage/Website/Stock_Consume']);
      }
    }
  };

  // for value 0 selected while click on Input //
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackStockConsumption = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage(
        'Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Stock Consume Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Stock_Consume']);
        }
      );
    } else {
      await this.router.navigate(['/homepage/Website/Stock_Consume']);
    }
  };

  resetAllControls() {
    this.consumptionForm.resetForm(); // this will reset all form controls to their initial state
  }
}
