import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { Recipient } from 'src/app/classes/domain/entities/website/masters/recipientname/recipientname';
import { ValidationMessages } from 'src/app/classes/domain/constants';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-invoice-details',
  standalone: false,
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
})
export class InvoiceDetailsComponent implements OnInit {
  Entity: Invoice = Invoice.CreateNewInstance();
  RecipientEntity: Recipient = Recipient.CreateNewInstance();
  private IsNewEntity: boolean = true;
  SiteList: Site[] = [];
  RecipientList: Recipient[] = [];
  RecipientNameInput: boolean = false
  SubLedgerList: SubLedger[] = [];
  isDieselPaid: boolean = false
  RecipientNameReadOnly: boolean = false
  UnitList: Unit[] = [];
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Bill' | 'Edit Bill' = 'New Bill';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Invoice = null as any;
  LedgerList: Ledger[] = [];
  strCDT: string = ''
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  // @ViewChild('invoiceForm') invoiceForm!: NgForm;
  @ViewChild('NameCtrl') NameInputControl!: NgModel;
  @ViewChild('DateCtrl') DateInputControl!: NgModel;
  @ViewChild('DescriptionCtrl') DescriptionCtrlInputControl!: NgModel;
  @ViewChild('RecipientNameCtrl') RecipientNameInputControl!: NgModel;
  @ViewChild('QtyCtrl') QtyInputControl!: NgModel;
  @ViewChild('RateCtrl') RateInputControl!: NgModel;
  @ViewChild('DieselQtyCtrl') DieselQtyInputControl!: NgModel;
  @ViewChild('DieselRateCtrl') DieselRateInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement,
    private dtu: DTU,
  ) { }

  async ngOnInit() {
    await this.appStateManage.setDropdownDisabled(true);
    this.getSiteListByCompanyRef()
    this.getLedgerListByCompanyRef()
    await this.getUnitList()
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Bill' : 'Edit Bill';
      this.Entity = Invoice.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      if (this.Entity.p.LedgerRef) {
        await this.getSubLedgerListByLedgerRef(this.Entity.p.LedgerRef)
      }
      if (this.Entity.p.Date != '') {
        this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date)
      }
      if (this.Entity.p.IsDieselPaid == 1) {
        this.isDieselPaid = true
      }
      // this.RecipientNameReadOnly = true
    } else {
      this.Entity = Invoice.CreateNewInstance();
      Invoice.SetCurrentInstance(this.Entity);
      if (this.Entity.p.Date == '') {
        this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
        let parts = this.strCDT.substring(0, 16).split('-');
        // Construct the new date format
        this.Entity.p.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
      }
    }
    this.getRecipientListByCompanyRef()
    this.InitialEntity = Object.assign(
      Invoice.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as Invoice;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Date')!;
    txtName.focus();
  }

  getUnitList = async () => {
    let lst = await Unit.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.UnitList = lst;
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = lst;
  }

  getRecipientListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Recipient.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.RecipientList = lst;
  }

  AddRecipientName = () => {
    this.Entity.p.RecipientMasterRef = 0
    this.RecipientEntity.p.Name = ''
    this.RecipientNameInput = true
  }

  cancelRecipientName = () => {
    this.RecipientNameInput = false
    this.RecipientEntity.p.Name = ''
  }

  getLedgerListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Ledger.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.LedgerList = lst
  };

  getSubLedgerListByLedgerRef = async (ledgerref: number) => {
    if (ledgerref <= 0) {
      await this.uiUtils.showErrorToster('Ledger not Selected');
      return;
    }
    let lst = await SubLedger.FetchEntireListByLedgerRef(ledgerref, async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SubLedgerList = lst;
  }

  OnLedgerChange = () => {
    this.Entity.p.SubLedgerRef = 0
  }

  DiselPaid = (DiselPaid: number) => {
    if (DiselPaid == 1) {
      this.isDieselPaid = true
      this.Entity.p.IsDieselPaid = 1;
    } else {
      this.Entity.p.DieselQty = 0;
      this.Entity.p.DieselRate = 0;
      this.Entity.p.DieselAmount = 0;
      this.Entity.p.IsDieselPaid = 0;
      this.isDieselPaid = false
    }
    this.CalculateAmount()
  }

  CalculateDieselAmount = () => {
    const DieselQty = Number(this.Entity.p.DieselQty)
    const DieselRate = Number(this.Entity.p.DieselRate)
    this.Entity.p.DieselAmount = DieselQty * DieselRate
    this.CalculateAmount()
  }

  CalculateAmount = () => {
    const Qty = Number(this.Entity.p.Qty)
    const Rate = Number(this.Entity.p.Rate)
    if (this.Entity.p.DieselAmount == 0) {
      this.Entity.p.InvoiceAmount = Qty * Rate
    } else {
      this.Entity.p.InvoiceAmount = (Qty * Rate) - Number(this.Entity.p.DieselAmount)
    }
  }

  // for value 0 selected while click on Input //
  selectAllValue = (event: MouseEvent): void => {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  SaveNewRecipientName = async () => {
    if(this.RecipientEntity.p.Name == ''){
        this.uiUtils.showErrorToster('Recipient Name can not be Blank');
        return
    }
      this.RecipientEntity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
      this.RecipientEntity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
      if (this.RecipientEntity.p.CreatedBy == 0) {
        this.RecipientEntity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
        this.RecipientEntity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      }
      let entityToSave = this.RecipientEntity.GetEditableVersion();
      let entitiesToSave = [entityToSave];
      let tr = await this.utils.SavePersistableEntities(entitiesToSave);
  
      if (!tr.Successful) {
        this.isSaveDisabled = false;
        this.uiUtils.showErrorMessage('Error', tr.Message);
        return;
      } else {
          await this.uiUtils.showSuccessToster('Recipient Name saved successfully');
           this.RecipientNameInput = false
           await this.getRecipientListByCompanyRef()
          this.RecipientEntity = Recipient.CreateNewInstance();
      }
    };

  SaveInvoiceMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.Date)
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
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Invoice saved successfully');
        this.Entity = Invoice.CreateNewInstance();
        await this.resetAllControls();
        this.isDieselPaid = false
      } else {
        await this.uiUtils.showSuccessToster('Invoice Updated successfully');
        await this.router.navigate(['/homepage/Website/Invoice']);
      }
    }
  };

  BackInvoice = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this Invoice Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Invoice']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Invoice']);
    }
  }

  resetAllControls = async () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();
    this.DateInputControl.control.markAsUntouched();
    this.DescriptionCtrlInputControl.control.markAsUntouched();
    this.RecipientNameInputControl.control.markAsUntouched();
    this.QtyInputControl.control.markAsUntouched();
    this.RateInputControl.control.markAsUntouched();
    this.DieselQtyInputControl.control.markAsUntouched();
    this.DieselRateInputControl.control.markAsUntouched();

    // reset dirty
    this.NameInputControl.control.markAsPristine();
    this.DateInputControl.control.markAsPristine();
    this.DescriptionCtrlInputControl.control.markAsPristine();
    this.RecipientNameInputControl.control.markAsPristine();
    this.QtyInputControl.control.markAsPristine();
    this.RateInputControl.control.markAsPristine();
    this.DieselQtyInputControl.control.markAsPristine();
    this.DieselRateInputControl.control.markAsPristine();
    // await this.invoiceForm.resetForm(); 
  }
}

