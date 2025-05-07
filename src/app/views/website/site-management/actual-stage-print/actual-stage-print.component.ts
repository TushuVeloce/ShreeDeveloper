import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-actual-stage-print',
  standalone: false,
  templateUrl: './actual-stage-print.component.html',
  styleUrls: ['./actual-stage-print.component.scss'],
})

export class ActualStagePrintComponent implements OnInit {
  Entity: Unit = Unit.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'Print Actual Stage' | 'Edit Unit' = 'Print Actual Stage';
  IsDropdownDisabled: boolean = false
  InitialEntity: Unit = null as any;
  billData = {
    date: '2025-05-06',
    customerName: 'John Doe',
    contact: '9876543210',
    address: '123 Main Street',
    billNo: 'INV20250506',
    items: [
      { description: 'Item A', quantity: 2, rate: 100, amount: 200 },
      { description: 'Item B', quantity: 1, rate: 150, amount: 150 },
    ],
    subtotal: 350,
    taxRate: 5,
    tax: 17.5,
    total: 367.5
  };

  receipt = {
    date: '5/6/2025',
    challanNo: 123,
    vendor: 'Vendor Name',
    siteName: 'SITE NAME',
    address: 'Some location address',
    phone: '1234567890',
    stageName: 'Excavation Stage',
    serviceType: 'Earth Work',
    vehicleNo: 'MH12 AB1234',
    items: [
      { description: 'JCB Usage', qty: 12, unit: 'hr', rate: 850, amount: 10500 },
      { description: 'Diesel', qty: 50, unit: 'ltr', rate: 93, amount: -4650 }
    ],
    totalRows: [
      { label: '', value: 0 },
      { label: '', value: 0 },
      { label: '', value: 0 }
    ],
    total: 5850,
    inwords: 'Five Thousand Eight Hundred Fifty Only'
  };


  Unit: string = ValidationPatterns.SIUnit
  NameWithoutNos: string = ValidationPatterns.NameWithoutNos

  UnitMsg: string = ValidationMessages.SIUnitMsg
  NameWithoutNosMsg: string = ValidationMessages.NameWithoutNosMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('NameCtrl') NameInputControl!: NgModel;

  constructor(private router: Router, private uiUtils: UIUtils, private appStateManage: AppStateManageService, private utils: Utils, private companystatemanagement: CompanyStateManagement) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity ? 'Print Actual Stage' : 'Edit Unit';
      this.Entity = Unit.GetCurrentInstance();
      this.appStateManage.StorageKey.removeItem('Editable')

    } else {
      this.Entity = Unit.CreateNewInstance();
      Unit.SetCurrentInstance(this.Entity);

    }
    this.InitialEntity = Object.assign(Unit.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as Unit;
    this.focusInput();
  }

  focusInput = () => {
    let txtName = document.getElementById('Name')!;
    txtName.focus();
  }

  SaveUnitMaster = async () => {
    this.isSaveDisabled = true;
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    let entityToSave = this.Entity.GetEditableVersion();
    let entitiesToSave = [entityToSave]
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);
    if (!tr.Successful) {
      this.isSaveDisabled = false;
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return
    }
    else {
      this.isSaveDisabled = false;
      if (this.IsNewEntity) {
        await this.uiUtils.showSuccessToster('Unit Master saved successfully!');
        this.Entity = Unit.CreateNewInstance();
        this.resetAllControls()
      } else {
        await this.uiUtils.showSuccessToster('Unit Master Updated successfully!');
        await this.router.navigate(['/homepage/Website/Site_Management_Actual_Stage']);
      }
    }
  }

  BackUnit = () => {
    this.router.navigate(['/homepage/Website/Site_Management_Actual_Stage']);
  }

  resetAllControls = () => {
    // reset touched
    this.NameInputControl.control.markAsUntouched();

    // reset dirty
    this.NameInputControl.control.markAsPristine();
  }
}
