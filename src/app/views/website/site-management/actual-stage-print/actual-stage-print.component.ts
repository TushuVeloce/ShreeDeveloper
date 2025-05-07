import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { ActualStages } from 'src/app/classes/domain/entities/website/site_management/actualstages/actualstages';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DTU } from 'src/app/services/dtu.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-actual-stage-print',
  standalone: false,
  templateUrl: './actual-stage-print.component.html',
  styleUrls: ['./actual-stage-print.component.scss'],
})

export class ActualStagePrintComponent implements OnInit {
  Entity: ActualStages = ActualStages.CreateNewInstance();
  private IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle = 'Receipt';
  IsDropdownDisabled: boolean = false
  InitialEntity: ActualStages = null as any;

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

  constructor(
    private router: Router,
    private uiUtils: UIUtils,
    private appStateManage: AppStateManageService,
    private utils: Utils,
    private dtu: DTU,
    private companystatemanagement: CompanyStateManagement
  ) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    // history.state.myData;
    console.log('history.state.myData :', history.state.printData);

    this.Entity = history.state.printData;
    this.Entity.p.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.CreatedDate);

    this.InitialEntity = Object.assign(ActualStages.CreateNewInstance(), this.utils.DeepCopy(this.Entity)) as ActualStages;
  }


  BackUnit = () => {
    this.router.navigate(['/homepage/Website/Site_Management_Actual_Stage']);
  }
}
