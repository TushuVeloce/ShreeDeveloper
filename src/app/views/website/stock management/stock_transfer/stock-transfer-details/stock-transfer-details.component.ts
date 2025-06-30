import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { StockTransfer } from 'src/app/classes/domain/entities/website/stock_management/stock-transfer/stocktransfer';
import { StockConsume } from 'src/app/classes/domain/entities/website/stock_management/stock_consume/stockconsume';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-stock-transfer-details',
  templateUrl: './stock-transfer-details.component.html',
  styleUrls: ['./stock-transfer-details.component.scss'],
  standalone: false,
})
export class StockTransferDetailsComponent  implements OnInit {

  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: StockTransfer = StockTransfer.CreateNewInstance();
  DetailsFormTitle: 'New Stock Transfer' | 'Edit Stock Transfer' = 'New Stock Transfer';
  InitialEntity: StockTransfer = null as any;
  SiteList: Site[] = [];
  MaterialList: StockConsume[] = [];
  GSTList = DomainEnums.GoodsAndServicesTaxList(true, '--Select GST --');
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  NameWithNosAndSpace: string = ValidationPatterns.NameWithNosAndSpace

  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg
  NameWithNosAndSpaceMsg: string = ValidationMessages.NameWithNosAndSpaceMsg

  @ViewChild('transferForm') transferForm!: NgForm;
   @ViewChild('DateCtrl') DateInputControl!: NgModel;
  @ViewChild('TransferredQuantityCtrl') TransferredQuantityInputControl!: NgModel;
  @ViewChild('RateCtrl') RateInputControl!: NgModel;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement, private dtu: DTU,) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.getSiteListByCompanyRef();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Stock Transfer' : 'Edit Stock Transfer';
      this.Entity = StockTransfer.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')
      if (this.Entity.p.Date != '') {
        this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date)
      }
      this.getMaterialListBySiteRef(this.Entity.p.FromSiteRef);
    } else {
      this.Entity = StockTransfer.CreateNewInstance();
      StockTransfer.SetCurrentInstance(this.Entity);
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    this.InitialEntity = Object.assign(StockTransfer.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as StockTransfer;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Amount')!;
    txtName.focus();
  }

  getSiteListByCompanyRef = async () => {
    this.SiteList = [];
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

getMaterialListBySiteRef = async (SiteRef: number) => {
    this.Entity.p.MaterialRef = 0
    if(this.Entity.p.MaterialRef > 0){
      this.getUnitByMaterialRef( this.Entity.p.MaterialRef )
    }
    this.MaterialList = [];
    if (this.companyRef() <= 0 && SiteRef < 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await StockConsume.FetchMaterialListBySiteRef(
      SiteRef,
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    console.log('lst :', lst);
    this.MaterialList = lst;
  };

 getUnitByMaterialRef = async (materialref: number) => {
    this.Entity.p.UnitRef = 0;
    this.Entity.p.UnitName = '';
    if (materialref <= 0) {
      await this.uiUtils.showErrorToster('Material not Selected');
      return;
    }
    // let lst = await MaterialFromOrder.FetchInstance(materialref, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    const UnitData = this.MaterialList.find((data) => data.p.MaterialRef == materialref)
    if (UnitData) {
      this.Entity.p.UnitRef = UnitData.p.UnitRef;
      this.Entity.p.UnitName = UnitData.p.UnitName;
    }
  }

    SiteValidation = async() =>{
      const FromSite = this.Entity.p.FromSiteRef
      const ToSite = this.Entity.p.ToSiteRef
    if(FromSite == ToSite){
       await this.uiUtils.showWarningToster("From Site and To Site can not be same");
         this.Entity.p.FromSiteRef = 0
         this.Entity.p.ToSiteRef = 0
    }
  }

  SaveStockTransfer = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.Date)
    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
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
        await this.uiUtils.showSuccessToster('Stock Transfer saved successfully');
        this.Entity = StockTransfer.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Stock Transfer Updated successfully');
        await this.router.navigate(['/homepage/Website/Stock_Transfer']);
      }
    }
  }

   calculateAmount = () => {
    const Rate = Number(this.Entity.p.Rate);
     const GSTOnRate = Number((this.Entity.p.GST / 100) * Rate);
    this.Entity.p.Amount = Math.ceil(Rate + GSTOnRate );
  }

   calculateRemainingQuantity = () => {
    const CurrentQuantity = Number(this.Entity.p.CurrentQuantity);
    const TransfferedQuantity = Number(this.Entity.p.TransferredQuantity);
    this.Entity.p.RemainingQuantity = Math.ceil(CurrentQuantity - TransfferedQuantity );
  }

  // for value 0 selected while click on Input //
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackStockTransfer = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Stock Transfer Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Stock_Transfer']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Stock_Transfer']);
    }
  }

  resetAllControls() {
    this.transferForm.resetForm(); // this will reset all form controls to their initial state
  }
}

