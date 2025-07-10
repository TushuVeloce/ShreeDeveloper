import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages } from 'src/app/classes/domain/constants';
import { DomainEnums, OpeningBalanceModeOfPayments } from 'src/app/classes/domain/domainenums/domainenums';
import { BankAccount } from 'src/app/classes/domain/entities/website/masters/bankaccount/banckaccount';
import { FinancialYear } from 'src/app/classes/domain/entities/website/masters/financialyear/financialyear';
import { OpeningBalance } from 'src/app/classes/domain/entities/website/masters/openingbalance/openingbalance';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-opening-balance-details',
  standalone: false,
  templateUrl: './opening-balance-details.component.html',
  styleUrls: ['./opening-balance-details.component.scss'],
})
export class OpeningBalanceDetailsComponent implements OnInit {
  Entity: OpeningBalance = OpeningBalance.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Opening Balance' | 'Edit Opening Balance' = 'New Opening Balance';
  IsDropdownDisabled: boolean = false;
  InitialEntity: OpeningBalance = null as any;
  BankList: BankAccount[] = [];
  Cash = OpeningBalanceModeOfPayments.Cash
  Cheque = OpeningBalanceModeOfPayments.Cheque
  ModeofPaymentList = DomainEnums.OpeningBalanceModeOfPaymentsList();
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('OpeningBalanceAmountCtrl ') OpeningBalanceAmountInputControl!: NgModel;

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private companystatemanagement: CompanyStateManagement
  ) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.FormulateBankList();
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Opening Balance'
        : 'Edit Opening Balance';
      this.Entity = OpeningBalance.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable');
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    } else {
      this.Entity = OpeningBalance.CreateNewInstance();
      OpeningBalance.SetCurrentInstance(this.Entity);
    }
    this.InitialEntity = Object.assign(
      OpeningBalance.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)
    ) as OpeningBalance;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('CoModeOfPaymente')!;
    txtName.focus();
  }

  public FormulateBankList = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await BankAccount.FetchEntireListByCompanyRef(this.companyRef(), async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.BankList = lst
  };


  // for value 0 selected while click on Input //
  selectAllValue = (event: MouseEvent): void => {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  OnModeChange = () => {
     this.Entity.p.BankAccountRef = 0
  }

  SaveOpeningBalanceMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef();
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName();
    if(this.Entity.p.ModeOfPayment == this.Cash){
      this.Entity.p.BankAccountRef = 0
    }
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
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
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('OpeningBalance saved successfully');
        this.Entity = OpeningBalance.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('OpeningBalance Updated successfully');
        await this.router.navigate(['/homepage/Website/Opening_Balance_Master']);
      }
    }
  };


  BackOpeningBalance = async () => {
    if (!this.utils.AreEqual(this.InitialEntity, this.Entity)) {
      await this.uiUtils.showConfirmationMessage('Cancel',
        `This process is IRREVERSIBLE!
      <br/>
      Are you sure that you want to Cancel this OpeningBalance Form?`,
        async () => {
          await this.router.navigate(['/homepage/Website/Opening_Balance_Master']);
        });
    } else {
      await this.router.navigate(['/homepage/Website/Opening_Balance_Master']);
    }
  }

  resetAllControls = () => {
    // reset touched
    this.OpeningBalanceAmountInputControl.control.markAsUntouched();

    // reset dirty

    this.OpeningBalanceAmountInputControl.control.markAsPristine();
  }
}

