import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-unit-master-details',
  standalone:false,
  templateUrl: './unit-master-details.component.html',
  styleUrls: ['./unit-master-details.component.scss'],
})
export class UnitMasterDetailsComponent  implements OnInit {
   Entity: Unit = Unit.CreateNewInstance();
    private IsNewEntity: boolean = true;
    isSaveDisabled: boolean = false;
    DetailsFormTitle: 'New Unit' | 'Edit Unit' = 'New Unit';
    IsDropdownDisabled: boolean = false
    InitialEntity: Unit = null as any;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }

  ngOnInit() { 
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      
      this.DetailsFormTitle = this.IsNewEntity ? 'New Unit' : 'Edit Unit';
      this.Entity = Unit.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = Unit.CreateNewInstance();
      Unit.SetCurrentInstance(this.Entity);
     
    }
    this.InitialEntity = Object.assign(Unit.CreateNewInstance(),
    this.utils.DeepCopy(this.Entity)) as Unit;
    // this.focusInput();
  }

  SaveUnitMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    let entityToSave = this.Entity.GetEditableVersion();
    console.log('entityToSave :', entityToSave);
    let entitiesToSave = [entityToSave]
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorToster(tr.Message);
      return
    }
    else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Unit Master saved successfully!');
        this.Entity = Unit.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Unit Master Updated successfully!');
      }
    }
  }

  BackUnit() {
    this.router.navigate(['/homepage/Website/Unit_Master']);
  }

}