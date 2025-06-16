import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { MaterialFromOrder } from 'src/app/classes/domain/entities/website/masters/material/orderedmaterial/materialfromorder';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { InwardMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/inwardmaterial/inwardmaterial';
import { StockInward } from 'src/app/classes/domain/entities/website/stock_management/stock_inward/stockinward';
import { MaterialStockOrder } from 'src/app/classes/domain/entities/website/stock_management/stock_order/materialstockorder/materialstockorder';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-stock-inward-details',
   standalone: false,
  templateUrl: './stock-inward-details.component.html',
  styleUrls: ['./stock-inward-details.component.scss'],
})
export class StockInwardDetailsComponent  implements OnInit {
 Entity: StockInward = StockInward.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Stock Inward' | 'Edit Stock Inward' = 'New Stock Inward';
  IsDropdownDisabled: boolean = false;
  InitialEntity: StockInward = null as any;
  SiteList: Site[] = [];
  MaterialList: MaterialFromOrder[] = [];
  AllMaterialList: MaterialFromOrder[] = [];
  localEstimatedStartingDate: string = '';
  localEstimatedEndDate: string = '';
  ModalEditable: boolean = false;
  materialheaders: string[] = ['Sr.No.', 'Material Name ', 'Unit', 'Ordered Qty.','Inward Qty.','Remaining Qty.', 'Action'];
  ismaterialModalOpen: boolean = false;
  newInward: InwardMaterialDetailProps = InwardMaterialDetailProps.Blank();
  editingIndex: null | undefined | number
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  strCDT: string = ''
  NameWithoutNos: string = ValidationPatterns.NameWithoutNos
  PinCodePattern: string = ValidationPatterns.PinCode;
  INDPhoneNo: string = ValidationPatterns.INDPhoneNo;

