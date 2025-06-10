import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

@Component({
  selector: 'app-final-layout-details',
  templateUrl: './final-layout-details.component.html',
  styleUrls: ['./final-layout-details.component.scss'],
  standalone: false,

})
export class FinalLayoutDetailsComponent implements OnInit {

  @Input() SelectedTransactionType: string = '';
  @Output() onEntitySaved = new EventEmitter<any>();

  FinalLayoutList: any[] = [];
  constructor(private appStateManage: AppStateManageService, private router: Router,) { }
  ngOnChanges(changes: SimpleChanges): void {
    let arr = JSON.parse(this.appStateManage.StorageKey.getItem('TransactionJson') ?? '[]');
    this.FinalLayoutList = arr.filter((item: { SiteWorkGroupName: string }) => item.SiteWorkGroupName == this.SelectedTransactionType);
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
  IsRoadNOCStatus(value: boolean, siteWorkName: string) {
    if (siteWorkName.trim() === 'रोड NOC 2') {
      this.showReportNOCSection = value;
    }
  }

  BindApplicableTypeValueStatusToRadioButton = () => {
    for (let i = 0; i < this.FinalLayoutList.length; i++) {
      let SiteWorksList = this.FinalLayoutList[i].SiteWorks;
      let ApplicableTypesList = SiteWorksList.filter((item: { SiteWorkName: string }) => item.SiteWorkName == 'रोड NOC 2');

      let ApplicableTypeValueList = ApplicableTypesList[0].ApplicableTypes.filter((item: { SiteWorkApplicableTypeName: string }) => item.SiteWorkApplicableTypeName == 'Yes No');
      this.IsRoadNOCStatus(ApplicableTypeValueList[0].Value, ApplicableTypesList[0].SiteWorkName);
    }

  }
  onSave = () => {
    // this.appStateManage.StorageKey.setItem('TpOfficeList', JSON.stringify(this.TpOfficeList));
    this.onEntitySaved.emit(this.FinalLayoutList);
    this.router.navigate(['/homepage/Website/Site_Progress_Report_Details']);
  }

  onCancel = async () => {
    await this.router.navigate(['/homepage/Website/Site_Progress_Report_Details']);

  }

}
