import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { BankAccount } from 'src/app/classes/domain/entities/website/masters/bankaccount/banckaccount';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-bank-account-master-details',
  standalone: false,
  templateUrl: './bank-account-master-details.component.html',
  styleUrls: ['./bank-account-master-details.component.scss'],
})
export class BankAccountMasterDetailsComponent implements OnInit {

  isSaveDisabled: boolean = false;
  private IsNewEntity: boolean = true;
  Entity: BankAccount = BankAccount.CreateNewInstance();
  DetailsFormTitle: 'New Bank Account' | 'Edit Bank Account' = 'New Bank Account';
  InitialEntity: BankAccount = null as any;
  dateofopening: string = '';
  today: string = new Date().toISOString().split('T')[0];
  IFSCPattern: string = ValidationPatterns.IFSC;
  LargeInputNumber: string = ValidationPatterns.LargeInputNumber;
  NameWithoutNos: string = ValidationPatterns.NameWithoutNos;

  IFSCMsg: string = ValidationMessages.IFSCMsg;
  LargeInputNumberMsg: string = ValidationMessages.LargeInputNumberMsg;
  NameWithoutNosMsg: string = ValidationMessages.NameWithoutNosMsg;
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg;

  @ViewChild('bankForm') bankForm!: NgForm;
  @ViewChild('NameCtrl') NameInputControl!: NgModel;
  @ViewChild('BranchNameCtrl') BranchNameInputControl!: NgModel;
  @ViewChild('AccountNumberCtrl') AccountNumberInputControl!: NgModel;
  @ViewChild('IFSCCodeCtrl') IFSCInputControl!: NgModel;
  @ViewChild('OpeningBalanceCtrl') OpeningBalanceInputControl!: NgModel;
  @ViewChild('DateOfOpeningCtrl') DateOfOpeningInputControl!: NgModel;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement, private dtu: DTU) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;
      this.DetailsFormTitle = this.IsNewEntity ? 'New Bank Account' : 'Edit Bank Account';
      this.Entity = BankAccount.GetCurrentInstance();

      // While Edit Converting date String into Date Format //
      this.dateofopening = this.dtu.ConvertStringDateToShortFormat(
        this.Entity.p.DateofOpening
      );
      this.appStateManage.StorageKey.removeItem('Editable')
    } else {
      this.Entity = BankAccount.CreateNewInstance();
      BankAccount.SetCurrentInstance(this.Entity);

    }
    this.InitialEntity = Object.assign(BankAccount.CreateNewInstance(),
      this.utils.DeepCopy(this.Entity)) as BankAccount;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Name')!;
    txtName.focus();
  }

  SaveBankAccountMaster = async () => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()

    this.Entity.p.DateofOpening = this.dtu.ConvertStringDateToFullFormat(this.dateofopening);
    if (this.Entity.p.CreatedBy == 0) {
      this.Entity.p.CreatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
      this.Entity.p.UpdatedBy = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    }
    let entityToSave = this.Entity.GetEditableVersion();
    if (!this.Entity.p.OpeningBalance) {
      this.Entity.p.OpeningBalance = 0;
    }
    // ------ Code For Save Date Of InCorporation Year Format ---------------//
    if (this.dateofopening) {
      let dateValue = new Date(this.dateofopening);

      if (!isNaN(dateValue.getTime())) {
        entityToSave.p.DateofOpening =
          this.dtu.DateStartStringFromDateValue(dateValue);
      } else {
        entityToSave.p.DateofOpening = '';
      }
    }
    let entitiesToSave = [entityToSave]
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message)
      return
    }
    else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Bank Account saved successfully!');
        debugger
        this.dateofopening = '';
        this.Entity = BankAccount.CreateNewInstance();
        this.resetAllControls();
      } else {
        await this.uiUtils.showSuccessToster('Bank Account Updated successfully!');
        this.BackBankAccount()
      }
    }
  }

  // for value 0 selected while click on Input //
  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  // resetAllControls = () => {
  //   // reset touched
  //   this.NameInputControl.control.markAsUntouched();
  //   this.IFSCInputControl.control.markAsUntouched();
  //   this.BranchNameInputControl.control.markAsUntouched();
  //   this.AccountNumberInputControl.control.markAsUntouched();
  //   this.IFSCInputControl.control.markAsUntouched();
  //   this.OpeningBalanceInputControl.control.markAsUntouched();
  //   this.DateOfOpeningInputControl.control.markAsUntouched();

  //   // reset dirty
  //   this.NameInputControl.control.markAsPristine();
  //   this.IFSCInputControl.control.markAsPristine();
  //   this.BranchNameInputControl.control.markAsPristine();
  //   this.AccountNumberInputControl.control.markAsPristine();
  //   this.IFSCInputControl.control.markAsPristine();
  //   this.OpeningBalanceInputControl.control.markAsPristine();
  //   this.DateOfOpeningInputControl.control.markAsPristine();
  // }

  resetAllControls() {
  this.bankForm.resetForm(); // this will reset all form controls to their initial state
}

  BackBankAccount = () => {
    this.router.navigate(['/homepage/Website/Bank_Account_Master']);
  }

}
