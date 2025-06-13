import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { MaterialRequisition } from 'src/app/classes/domain/entities/website/stock_management/material_requisition/materialrequisition';
import { RequiredMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/material_requisition/requiredmaterial/requiredmaterial';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-material-requisition-details-mobile',
  templateUrl: './material-requisition-details-mobile.page.html',
  styleUrls: ['./material-requisition-details-mobile.page.scss'],
  standalone:false
})
export class MaterialRequisitionDetailsMobilePage implements OnInit {
  Entity: MaterialRequisition = MaterialRequisition.CreateNewInstance();
  InitialEntity!: MaterialRequisition;
  SiteList: Site[] = [];
  MaterialList: Material[] = [];

  ismaterialModalOpen: boolean = false;
  editIndex: number | null = null;

  CurrentMaterial = {
    MaterialName: '',
    UnitName: '',
    EstimatedQty: ''
  };

  IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Material Requisition' | 'Edit Material Requisition' = 'New Material Requisition';

  companyRef = this.companystatemanagement.SelectedCompanyRef;
  strCDT: string = '';

  NameWithoutNos: string = ValidationPatterns.NameWithoutNos;
  PinCodePattern: string = ValidationPatterns.PinCode;
  INDPhoneNo: string = ValidationPatterns.INDPhoneNo;

  NameWithoutNosMsg: string = ValidationMessages.NameWithoutNosMsg;
  PinCodeMsg: string = ValidationMessages.PinCodeMsg;
  INDPhoneNoMsg: string = ValidationMessages.INDPhoneNoMsg;
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    await this.getSiteListByCompanyRef();
    await this.getMaterialListByCompanyRef();

    if (this.appStateManage.StorageKey.getItem('Editable') === 'Edit') {
      this.IsNewEntity = false;
      this.Entity = MaterialRequisition.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.DetailsFormTitle = 'Edit Material Requisition';

      if (this.Entity.p.Date) {
        this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
      }
    } else {
      this.Entity = MaterialRequisition.CreateNewInstance();
      MaterialRequisition.SetCurrentInstance(this.Entity);
      this.DetailsFormTitle = 'New Material Requisition';

      if (!this.Entity.p.Date) {
        this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
        const parts = this.strCDT.substring(0, 16).split('-');
        this.Entity.p.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
      }
    }

    this.InitialEntity = Object.assign(
      MaterialRequisition.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    );
  }

  async getSiteListByCompanyRef() {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.SiteList = await Site.FetchEntireListByCompanyRef(this.companyRef(), async err =>
      await this.uiUtils.showErrorMessage('Error', err)
    );
  }

  async getMaterialListByCompanyRef() {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.MaterialList = await Material.FetchEntireListByCompanyRef(this.companyRef(), async err =>
      await this.uiUtils.showErrorMessage('Error', err)
    );
  }

  editMaterial(index: number) {
    this.editIndex = index;
    // this.CurrentMaterial = { ...this.Entity.p.MaterialRequisitionDetailsArray[index] };
    this.ismaterialModalOpen = true;
  }

  async removeMaterial(index: number) {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong><br/>Are you sure you want to delete this material?`,
      async () => {
        this.Entity.p.MaterialRequisitionDetailsArray.splice(index, 1);
      }
    );
  }

  closeMaterialModal() {
    this.ismaterialModalOpen = false;
    this.CurrentMaterial = { MaterialName: '', UnitName: '', EstimatedQty: '' };
    this.editIndex = null;
  }

  async saveMaterial() {
    if (!this.CurrentMaterial.MaterialName || !this.CurrentMaterial.UnitName || !this.CurrentMaterial.EstimatedQty) {
      await this.uiUtils.showErrorMessage('Error', 'All fields are required!');
      return;
    }

    if (this.editIndex !== null) {
      // this.Entity.p.MaterialRequisitionDetailsArray[this.editIndex] = { ...this.CurrentMaterial };
      await this.uiUtils.showSuccessToster('Material updated successfully');
    } else {
      // this.Entity.p.MaterialRequisitionDetailsArray.push({ ...this.CurrentMaterial });
      await this.uiUtils.showSuccessToster('Material added successfully');
    }

    this.closeMaterialModal();
  }

  async SaveMaterialRequisition() {
    this.Entity.p.CompanyRef = this.companyRef();
    const empRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'));
    this.Entity.p.UpdatedBy = empRef;
    this.Entity.p.CreatedBy = empRef;
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.Date);

    const entityToSave = this.Entity.GetEditableVersion();
    const result = await this.utils.SavePersistableEntities([entityToSave]);

    if (!result.Successful) {
      this.isSaveDisabled = false;
      await this.uiUtils.showErrorMessage('Error', result.Message);
      return;
    }

    if (this.IsNewEntity) {
      await this.uiUtils.showSuccessToster('Material Requisition saved successfully');
      this.Entity = MaterialRequisition.CreateNewInstance();
    } else {
      await this.uiUtils.showSuccessToster('Material Requisition updated successfully');
      await this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/material-requisition']);
    }
  }

  async BackMaterialRequisition() {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage(
        'Cancel',
        `This process is IRREVERSIBLE!<br/>Are you sure you want to cancel?`,
        async () => {
          await this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/material-requisition']);
        }
      );
    } else {
      await this.router.navigate(['/mobileapp/tabs/dashboard/stock-management/material-requisition']);
    }
  }

  selectAllValue(event: MouseEvent) {
    const input = event.target as HTMLInputElement;
    input.select();
  }
}
