import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisteredCustomer } from 'src/app/classes/domain/entities/website/customer_management/registeredcustomer/registeredcustomer';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-registered-customer-details',
  standalone: false,
  templateUrl: './registered-customer-details.component.html',
  styleUrls: ['./registered-customer-details.component.scss'],
})
export class RegisteredCustomerDetailsComponent  implements OnInit {
 Entity: RegisteredCustomer = RegisteredCustomer.CreateNewInstance();
  Plotheaders: string[] = ['Sr.No.', 'Plot No', 'Area in sqm', 'Area in Sqft', 'Customer Status', 'Remark'];
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
    IsDropdownDisabled: boolean = false;
    InitialEntity: RegisteredCustomer = null as any;
    pageSize = 10; // Items per page
    currentPage = 1; // Initialize current page
    total = 0;
    IsPlotDetails: boolean = false;
    InterestedPlotRef: number = 0;
    SiteManagementRef: number = 0;

  
    constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }
  
    async ngOnInit() {
      this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
         this.IsNewEntity = false;
         this.Entity = RegisteredCustomer.GetCurrentInstance();
         console.log('Entity :', this.Entity);
         this.appStateManage.StorageKey.removeItem('Editable');
        } else {
          this.Entity = RegisteredCustomer.CreateNewInstance();
          RegisteredCustomer.SetCurrentInstance(this.Entity);
        }
        this.InitialEntity = Object.assign(
          RegisteredCustomer.CreateNewInstance(),
          this.utils.DeepCopy(this.Entity)
        ) as RegisteredCustomer;
        // this.focusInput();
    }
  
    SaveRegisteredCustomer = async () => {
      let entityToSave = this.Entity.GetEditableVersion();
      let entitiesToSave = [entityToSave];
      console.log('entitiesToSave:', entitiesToSave);
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
          await this.uiUtils.showSuccessToster('Customer Enquiry saved successfully!');
          this.Entity = RegisteredCustomer.CreateNewInstance();
        } else {
          await this.uiUtils.showSuccessToster('Customer Enquiry Updated successfully!');
        }
      }
    };
  
  
  
    BackRegisteredCustomer() {
      this.router.navigate(['/homepage/Website/Registered_Customer']);
    }

}
