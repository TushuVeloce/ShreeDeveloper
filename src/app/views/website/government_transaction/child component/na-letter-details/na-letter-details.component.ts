import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

@Component({
  selector: 'app-na-letter-details',
  templateUrl: './na-letter-details.component.html',
  styleUrls: ['./na-letter-details.component.scss'],
  standalone: false,

})
export class NaLetterDetailsComponent implements OnInit {
  @Input() SelectedTransactionType: string = '';
  NALetterList: any[] = [];
  constructor(private appStateManage: AppStateManageService,) { }
  ngOnChanges(changes: SimpleChanges): void {
    let arr = JSON.parse(this.appStateManage.StorageKey.getItem('TransactionJson') ?? '[]');

    this.NALetterList = arr.filter((item: { SiteWorkGroupName: string }) => item.SiteWorkGroupName == this.SelectedTransactionType);
    console.log('NALetterList', this.NALetterList);
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
