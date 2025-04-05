import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

@Component({
  selector: 'app-mojani-details',
  templateUrl: './mojani-details.component.html',
  styleUrls: ['./mojani-details.component.scss'],
  standalone: false,

})
export class MojaniDetailsComponent implements OnInit {
  @Input() SelectedTransactionType: string = '';
  MojaniList: any[] = [];
  constructor(private appStateManage: AppStateManageService,) { }
  ngOnChanges(changes: SimpleChanges): void {
    let arr = JSON.parse(this.appStateManage.StorageKey.getItem('TransactionJson') ?? '[]');

    this.MojaniList = arr.filter((item: { SiteWorkGroupName: string }) => item.SiteWorkGroupName == this.SelectedTransactionType);
    console.log('MojaniList', this.MojaniList);
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
