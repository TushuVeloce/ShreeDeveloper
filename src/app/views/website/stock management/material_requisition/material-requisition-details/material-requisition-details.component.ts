import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { Employee } from 'src/app/classes/domain/entities/website/masters/employee/employee';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { MaterialRequisition } from 'src/app/classes/domain/entities/website/stock_management/material_requisition/materialrequisition';
import { RequiredMaterial, RequiredMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/material_requisition/requiredmaterial/requiredmaterial';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-material-requisition-details',
  standalone: false,
  templateUrl: './material-requisition-details.component.html',
  styleUrls: ['./material-requisition-details.component.scss'],
})
export class MaterialRequisitionDetailsComponent implements OnInit {
  Entity: MaterialRequisition = MaterialRequisition.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Material Requisition' | 'Edit Material Requisition' = 'New Material Requisition';
  IsDropdownDisabled: boolean = false;
  InitialEntity: MaterialRequisition = null as any;
  SiteList: Site[] = [];
  AllMaterialList: Material[] = [];
  MaterialList: Material[] = [];
  localEstimatedStartingDate: string = '';
  localEstimatedEndDate: string = '';
  plotheaders: string[] = ['Sr.No.', 'Plot No', 'Area sq.m', 'Area sq.ft', 'Goverment Rate', 'Company Rate', 'Action'];
  materialheaders: string[] = ['Sr.No.', 'Material Name ', 'Unit', 'Estimated Qty', 'Action'];
  ismaterialModalOpen: boolean = false;
  newRequisition: RequiredMaterialDetailProps = RequiredMaterialDetailProps.Blank();
  editingIndex: null | undefined | number
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  strCDT: string = ''
  ModalEditable: boolean = false;
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
      this.DetailsFormTitle = this.IsNewEntity ? 'New Material Requisition' : 'Edit Material Requisition';
      this.Entity = MaterialRequisition.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      if (this.Entity.p.Date != '') {
        this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date)
      }
      // this.getUnitByMaterialRef(this.Entity.p.MaterialRequisitionDetailsArray[0].MaterialRef)
    } else {
      this.Entity = MaterialRequisition.CreateNewInstance();
      MaterialRequisition.SetCurrentInstance(this.Entity);
      if (this.Entity.p.Date == '') {
        this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
        let parts = this.strCDT.substring(0, 16).split('-');
        // Construct the new date format
        this.Entity.p.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
      }
    }
    this.InitialEntity = Object.assign(
      MaterialRequisition.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as MaterialRequisition;
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
    let lst = await Material.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.AllMaterialList = lst;
    this.filterMaterialList();
  }

  getUnitByMaterialRef = async (materialref: number) => {
    this.newRequisition.UnitRef = 0;
    this.newRequisition.UnitName = '';
    this.newRequisition.MaterialName = ''
    if (materialref <= 0 || materialref <= 0) {
      await this.uiUtils.showErrorToster('Material not Selected');
      return;
    }
    let lst = await Material.FetchInstance(materialref, this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.newRequisition.UnitRef = lst.p.UnitRef;
    this.newRequisition.UnitName = lst.p.UnitName;
    this.newRequisition.MaterialName = lst.p.Name
  }

  openModal(type: string) {
    if (type === 'material') this.ismaterialModalOpen = true;
    this.ModalEditable = false;
  }

  closeModal = async (type: string) => {
    if (type === 'material') {
      const keysToCheck = ['MaterialRef', 'UnitRef', 'EstimatedQty'] as const;

      const hasData = keysToCheck.some(key => {
        const value = (this.newRequisition as any)[key];

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
            this.newRequisition = RequiredMaterialDetailProps.Blank();
          }
        );
      } else {
        this.ismaterialModalOpen = false;
        this.newRequisition = RequiredMaterialDetailProps.Blank();
      }
    }
  };

  filterMaterialList() {
    const usedRefs = this.Entity.p.MaterialRequisitionDetailsArray.map(item => item.MaterialRef);
    this.MaterialList = this.AllMaterialList.filter(
      material => !usedRefs.includes(material.p.Ref)
    );
  }


  async addMaterial() {
    if (this.newRequisition.MaterialRef == 0) {
      return this.uiUtils.showWarningToster('Material cannot be blank.');
    }
    if (this.newRequisition.EstimatedQty == 0) {
      return this.uiUtils.showWarningToster('Required Quantity cannot be blank.');
    }

    if (this.editingIndex !== null && this.editingIndex !== undefined && this.editingIndex >= 0) {
      this.Entity.p.MaterialRequisitionDetailsArray[this.editingIndex] = { ...this.newRequisition };
      await this.uiUtils.showSuccessToster('material details updated successfully');
      this.ismaterialModalOpen = false;

    } else {
      this.newRequisition.MaterialRequisitionRef = this.Entity.p.Ref;
      this.Entity.p.MaterialRequisitionDetailsArray.push({ ...this.newRequisition });
      await this.uiUtils.showSuccessToster('material added successfully');
    }
    this.newRequisition = RequiredMaterialDetailProps.Blank();
    this.editingIndex = null;
    this.filterMaterialList();
  }

  editMaterial(index: number) {
    this.ismaterialModalOpen = true
    this.newRequisition = { ...this.Entity.p.MaterialRequisitionDetailsArray[index] }
    this.ModalEditable = true;
    this.editingIndex = index;
  }

  async removeMaterial(index: number) {
    // this.Entity.p.MaterialRequisitionManagementmaterialDetails.splice(index, 1); // Remove material
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
     Are you sure that you want to DELETE this material?`,
      async () => {
        this.Entity.p.MaterialRequisitionDetailsArray.splice(index, 1);
        this.filterMaterialList();
      }
    );
  }

  SaveMaterialRequisition = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.newRequisition.MaterialRequisitionRef = this.Entity.p.Ref
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.Date)
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
        await this.uiUtils.showSuccessToster('MaterialRequisition saved successfully');
        this.Entity = MaterialRequisition.CreateNewInstance();
        this.resetAllControls()
      } else {
        await this.uiUtils.showSuccessToster('Material Requisition Updated successfully');
      }
      await this.router.navigate(['/homepage/Website/Material_Requisition']);
    }
  };


  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  BackMaterialRequisition = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Material Requisition Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Material_Requisition']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Material_Requisition']);
    }
  }

  resetAllControls() {
    this.requisitionForm.resetForm(); // this will reset all form controls to their initial state
  }
}
