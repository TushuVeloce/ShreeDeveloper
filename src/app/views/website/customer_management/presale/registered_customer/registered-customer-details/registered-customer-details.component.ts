import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { RegisteredCustomer } from 'src/app/classes/domain/entities/website/customer_management/registeredcustomer/registeredcustomer';
import { FinancialYear } from 'src/app/classes/domain/entities/website/masters/financialyear/financialyear';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { DTU } from 'src/app/services/dtu.service';


@Component({
  selector: 'app-registered-customer-details',
  standalone: false,
  templateUrl: './registered-customer-details.component.html',
  styleUrls: ['./registered-customer-details.component.scss'],
})
export class RegisteredCustomerDetailsComponent implements OnInit {
  Entity: RegisteredCustomer = RegisteredCustomer.CreateNewInstance();
  Plotheaders: string[] = ['Sr.No.', 'Plot No', 'Area in sqm', 'Area in Sqft', 'Customer Status', 'Remark'];
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  IsDropdownDisabled: boolean = false;
  InitialEntity: RegisteredCustomer = null as any;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  localRegisterDate: string = '';
  IsPlotDetails: boolean = false;
  InterestedPlotRef: number = 0;
  SiteManagementRef: number = 0;
  GoodandServicesTaxList = DomainEnums.GoodsAndServicesTaxList(true, '--Select GST --');
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  FinancialYearList: FinancialYear[] = []

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement, private servicecommunicator: ServerCommunicatorService, private dtu: DTU,) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.Entity = RegisteredCustomer.GetCurrentInstance();
      this.Entity.p.SiteVisitDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.SiteVisitDate)
      if (this.Entity.p.RegisterDate != '') {
        this.localRegisterDate = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.RegisterDate)
      }
      this.Entity.p.TaxValueInPercentage = 6
      this.Entity.p.RegTaxValuesInPercentage = 1
      this.calculateTotalPlotAmount()
      this.calculateGovernmentValue()
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

  calculateTotalPlotAmount = () => {
    const AreaInSqft = Number(this.Entity.p.AreaInSqft);
    const DiscountedRateOnArea = Number(this.Entity.p.DiscountedRateOnArea);
    const BasicRatePerSqft = Number(this.Entity.p.BasicRatePerSqft);
    const DiscountOnTotalPlotAmount = Number(this.Entity.p.DiscountOnTotalPlotAmount)

    if (DiscountedRateOnArea === 0) {
      this.Entity.p.TotalPlotAmount = Math.ceil(BasicRatePerSqft * AreaInSqft) - DiscountOnTotalPlotAmount;
    } else {
      this.Entity.p.TotalPlotAmount = Math.ceil(DiscountedRateOnArea * AreaInSqft) - DiscountOnTotalPlotAmount;
    }
    this.calculateGrandTotal()
  }

  calculateGovernmentValue = () => {
    const GovermentRatePerSqm = Number(this.Entity.p.GovermentRatePerSqm);
    const AreaInSqm = Number(this.Entity.p.AreaInSqm);
    this.Entity.p.GovernmentValue = Math.ceil(GovermentRatePerSqm * AreaInSqm);
  }

  calculateStampDuties = () => {
    const ValueOfAgreement = Number(this.Entity.p.ValueOfAgreement);
    const TaxValueInPercentage = Number(this.Entity.p.TaxValueInPercentage);
    this.Entity.p.StampDuties = Math.ceil(ValueOfAgreement * (TaxValueInPercentage / 100));
    this.calculateRegistrationFees()
  }

  calculateRegistrationFees = () => {
    const ValueOfAgreement = Number(this.Entity.p.ValueOfAgreement);
    const RegTaxValuesInPercentage = Number(this.Entity.p.RegTaxValuesInPercentage);
    this.Entity.p.RegistrationFees = Math.ceil(ValueOfAgreement * (RegTaxValuesInPercentage / 100));
    this.calculateExtraCharges()
  }

  calculateExtraCharges = () => {
    const LegalCharges = Number(this.Entity.p.LegalCharges);
    const StampDuties = Number(this.Entity.p.StampDuties);
    const RegistrationFees = Number(this.Entity.p.RegistrationFees);
     const GSTonValueofAgreement = Number((this.Entity.p.GoodsServicesTax / 100) * (this.Entity.p.ValueOfAgreement));
    this.Entity.p.TotalExtraCharges = Math.ceil(LegalCharges + StampDuties + RegistrationFees + GSTonValueofAgreement);
    this.Entity.p.GstToatalAmount = GSTonValueofAgreement
    this.calculateGrandTotal()
  }

  calculateGrandTotal = () => {
    const TotalPlotAmount = Number(this.Entity.p.TotalPlotAmount);
    const ValueOfAgreement = Number(this.Entity.p.ValueOfAgreement);
    const TotalExtraCharges = Number(this.Entity.p.TotalExtraCharges);
    // const GSTonValueofAgreement = Number((this.Entity.p.GoodsServicesTax / 100) * (this.Entity.p.ValueOfAgreement));
    this.Entity.p.GrandTotal = Math.ceil(TotalPlotAmount + ValueOfAgreement + TotalExtraCharges);
    // this.Entity.p.GstToatalAmount = GSTonValueofAgreement
  }

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  SaveRegisteredCustomer = async () => {
    this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.Entity.p.UpdatedDate = await CurrentDateTimeRequest.GetCurrentDateTime();
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    // convert date 2025-02-23 to 2025-02-23-00-00-00-000
    this.Entity.p.RegisterDate = this.dtu.ConvertStringDateToFullFormat(this.localRegisterDate)
    if (this.Entity.p.DiscountOnTotalPlotAmount == undefined) {
      this.Entity.p.DiscountOnTotalPlotAmount = 0
    }
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave];
    console.log('entitiesToSave :', entitiesToSave);
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      this.isSaveDisabled = false;
      // this.onEntitySaved.emit(entityToSave);
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Registered Customer saved successfully!');
        this.Entity = RegisteredCustomer.CreateNewInstance();
      } else {
        await this.uiUtils.showSuccessToster('Registered Customer Updated successfully!');
        await this.router.navigate(['/homepage/Website/Registered_Customer']);
      }
    }
  };

  BackRegisteredCustomer = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Registered Customer Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Registered_Customer']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Registered_Customer']);
    }
  }
}
