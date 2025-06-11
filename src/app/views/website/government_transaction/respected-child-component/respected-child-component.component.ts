import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovernmentTransaction } from 'src/app/classes/domain/entities/website/government_office/government_transaction/governmenttransaction';
import { SiteWorkGroup } from 'src/app/classes/domain/entities/website/government_office/siteworkgroup/siteworkgroup';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
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
  TransactionTypeArrayObj: any[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  constructor(private router: Router, private route: ActivatedRoute, private appStateManage: AppStateManageService,
    private utils: Utils, private uiUtils: UIUtils, private companystatemanagement: CompanyStateManagement) {
    let str = this.route.snapshot.params['queryParams'];
    this.SectionName = str;
    this.SelectedTransactionType = this.SectionName;

    this.TransactionTypeArrayObj = JSON.parse(this.appStateManage.StorageKey.getItem('TransactionJson') ?? '[]');
    this.SelectedArrayObj = this.TransactionTypeArrayObj.filter((item: { SiteWorkGroupName: string }) => item.SiteWorkGroupName == this.SelectedTransactionType);
    console.log(this.SelectedTransactionType, ' this.SelectedTransactionType');
    console.log(this.SelectedArrayObj, ' this.SelectedArrayObj');
    console.log(this.TransactionTypeArrayObj, ' this.TransactionTypeArrayObj');

  }
  SiteWorkGroupList: SiteWorkGroup[] = [];
  async ngOnInit() {
    this.Entity = GovernmentTransaction.GetCurrentInstance();
    let lst = await SiteWorkGroup.FetchEntireListByCompanyRef(this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
    this.SiteWorkGroupList = lst;
  }

  onAddTransactionSubmit = async (value: any) => {
    this.Entity.p.CompanyRef = this.companystatemanagement.getCurrentCompanyRef()
    this.Entity.p.CompanyName = this.companystatemanagement.getCurrentCompanyName()
    let arr = await this.updatePreviousObjWithAfterAddValues(this.TransactionTypeArrayObj, value);
    let str = JSON.stringify(arr);
    this.Entity.p.TransactionJson = str;
    let entityToSave = this.Entity.GetEditableVersion();
    // await this.Entity.EnsurePrimaryKeysWithValidValues();
    let entitiesToSave = [entityToSave];

    // return
    let tr = await this.utils.SavePersistableEntities(entitiesToSave);

    if (!tr.Successful) {
      this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    } else {
      await this.uiUtils.showSuccessToster(`${this.SelectedTransactionType} 'saved successfully`);
      this.Entity = GovernmentTransaction.CreateNewInstance();
    }
  }

  updatePreviousObjWithAfterAddValues = async (previousObj: any[], afterAddValues: any[]): Promise<any[]> => {
    return previousObj.map(prevGroup => {
      const matchingGroup = afterAddValues.find(
        newGroup =>
          newGroup.SiteWorkGroupRef === prevGroup.SiteWorkGroupRef &&
          newGroup.SiteWorkGroupName === prevGroup.SiteWorkGroupName
      );

      if (!matchingGroup) return prevGroup;

      const updatedSiteWorks = prevGroup.SiteWorks.map((prevWork: any) => {
        const matchingWork = matchingGroup.SiteWorks.find(
          (newWork: any) => newWork.SiteWorkRef === prevWork.SiteWorkRef
        );

        if (!matchingWork) return prevWork;

        const updatedApplicableTypes = prevWork.ApplicableTypes.map((prevType: any) => {
          const matchingType = matchingWork.ApplicableTypes.find(
            (newType: any) => newType.ApplicableType === prevType.ApplicableType
          );

          return matchingType
            ? { ...prevType, Value: matchingType.Value }
            : prevType;
        });

        return {
          ...prevWork,
          ApplicableTypes: updatedApplicableTypes
        };
      });

      return {
        ...prevGroup,
        SiteWorks: updatedSiteWorks
      };
    });
  }


}
