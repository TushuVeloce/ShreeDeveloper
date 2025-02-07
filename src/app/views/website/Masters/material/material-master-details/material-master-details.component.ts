import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-material-master-details',
  standalone: false,
  templateUrl: './material-master-details.component.html',
  styleUrls: ['./material-master-details.component.scss'],
})
export class MaterialMasterDetailsComponent implements OnInit {

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils) { }

  ngOnInit() { 
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      
      // this.DetailsFormTitle = this.IsNewEntity ? 'New Space Group' : 'Edit Space Group';
      this.Entity = Material.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = Material.CreateNewInstance();
      Material.SetCurrentInstance(this.Entity);
     
    }
    this.InitialEntity = Object.assign(Material.CreateNewInstance(),
    this.utils.DeepCopy(this.Entity)) as Material;
    
  }
  
  BackMaterial() {
    this.router.navigate(['/homepage/Website/Material_Master']);
  }

  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: Material = Material.CreateNewInstance();
  InitialEntity: Material = null as any;

  SaveMaterialMaster = async () => {
    let entityToSave = this.Entity.GetEditableVersion();

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
        await this.uiUtils.showSuccessToster('Material Master saved successfully!');
        this.Entity = Material.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Material Master Updated successfully!');
      }
    }
  }

}
