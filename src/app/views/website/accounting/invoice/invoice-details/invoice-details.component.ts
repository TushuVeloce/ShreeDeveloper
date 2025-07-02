import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages } from 'src/app/classes/domain/constants';
import { Invoice } from 'src/app/classes/domain/entities/website/accounting/billing/invoice';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { SubLedger } from 'src/app/classes/domain/entities/website/masters/subledgermaster/subledger';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
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
  private IsNewEntity: boolean = true;
  SiteList: Site[] = [];
  SubLedgerList: SubLedger[] = [];
  UnitList: Unit[] = [];
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Invoice' | 'Edit Invoice' = 'New Invoice';
  IsDropdownDisabled: boolean = false;
  InitialEntity: Invoice = null as any;
  LedgerList: Ledger[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('NameCtrl') NameInputControl!: NgModel;

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
      this.DetailsFormTitle = this.IsNewEntity ? 'New Invoice' : 'Edit Invoice';
      this.Entity = Invoice.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      if (this.Entity.p.LedgerRef) {
        this.getSubLedgerListByLedgerRef(this.Entity.p.LedgerRef)
      }
        if (this.Entity.p.Date != '') {
        this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date)
      }
    } else {
      this.Entity = Invoice.CreateNewInstance();
      Invoice.SetCurrentInstance(this.Entity);
    }
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
      this.Entity.p.IsDieselPaid = 1;
    } else {
      this.Entity.p.IsDieselPaid = 0;
    }
  }

  // for value 0 selected while click on Input //
  selectAllValue = (event: MouseEvent): void => {
    const input = event.target as HTMLInputElement;
    input.select();
  }

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
        this.resetAllControls();
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

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();

    // reset dirty
    this.NameInputControl.control.markAsPristine();
  }
}

