import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

@Component({
  selector: 'app-k-ja-pa-details',
  templateUrl: './k-ja-pa-details.component.html',
  styleUrls: ['./k-ja-pa-details.component.scss'],
  standalone: false,

})
export class KJaPaDetailsComponent implements OnInit {
  @Input() SelectedTransactionType: string = '';
  KJAPAList: any[] = [];
  constructor(private appStateManage: AppStateManageService,) { }
  ngOnChanges(changes: SimpleChanges): void {
    let arr = JSON.parse(this.appStateManage.StorageKey.getItem('TransactionJson') ?? '[]');

    this.KJAPAList = arr.filter((item: { SiteWorkGroupName: string }) => item.SiteWorkGroupName == this.SelectedTransactionType);
    console.log('KJAPAList', this.KJAPAList);
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
