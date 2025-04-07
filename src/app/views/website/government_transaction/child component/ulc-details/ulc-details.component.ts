import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

@Component({
  selector: 'app-ulc-details',
  templateUrl: './ulc-details.component.html',
  styleUrls: ['./ulc-details.component.scss'],
  standalone: false,

})
export class UlcDetailsComponent implements OnInit {
  @Input() SelectedTransactionType: string = '';
  @Output() onEntitySaved = new EventEmitter<any>();

  ULCList: any[] = [];
  constructor(private appStateManage: AppStateManageService, private router: Router) { }
  ngOnChanges(changes: SimpleChanges): void {
    let arr = JSON.parse(this.appStateManage.StorageKey.getItem('TransactionJson') ?? '[]');

    this.ULCList = arr.filter((item: { SiteWorkGroupName: string }) => item.SiteWorkGroupName == this.SelectedTransactionType);
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

  onSave = () => {
    // this.appStateManage.StorageKey.setItem('TpOfficeList', JSON.stringify(this.TpOfficeList));
    this.onEntitySaved.emit(this.ULCList);
    this.router.navigate(['/homepage/Website/Government_Transaction_Details']);
    // console.log('onSave TpOfficeList', this.TpOfficeList);
  }

  onCancel = async () => {
    await this.router.navigate(['/homepage/Website/Government_Transaction_Details']);

  }

}
