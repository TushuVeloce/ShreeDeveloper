import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { Department } from 'src/app/classes/domain/entities/website/masters/department/department';
import { Designation } from 'src/app/classes/domain/entities/website/masters/designation/designation';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-designation-master-details',
  standalone: false,
  templateUrl: './designation-master-details.component.html',
  styleUrls: ['./designation-master-details.component.scss'],
})
export class DesignationMasterDetailsComponent implements OnInit {

  Entity: Designation = Designation.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Designation' | 'Edit Designation' = 'New Designation';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Designation = null as any;
  DepartmentList: Department[] = [];

  NameWithNosAndSpace: string = ValidationPatterns.NameWithNosAndSpace

  NameWithNosAndSpaceMsg: string = ValidationMessages.NameWithNosAndSpaceMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.DepartmentList = await Department.FetchEntireList();

    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Designation'
        : 'Edit Designation';
      this.Entity = Designation.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
    } else {
      this.Entity = Designation.CreateNewInstance();
      Designation.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      Designation.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as Designation;
    this.focusInput();
    await this.FormulateDepartmentList();
  }

  focusInput = () => {
    let txtName = document.getElementById('Name')!;
    txtName.focus();
  }

  public FormulateDepartmentList = async () => {
    let lst = await Department.FetchEntireList(
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.DepartmentList = lst;
    this.Entity.p.DepartmentRef = this.DepartmentList[0].p.Ref;
  };

  // for value 0 selected while click on Input //
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  SaveDesignationMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    let entityToSave = this.Entity.GetEditableVersion();

    let entitiesToSave = [entityToSave];
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster(
          'Designation Master saved successfully!'
        );
        this.Entity = Designation.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster(
          'Designation Master Updated successfully!'
        );
        await this.router.navigate(['/homepage/Website/Designation_Master']);
      }
    }
  };

  BackDesignation = () => {
    this.router.navigate(['/homepage/Website/Designation_Master']);
  }

}
