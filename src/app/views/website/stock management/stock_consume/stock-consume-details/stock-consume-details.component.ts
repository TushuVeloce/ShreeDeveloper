import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { MaterialFromOrder } from 'src/app/classes/domain/entities/website/masters/material/orderedmaterial/materialfromorder';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { StockConsume } from 'src/app/classes/domain/entities/website/stock_management/stock_consume/stockconsume';
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
export class StockConsumeDetailsComponent  implements OnInit {

  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: StockConsume = StockConsume.CreateNewInstance();
  DetailsFormTitle: 'New Stock Consumption' | 'Edit Stock Consumption' = 'New Stock Consumption';
  InitialEntity: StockConsume = null as any;
  SiteList: Site[] = [];
  MaterialList: MaterialFromOrder[] = [];
  StageList: Stage[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  NameWithNosAndSpace: string = ValidationPatterns.NameWithNosAndSpace

  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg
  NameWithNosAndSpaceMsg: string = ValidationMessages.NameWithNosAndSpaceMsg

  @ViewChild('consumptionForm') consumptionForm!: NgForm;
  @ViewChild('ConsumptionDateCtrl') ConsumptionDateInputControl!: NgModel;
  @ViewChild('ConsumedQuantityCtrl') ConsumedQuantityCtrlInputControl!: NgModel;
  @ViewChild('DescriptionCtrl') DescriptionInputControl!: NgModel;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement, private dtu: DTU,) {
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.getSiteListByCompanyRef();
    this.getMaterialListByCompanyRef();
    this.getStageListByCompanyRef()
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Stock Consumption' : 'Edit Stock Consumption';
      this.Entity = StockConsume.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      if (this.Entity.p.ConsumptionDate != '') {
        this.Entity.p.ConsumptionDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.ConsumptionDate)
      }
    } else {
      this.Entity = StockConsume.CreateNewInstance();
      StockConsume.SetCurrentInstance(this.Entity);
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    this.InitialEntity = Object.assign(StockConsume.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as StockConsume;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Amount')!;
    txtName.focus();
  }

  getSiteListByCompanyRef = async () => {
    this.SiteList = [];
    this.Entity.p.SiteRef = 0;
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
    // this.Entity.p.SiteRef = this.SiteList[0].p.Ref;
  }

   getMaterialListByCompanyRef = async () => {
    this.MaterialList = [];
    this.Entity.p.MaterialRef = 0;
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await MaterialFromOrder.FetchOrderedMaterials(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MaterialList = lst;
    // this.Entity.p.SiteRef = this.SiteList[0].p.Ref;
  }

  getStageListByCompanyRef = async () => {
    // this.Entity.p.StageRef = 0;
    this.StageList = []
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Stage.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.StageList = lst;
  }

   getUnitByMaterialRef = async (materialref: number) => {
    this.Entity.p.UnitRef = 0
    this.Entity.p.UnitName = ''
    if (materialref <= 0 || materialref <= 0) {
      return;
    }
    let lst = await MaterialFromOrder.FetchInstance(materialref, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.Entity.p.UnitRef = lst.p.UnitRef
    this.Entity.p.UnitName = lst.p.UnitName
  }


  SaveStockConsumption = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    this.Entity.p.ConsumptionDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.ConsumptionDate)
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave]
    console.log('entitiesToSave :', entitiesToSave);
    await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return
    }
    else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Stock Consume saved successfully');
        this.Entity = StockConsume.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Stock Consume Updated successfully');
        await this.router.navigate(['/homepage/Website/Stock_Consume']);
      }
    }
  }

  // for value 0 selected while click on Input //
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackStockConsumption = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Stock Consume Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Stock_Consume']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Stock_Consume']);
    }
  }

  resetAllControls() {
    this.consumptionForm.resetForm(); // this will reset all form controls to their initial state
  }
}
