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
    // console.log('NALetterList', this.NALetterList);
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
  getReportNOCAirportNOC(value: boolean, siteWorkName: string) {
    // console.log('getReportNOCAirportNOC', value, siteWorkName);
    if (siteWorkName.trim() === 'इनामपत्र 2') {
      this.showReportNOCSection = value;
    }
  }

  onSave = () => {
    // this.appStateManage.StorageKey.setItem('TpOfficeList', JSON.stringify(this.TpOfficeList));
    this.onEntitySaved.emit(this.NALetterList);
    this.router.navigate(['/homepage/Website/Site_Progress_Report_Details']);
    // console.log('onSave TpOfficeList', this.TpOfficeList);
  }

  onCancel = async () => {
    await this.router.navigate(['/homepage/Website/Site_Progress_Report_Details']);

  }

}
