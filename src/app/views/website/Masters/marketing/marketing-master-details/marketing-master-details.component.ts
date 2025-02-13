import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { Marketing } from 'src/app/classes/domain/entities/website/masters/marketing/marketing';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-marketing-master-details',
  standalone: false,
  templateUrl: './marketing-master-details.component.html',
  styleUrls: ['./marketing-master-details.component.scss'],
})
export class MarketingMasterDetailsComponent implements OnInit {
  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: Marketing = Marketing.CreateNewInstance();
  DetailsFormTitle: 'New Marketing Type' | 'Edit Marketing Type' = 'New Marketing Type';
  InitialEntity: Marketing = null as any;
  MarketingModesList = DomainEnums.MarketingModesList();

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils) { }

  async ngOnInit() {
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Marketing Type' : 'Edit Marketing Type';
      this.Entity = Marketing.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = Marketing.CreateNewInstance();
      Marketing.SetCurrentInstance(this.Entity);

    }
    this.InitialEntity = Object.assign(Marketing.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)) as Marketing;
  }

  SaveMarketingMaster = async () => {
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
        await this.uiUtils.showSuccessToster('Marketing saved successfully!');
        this.Entity = Marketing.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Marketing Updated successfully!');
      }
    }
  }


  BackMarketing() {
    this.router.navigate(['/homepage/Website/Marketing_Master']);
  }
}
