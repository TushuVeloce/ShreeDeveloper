import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GovernmentTransaction } from 'src/app/classes/domain/entities/website/government_office/government_transaction/governmenttransaction';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-government-transaction-details',
  templateUrl: './government-transaction-details.component.html',
  styleUrls: ['./government-transaction-details.component.scss'],
  standalone: false,

})
export class GovernmentTransactionDetailsComponent implements OnInit {
  Entity: GovernmentTransaction = GovernmentTransaction.CreateNewInstance();
  DetailsFormTitle: 'New Government Transaction' | 'Edit Government Transaction' =
    'New Government Transaction';
  private IsNewEntity: boolean = true;

  constructor(private router: Router, private appStateManage: AppStateManageService,
    private utils: Utils, private companystatemanagement: CompanyStateManagement) { }
  TransactionJson: any[] = [];

  ngOnInit() {
    if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
      this.IsNewEntity = false;

      this.DetailsFormTitle = this.IsNewEntity
        ? 'New Government Transaction'
        : 'Edit Government Transaction';
    }
    this.Entity = GovernmentTransaction.GetCurrentInstance();
    let arr = JSON.parse(this.Entity.p.TransactionJson);
    this.appStateManage.StorageKey.setItem('TransactionJson', JSON.stringify(arr));
    this.TransactionJson = arr;
    // console.log('Entity', arr);
  }

  getSiteWorkGroupName = async (SiteWorkGroupName: string) => {
    // console.log('SiteWorkGroupName', SiteWorkGroupName);
    await this.router.navigate(['/homepage/Website/Respected_child', { queryParams: SiteWorkGroupName }]);
  }

  onSave = () => {
    let arr = this.appStateManage.StorageKey.getItem('TpOfficeList')
    // console.log('onSave arr', arr);
  }

  onCancel = async () => {
    await this.router.navigate(['/homepage/Website/Site_Progress_Report']);
  }
}
