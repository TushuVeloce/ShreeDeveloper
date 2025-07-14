  import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { NgModel } from '@angular/forms';


@Component({
  selector: 'app-material-master-details',
  standalone: false,
  templateUrl: './material-master-details.component.html',
  styleUrls: ['./material-master-details.component.scss'],
})
export class MaterialMasterDetailsComponent implements OnInit {
  Entity: Material = Material.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Material' | 'Edit Material' = 'New Material';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Material = null as any;
  UnitList: Unit[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  NameWithNosAndSpace: string = ValidationPatterns.NameWithNosAndSpace
  NameWithNosAndSpaceMsg: string = ValidationMessages.NameWithNosAndSpaceMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('NameCtrl') NameInputControl!: NgModel;
  // @ViewChild('CodeCtrl') CodeInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity? 'New Material': 'Edit Material';
      this.Entity = Material.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    } else {
      this.Entity = Material.CreateNewInstance();
      Material.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(Material.CreateNewInstance(),this.utils.DeepCopy(this.Entity))as Material;
    this.FormulateUnitList();
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Name')!;
    txtName.focus();
  }

  public FormulateUnitList = async () => {
    let lst = await Unit.FetchEntireList(async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.UnitList = lst
  };

  SaveMaterialMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Material saved successfully');
        this.Entity = Material.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Material Updated successfully');
        await this.router.navigate(['/homepage/Website/Material_Master']);
      }
    }
  };

  BackMaterial = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Material Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Material_Master']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Material_Master']);
    }
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();

    // reset dirty
    this.NameInputControl.control.markAsPristine();
  }
}