  NameWithoutNosMsg: string = ValidationMessages.NameWithoutNosMsg
  PinCodeMsg: string = ValidationMessages.PinCodeMsg;
  INDPhoneNoMsg: string = ValidationMessages.INDPhoneNoMsg;
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  @ViewChild('requisitionForm') requisitionForm!: NgForm;
  @ViewChild('DateCtrl') DateInputControl!: NgModel;
  @ViewChild('SiteCtrl') SiteInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils, private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.getSiteListByCompanyRef()
    this.getMaterialListByCompanyRef()
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Stock Inward' : 'Edit Stock Inward';
      this.Entity = StockInward.GetCurrentInstance();
      console.log('Entity :', this.Entity);
      this.appStateManage.StorageKey.removeItem('Editable');
      if (this.Entity.p.OrderedDate != '') {
        this.Entity.p.OrderedDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.OrderedDate)
      }
       if (this.Entity.p.InwardDate != '') {
        this.Entity.p.InwardDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.InwardDate)
      }
      this.getVendorDataByVendorRef(this.Entity.p.VendorRef)
      // this.getUnitByMaterialRef(this.Entity.p.MaterialInwardDetailsArray[0].MaterialRef)
    } else {
      this.Entity = StockInward.CreateNewInstance();
      StockInward.SetCurrentInstance(this.Entity);
      // if (this.Entity.p.Date == '') {
      //   this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
      //   let parts = this.strCDT.substring(0, 16).split('-');
      //   // Construct the new date format
      //   this.Entity.p.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
      //   this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
      // }
    }
    this.InitialEntity = Object.assign(
      StockInward.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as StockInward;
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

  getMaterialListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await MaterialFromOrder.FetchOrderedMaterials(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.AllMaterialList = lst;
     this.filterMaterialList();
  }

  getMaterialOrderedQtyByMaterialRef = async (ref:number) => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await MaterialStockOrder.FetchMaterialQuantity(ref,this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log('lst :', lst);
  }

   filterMaterialList() {
    const usedRefs = this.Entity.p.MaterialInwardDetailsArray.map(item => item.MaterialRequisitionDetailsRef);
    this.MaterialList = this.AllMaterialList.filter(
      material => !usedRefs.includes(material.p.Ref)
    );
  }

  getUnitByMaterialRef = async (materialref: number) => {
    console.log('materialref :', materialref);
    this.newInward.UnitRef = 0;
    this.newInward.UnitName = '';
    this.newInward.MaterialName = ''
    if (materialref <= 0 || materialref <= 0) {
      await this.uiUtils.showErrorToster('Material not Selected');
      return;
    }
    let lst = await MaterialFromOrder.FetchInstance(materialref, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.newInward.UnitRef = lst.p.UnitRef;
    this.newInward.UnitName = lst.p.UnitName;
    this.newInward.MaterialName = lst.p.MaterialName
    this.getMaterialOrderedQtyByMaterialRef(lst.p.Ref)
  }

  getVendorDataByVendorRef = async (vendorref: number) => {
    console.log('vendorref :', vendorref);
    this.Entity.p.VendorTradeName = '';
    this.Entity.p.VendorMobNo = '';
    if (vendorref <= 0 || vendorref <= 0) {
      await this.uiUtils.showErrorToster('Material not Selected');
      return;
    }
    let lst = await Vendor.FetchInstance(vendorref, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    console.log('lst :', lst);
    this.Entity.p.VendorTradeName = lst.p.TradeName;
    this.Entity.p.VendorMobNo = lst.p.MobileNo;
  }

  CalculateRemainingQty = () =>{
    const OrderedQty = Number(this.newInward.OrderedQty)
    const InwardQty = Number(this.newInward.InwardQty)
    this.newInward.RemainingQty = OrderedQty - InwardQty
  }

  openModal(type: string) {
    if (type === 'material') this.ismaterialModalOpen = true;
    this.ModalEditable = false;
  }

  closeModal = async (type: string) => {
    if (type === 'material') {
      const keysToCheck = ['MaterialRef', 'UnitRef', 'OrderedQty', 'InwardQty', 'RemainingQty'] as const;

      const hasData = keysToCheck.some(key => {
        const value = (this.newInward as any)[key];

        // Check for non-null, non-undefined, non-empty string or non-zero number
        if (typeof value === 'string') {
          return value.trim() !== '';
        } else if (typeof value === 'number') {
          return !isNaN(value) && value !== 0;
        } else {
          return value != null; // for cases like object refs or non-primitive types
        }
      });

      if (hasData) {
        await this.uiUtils.showConfirmationMessage(
          'Close',
          `This process is <strong>IRREVERSIBLE!</strong><br/>
         Are you sure you want to close this modal?`,
          async () => {
            this.ismaterialModalOpen = false;
            this.ModalEditable = false;
            this.newInward = InwardMaterialDetailProps.Blank();
          }
        );
      } else {
        this.ismaterialModalOpen = false;
        this.newInward = InwardMaterialDetailProps.Blank();
      }
    }
  };


  async addMaterial() {
    if (this.newInward.MaterialRequisitionDetailsRef <= 0 || this.newInward.InwardQty < 0) {
      await this.uiUtils.showErrorMessage('Error', 'Inward Quantity can not be less than 0');
      return;
    }

    if (this.editingIndex !== null && this.editingIndex !== undefined && this.editingIndex >= 0) {
      this.Entity.p.MaterialInwardDetailsArray[this.editingIndex] = { ...this.newInward };
      await this.uiUtils.showSuccessToster('material details updated successfully');
      this.ismaterialModalOpen = false;

    } else {
      // let materialInstance = new RequiredMaterial(this.newInward, true);
      // let StockInwardInstance = new StockInward(this.Entity.p, true);
      // await materialInstance.EnsurePrimaryKeysWithValidValues();
      // await StockInwardInstance.EnsurePrimaryKeysWithValidValues();
      this.newInward.MaterialInwardRef = this.Entity.p.Ref;
      this.Entity.p.MaterialInwardDetailsArray.push({ ...this.newInward });
      await this.uiUtils.showSuccessToster('material added successfully');
    }
    this.newInward = InwardMaterialDetailProps.Blank();
    this.editingIndex = null;
    this.filterMaterialList();
  }

  editMaterial(index: number) {
    this.ismaterialModalOpen = true
    this.newInward = { ...this.Entity.p.MaterialInwardDetailsArray[index] }
    this.ModalEditable = true;
    this.editingIndex = index;
  }

  async removeMaterial(index: number) {
    // this.Entity.p.StockInwardManagementmaterialDetails.splice(index, 1); // Remove material
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this material?`,
      async () => {
        this.Entity.p.MaterialInwardDetailsArray.splice(index, 1);
        this.filterMaterialList();
      }
    );
  }

  SaveStockInward = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    // this.Entity.p.LoginEmployeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    // this.newInward.StockInwardRef = this.Entity.p.Ref
    this.Entity.p.OrderedDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.OrderedDate)
    this.Entity.p.InwardDate = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.InwardDate)
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entitiesToSave :', entitiesToSave);
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message)
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Stock Inward saved successfully');
        this.Entity = StockInward.CreateNewInstance();
        this.resetAllControls()
      } else {
        await this.uiUtils.showSuccessToster('Stock Inward Updated successfully');
        await this.router.navigate(['/homepage/Website/Stock_Inward']);
      }
    }
  };


  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackStockInward = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Stock Inward Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Stock_Inward']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Stock_Inward']);
    }
  }

  resetAllControls() {
    this.requisitionForm.resetForm(); // this will reset all form controls to their initial state
  }
}

