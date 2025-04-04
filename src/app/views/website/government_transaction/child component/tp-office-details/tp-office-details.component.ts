import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

@Component({
  selector: 'app-tp-office-details',
  templateUrl: './tp-office-details.component.html',
  styleUrls: ['./tp-office-details.component.scss'],
  standalone: false,

})
export class TpOfficeDetailsComponent implements OnInit, OnChanges {
  @Input() SelectedTransactionType: string = '';
  TpOfficeList: any[] = [];
  constructor(private appStateManage: AppStateManageService,) { }
  ngOnChanges(changes: SimpleChanges): void {
    debugger
    let arr = JSON.parse(this.appStateManage.StorageKey.getItem('TransactionJson') ?? '[]');
    console.log('SelectedTransactionType',this.SelectedTransactionType);

    this.TpOfficeList = arr.filter((item: { SiteWorkGroupName: string }) => item.SiteWorkGroupName == this.SelectedTransactionType);
    console.log('TpOfficeList', this.TpOfficeList);
  }

  ngOnInit() { }


  getTypeOnApplicableTypeName = (ApplicableTypesName: string): '' | 'checkbox' | 'number' | 'date' | 'radio' | 'text' => {
    switch (ApplicableTypesName) {
      case 'Submit': return 'checkbox';
      case 'Inward No': return 'number';
      case 'Inward Date': return 'date';
      case 'Scrutiny Fees': return 'checkbox';
      default:
        return ''; // Default return value
    }
  }
}
