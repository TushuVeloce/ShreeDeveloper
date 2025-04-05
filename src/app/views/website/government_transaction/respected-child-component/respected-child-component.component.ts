import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovernmentTransaction } from 'src/app/classes/domain/entities/website/government_office/government_transaction/governmenttransaction';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Utils } from 'src/app/services/utils.service';

@Component({
  selector: 'app-respected-child-component',
  templateUrl: './respected-child-component.component.html',
  styleUrls: ['./respected-child-component.component.scss'],
  standalone: false,

})
export class RespectedChildComponentComponent implements OnInit {
  SectionName: string = '';
  SelectedTransactionType: string = '';
  private IsNewEntity: boolean = true;
  Entity: GovernmentTransaction = GovernmentTransaction.CreateNewInstance();
  SelectedArrayObj: any[] = [];
  constructor(private router: Router, private route: ActivatedRoute, private appStateManage: AppStateManageService, private utils: Utils, private uiUtils: UIUtils,) {
    let str = this.route.snapshot.params['queryParams'];
    // console.log('str :', str);
    this.SectionName = str;
    this.SelectedTransactionType = this.SectionName;

    let arr = JSON.parse(this.appStateManage.StorageKey.getItem('TransactionJson') ?? '[]');
    this.SelectedArrayObj = arr.filter((item: { SiteWorkGroupName: string }) => item.SiteWorkGroupName == this.SelectedTransactionType);
    console.log('TpOfficeList', this.SelectedArrayObj);
    // console.log(this.SelectedTransactionType);
  }

  ngOnInit() {
    this.Entity = GovernmentTransaction.GetCurrentInstance();

  }
  onAddTransactionSubmit = async (value: any) => {
    console.log('onAddTransactionType', value);
    // debugger
    for (let i = 0; i < this.SelectedArrayObj.length; i++) {
      const e = this.SelectedArrayObj[i];
      if (e.SiteWorkGroupRef == value.SiteWorkGroupRef) {

        let str = JSON.stringify(value);
        this.Entity.p.TransactionJson = str;
        let entityToSave = this.Entity.GetEditableVersion();
        console.log('entityToSave :', entityToSave);
        await this.router.navigate(['/homepage/Website/Government_Transaction_Details']);
        return
        let entitiesToSave = [entityToSave];
        // await this.Entity.EnsurePrimaryKeysWithValidValues()
        let tr = await this.utils.SavePersistableEntities(entitiesToSave);

        if (!tr.Successful) {
          this.uiUtils.showErrorMessage('Error', tr.Message);
          return;
        } else {
          await this.uiUtils.showSuccessToster('Site Work Done  saved successfully!');
          this.Entity = GovernmentTransaction.CreateNewInstance();

          // if (this.IsNewEntity) {
          //   await this.uiUtils.showSuccessToster('Site Work Done  saved successfully!');
          //   this.Entity = GovernmentTransaction.CreateNewInstance();
          //   await this.router.navigate(['/homepage/Website/Government_Transaction_Details']);
          // } else {
          //   await this.uiUtils.showSuccessToster('Site Work Done  Updated successfully!');
          // }
        }
        // if (e.SiteWorks.length > 0 && value.SiteWorks.length > 0) {
        //   this.SelectedArrayObj[i].ApplicableTypesName = value.ApplicableTypesName;
        //   this.SelectedArrayObj[i].ApplicableTypesValue = value.ApplicableTypesValue;
        //   this.SelectedArrayObj[i].ApplicableTypesRef = value.ApplicableTypesRef;
        //   this.SelectedArrayObj[i].ApplicableTypesId = value.ApplicableTypesId;
        //   this.SelectedArrayObj[i].ApplicableTypeName = value.ApplicableTypeName
        // }
      }
    }
    console.log('SelectedArrayObj', this.SelectedArrayObj);

  }
}