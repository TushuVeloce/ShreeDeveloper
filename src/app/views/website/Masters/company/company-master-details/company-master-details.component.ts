import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';


@Component({
  selector: 'app-company-master-details',
  standalone: false,
  templateUrl: './company-master-details.component.html',
  styleUrls: ['./company-master-details.component.scss'],
})
export class CompanyMasterDetailsComponent implements OnInit {
  Entity: Company = Company.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Company' | 'Edit Company' = 'New Company';
  IsDropdownDisabled: boolean = false
  InitialEntity: Company = null as any;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils) { }

 ngOnInit() { 
     if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
       this.IsNewEntity = false;
       
       this.DetailsFormTitle = this.IsNewEntity ? 'New Company' : 'Edit Company';
       this.Entity = Company.GetCurrentInstance();
       this.appStateManage.StorageKey.removeItem('Editable')
 
     } else {
       this.Entity = Company.CreateNewInstance();
       Company.SetCurrentInstance(this.Entity);
      
     }
     this.InitialEntity = Object.assign(Company.CreateNewInstance(),
     this.utils.DeepCopy(this.Entity)) as Company;
     // this.focusInput();
   }


  SaveCompanyMaster = async () => {
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
        await this.uiUtils.showSuccessToster('Company Master saved successfully!');
        this.Entity = Company.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Company Master Updated successfully!');
      }
    }
  }


  BackCompany() {
    this.router.navigate(['/homepage/Website/Company_Master']);
  }

}
