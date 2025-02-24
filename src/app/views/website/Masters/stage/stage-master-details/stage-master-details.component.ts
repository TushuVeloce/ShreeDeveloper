import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Stage } from 'src/app/classes/domain/entities/website/masters/stage/stage';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-stage-master-details',
  standalone: false,
  templateUrl: './stage-master-details.component.html',
  styleUrls: ['./stage-master-details.component.scss'],
})
export class StageMasterDetailsComponent  implements OnInit {

    isSaveDisabled: boolean = false;
    private IsNewEntity: boolean = true;
    Entity: Stage = Stage.CreateNewInstance();
    DetailsFormTitle: 'New Stage' | 'Edit Stage' = 'New Stage';
    InitialEntity: Stage = null as any;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils) { }
 
   async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
          if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
             this.IsNewEntity = false;
             this.DetailsFormTitle = this.IsNewEntity ? 'New Stage' : 'Edit Stage';
             this.Entity = Stage.GetCurrentInstance();
             this.appStateManage.StorageKey.removeItem('Editable')
       
           } else {
             this.Entity = Stage.CreateNewInstance();
             Stage.SetCurrentInstance(this.Entity);
            
           }
           this.InitialEntity = Object.assign(Stage.CreateNewInstance(),
           this.utils.DeepCopy(this.Entity)) as Stage;      
      }

        SaveStageMaster = async () => {
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
                await this.uiUtils.showSuccessToster('Stage saved successfully!');
                this.Entity = Stage.CreateNewInstance();
              } else {
                await this.uiUtils.showSuccessToster('Stage Updated successfully!');
              }
            }
          }

   BackMaterial(){
     this.router.navigate(['/homepage/Website/Stage_Master']);
    }
}
