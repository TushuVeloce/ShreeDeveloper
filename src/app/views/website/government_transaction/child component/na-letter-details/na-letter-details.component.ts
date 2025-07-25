import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

@Component({
  selector: 'app-na-letter-details',
  templateUrl: './na-letter-details.component.html',
  styleUrls: ['./na-letter-details.component.scss'],
  standalone: false,

})
export class NaLetterDetailsComponent implements OnInit {
  @Input() SelectedTransactionType: string = '';
  @Output() onEntitySaved = new EventEmitter<any>();

  NALetterList: any[] = [];
  constructor(private appStateManage: AppStateManageService, private router: Router,) { }
  ngOnChanges(changes: SimpleChanges): void {
    let arr = JSON.parse(this.appStateManage.StorageKey.getItem('TransactionJson') ?? '[]');

    this.NALetterList = arr.filter((item: { SiteWorkGroupName: string }) => item.SiteWorkGroupName == this.SelectedTransactionType);
    this.BindApplicableTypeValueStatusToRadioButton();
  }

  ngOnInit() { }
  getTypeOnApplicableTypeName = (ApplicableTypesName: string): '' | 'checkbox' | 'number' | 'date' | 'radio' | 'text' => {
    switch (ApplicableTypesName) {
      case 'Submit': return 'checkbox';
      case 'Inward No': return 'number';
      case 'Inward Date': return 'date';
      case 'Outward No': return 'number';
      case 'Outward Date': return 'date';
      case 'Scrutiny Fees': return 'checkbox';
      case 'Yes No': return 'radio';
      case 'Received': return 'checkbox';
      default:
        return ''; // Default return value
    }
  }

  // hide show content using radio button
  showReportNOCSection: boolean = false;
  getInampatrStatus(value: boolean, siteWorkName: string) {
    if (siteWorkName.trim() === 'इनामपत्र 2') {
      this.showReportNOCSection = value;
    }
  }
  BindApplicableTypeValueStatusToRadioButton = () => {

    for (let i = 0; i < this.NALetterList.length; i++) {
      let SiteWorksList = this.NALetterList[i].SiteWorks;
      let ApplicableTypesList = SiteWorksList.filter((item: { SiteWorkName: string }) => item.SiteWorkName == 'इनामपत्र 2');

      let ApplicableTypeValueList = ApplicableTypesList[0].ApplicableTypes.filter((item: { SiteWorkApplicableTypeName: string }) => item.SiteWorkApplicableTypeName == 'Yes No');
      this.getInampatrStatus(ApplicableTypeValueList[0].Value, ApplicableTypesList[0].SiteWorkName);
    }

  }
  onSave = () => {
    // this.appStateManage.StorageKey.setItem('TpOfficeList', JSON.stringify(this.TpOfficeList));
    this.onEntitySaved.emit(this.NALetterList);
    this.router.navigate(['/homepage/Website/Site_Progress_Report_Details']);
  }

  onCancel = async () => {
    await this.router.navigate(['/homepage/Website/Site_Progress_Report_Details']);

  }

}
