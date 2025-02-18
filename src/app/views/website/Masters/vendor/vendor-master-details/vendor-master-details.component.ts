import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { Vendor } from 'src/app/classes/domain/entities/website/masters/vendor/vendor';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';


@Component({
  selector: 'app-vendor-master-details',
  standalone: false,
  templateUrl: './vendor-master-details.component.html',
  styleUrls: ['./vendor-master-details.component.scss'],
})
export class VendorMasterDetailsComponent implements OnInit {

  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: Vendor = Vendor.CreateNewInstance();
  DetailsFormTitle: 'New Vendor' | 'Edit Vendor' = 'New Vendor';
  InitialEntity: Vendor = null as any;
  CompanyList: Company[] = [];

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils) { }

  async ngOnInit() {
    this.CompanyList = await Company.FetchEntireList();
    console.log(this.CompanyList);
    
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Vendor' : 'Edit Vendor';
      this.Entity = Vendor.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = Vendor.CreateNewInstance();
      Vendor.SetCurrentInstance(this.Entity);

    }
    this.InitialEntity = Object.assign(Vendor.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)) as Vendor;
  }

  SaveVendorMaster = async () => {
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave]
    console.log(entitiesToSave);
    
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
        await this.uiUtils.showSuccessToster('Vendor saved successfully!');
        this.Entity = Vendor.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Vendor Updated successfully!');
      }
    }
  }

  BackVendor() {
    this.router.navigate(['/homepage/Website/Vendor_Master']);
  }

}
