import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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

  constructor(private appStateManage: AppStateManageService, private router: Router,) { }
  ngOnChanges(changes: SimpleChanges): void {
    let arr = JSON.parse(this.appStateManage.StorageKey.getItem('TransactionJson') ?? '[]');
    // console.log('SelectedTransactionType', this.SelectedTransactionType);

    this.TpOfficeList = arr.filter((item: { SiteWorkGroupName: string }) => item.SiteWorkGroupName == this.SelectedTransactionType);
    // console.log('TpOfficeList', this.TpOfficeList);
  }

  ngOnInit() { }


  getTypeOnApplicableTypeName = (ApplicableTypesName: string): '' | 'checkbox' | 'number' | 'date' | 'radio' | 'text' => {
    switch (ApplicableTypesName) {
      case 'Submit': return 'checkbox';
      case 'Inward No': return 'number';
      case 'Inward Date': return 'date';
      case 'Scrutiny Fees': return 'checkbox';
      case 'Yes No': return 'radio';
      default:
        return ''; // Default return value
    }
  }

  getReportNOCAirportNOC = (value: boolean) => {
    console.log(value, 'value');

  }

  onSave = () => {
    // this.appStateManage.StorageKey.setItem('TpOfficeList', JSON.stringify(this.TpOfficeList));
    this.onEntitySaved.emit(this.TpOfficeList);
    this.router.navigate(['/homepage/Website/Site_Progress_Report_Details']);
    // console.log('onSave TpOfficeList', this.TpOfficeList);
  }

  onCancel = async () => {
    await this.router.navigate(['/homepage/Website/Site_Progress_Report_Details']);

  }

}
