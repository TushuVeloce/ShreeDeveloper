import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

@Component({
  selector: 'app-k-ja-pa-details',
  templateUrl: './k-ja-pa-details.component.html',
  styleUrls: ['./k-ja-pa-details.component.scss'],
  standalone: false,

})
export class KJaPaDetailsComponent implements OnInit {
  @Input() SelectedTransactionType: string = '';
  @Output() onEntitySaved = new EventEmitter<any>();
  KJAPAList: any[] = [];
  constructor(private appStateManage: AppStateManageService, private router: Router,) { }
  ngOnChanges(changes: SimpleChanges): void {
    let arr = JSON.parse(this.appStateManage.StorageKey.getItem('TransactionJson') ?? '[]');

    this.KJAPAList = arr.filter((item: { SiteWorkGroupName: string }) => item.SiteWorkGroupName == this.SelectedTransactionType);
    // console.log('KJAPAList', this.KJAPAList);
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
   if (siteWorkName.trim() === 'Report NOC & Airport NOC') {
     this.showReportNOCSection = value;
   }
 }
  onSave = () => {
    // this.appStateManage.StorageKey.setItem('TpOfficeList', JSON.stringify(this.TpOfficeList));
    this.onEntitySaved.emit(this.KJAPAList);
    this.router.navigate(['/homepage/Website/Site_Progress_Report_Details']);
    // console.log('onSave TpOfficeList', this.TpOfficeList);
  }

  onCancel = async () => {
    await this.router.navigate(['/homepage/Website/Site_Progress_Report_Details']);

  }

}
