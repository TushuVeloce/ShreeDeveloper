import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

@Component({
  selector: 'app-ulc-details',
  templateUrl: './ulc-details.component.html',
  styleUrls: ['./ulc-details.component.scss'],
  standalone: false,

})
export class UlcDetailsComponent implements OnInit {
  @Input() SelectedTransactionType: string = '';
  ULCList: any[] = [];
  constructor(private appStateManage: AppStateManageService,) { }
  ngOnChanges(changes: SimpleChanges): void {
    let arr = JSON.parse(this.appStateManage.StorageKey.getItem('TransactionJson') ?? '[]');

    this.ULCList = arr.filter((item: { SiteWorkGroupName: string }) => item.SiteWorkGroupName == this.SelectedTransactionType);
    console.log('ULCList', this.ULCList);
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
