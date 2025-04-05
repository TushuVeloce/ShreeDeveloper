import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages } from 'src/app/classes/domain/constants';
import { VendorService } from 'src/app/classes/domain/entities/website/masters/vendorservices/vendorservices';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-vendor-services-master-details',
  standalone: false,
  templateUrl: './vendor-services-master-details.component.html',
  styleUrls: ['./vendor-services-master-details.component.scss'],
})
export class VendorServicesMasterDetailsComponent  implements OnInit {
   Entity: VendorService = VendorService.CreateNewInstance();
    private IsNewEntity: boolean = true;
    isSaveDisabled: boolean = false;
    DetailsFormTitle: 'New Vendor Service' | 'Edit Vendor Service' = 'New Vendor Service';
    IsDropdownDisabled: boolean = false
    InitialEntity: VendorService = null as any;
    RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg


   @ViewChild('NameCtrl') NameInputControl!: NgModel;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity ? 'New Vendor Service' : 'Edit Vendor Service';
      this.Entity = VendorService.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = VendorService.CreateNewInstance();
      VendorService.SetCurrentInstance(this.Entity);

    }
    this.InitialEntity = Object.assign(VendorService.CreateNewInstance(),
    this.utils.DeepCopy(this.Entity)) as VendorService;
    // this.focusInput();
  }

  SaveVendorServiceMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave]
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error',tr.Message);
      return
    }
    else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Vendor Service Master Saved successfully!');
        this.Entity = VendorService.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Vendor Service Master Updated successfully!');
      }
    }
  }

  BackVendorService = () => {
    this.router.navigate(['/homepage/Website/Vendor_Services_Master']);
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();

    // reset dirty
    this.NameInputControl.control.markAsPristine();
  }

}
