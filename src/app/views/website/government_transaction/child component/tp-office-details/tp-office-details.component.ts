import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

@Component({
  selector: 'app-tp-office-details',
  templateUrl: './tp-office-details.component.html',
  styleUrls: ['./tp-office-details.component.scss'],
  standalone: false,
})
export class TpOfficeDetailsComponent implements OnInit, OnChanges {
  @Input() SelectedTransactionType: string = '';
  @Output() onEntitySaved = new EventEmitter<any>();

  TpOfficeList: any[] = [];

  constructor(
    private appStateManage: AppStateManageService,
    private router: Router
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    let arr = JSON.parse(
      this.appStateManage.StorageKey.getItem('TransactionJson') ?? '[]'
    );

    this.TpOfficeList = arr.filter(
      (item: { SiteWorkGroupName: string }) =>
        item.SiteWorkGroupName == this.SelectedTransactionType
    );
    this.BindApplicableTypeValueStatusToRadioButton();
    console.log(this.TpOfficeList);
  }

  ngOnInit() {}

  BindApplicableTypeValueStatusToRadioButton = () => {
    debugger;
    for (let i = 0; i < this.TpOfficeList.length; i++) {
      let SiteWorksList = this.TpOfficeList[i].SiteWorks;
      let ApplicableTypesList = SiteWorksList.filter(
        (item: { SiteWorkName: string }) =>
          item.SiteWorkName.trim() == 'Report NOC & Airport NOC'
      );

      let ApplicableTypeValueList =
        ApplicableTypesList[0].ApplicableTypes.filter(
          (item: { SiteWorkApplicableTypeName: string }) =>
            item.SiteWorkApplicableTypeName.trim() == 'Yes No'
        );
      this.getReportNOCAirportNOC(
        ApplicableTypeValueList[0].Value,
        ApplicableTypesList[0].SiteWorkName
      );
    }
  };

  getTypeOnApplicableTypeName = (
    ApplicableTypesName: string
  ): '' | 'checkbox' | 'number' | 'date' | 'radio' | 'text' => {
    switch (ApplicableTypesName) {
      case 'Submit':
        return 'checkbox';
      case 'Submit to तहसीलदार':
        return 'checkbox';
      case 'Submit to उपाधीक्षक & भूमी अधिलेख':
        return 'checkbox';
      case 'Inward No':
        return 'number';
      case 'Inward Date':
        return 'date';
      case 'Outward No':
        return 'number';
      case 'Outward Date':
        return 'date';
      case 'Scrutiny Fees':
        return 'checkbox';
      case 'Yes No':
        return 'radio';
      case 'Received':
        return 'checkbox';
      default:
        return ''; // Default return value
    }
  };

  // hide show content using radio button
  showReportNOCSection: boolean = false;
  getReportNOCAirportNOC = async (value: boolean, siteWorkName: string) => {
    debugger;
    if (siteWorkName.trim() === 'Report NOC & Airport NOC') {
      this.showReportNOCSection = value;
    }
  };

  onSave = () => {
    // this.appStateManage.StorageKey.setItem('TpOfficeList', JSON.stringify(this.TpOfficeList));
    this.onEntitySaved.emit(this.TpOfficeList);
    this.router.navigate(['/homepage/Website/Site_Progress_Report_Details']);
  };

  onCancel = async () => {
    await this.router.navigate([
      '/homepage/Website/Site_Progress_Report_Details',
    ]);
  };
}
