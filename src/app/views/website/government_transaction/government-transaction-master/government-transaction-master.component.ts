import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GovernmentTransaction } from 'src/app/classes/domain/entities/website/government_office/government_transaction/governmenttransaction';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-government-transaction-master',
  templateUrl: './government-transaction-master.component.html',
  styleUrls: ['./government-transaction-master.component.scss'],
  standalone: false,
})

export class GovernmentTransactionMasterComponent implements OnInit {

  Entity: GovernmentTransaction = GovernmentTransaction.CreateNewInstance();
  MasterList: GovernmentTransaction[] = [];
  DisplayMasterList: GovernmentTransaction[] = [];
  SearchString: string = '';
  SelectedGovernmentTransaction: GovernmentTransaction = GovernmentTransaction.CreateNewInstance();
  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.', 'Site Name', 'TP Office', 'NA Letter', 'Mojani', 'ULC', 'Final Layout', 'KaJaPa', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) {
    // effect(() => {
    //   this.getGovernmentTransactionListByCompanyRef();
    // });
  }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
    await this.FormulateGovernmentTransactionList();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withoutDropdown');
  }

  groupCompletionStatus: { [ref: string]: { [groupName: string]: boolean } } = {};
  SiteList: Site[] = [];

  FormulateGovernmentTransactionList = async () => {
    // fetching government transaction list by company ref
    // let lst = await GovernmentTransaction.FetchEntireListByCompanyRef(
    //   this.companyRef(), async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));

    //  fetching entire government transaction list 

    this.DisplayMasterList = [];
    let lst = await GovernmentTransaction.FetchEntireList(async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;

    // fetching site list by company ref
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let SiteListbycompanyname = await Site.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.SiteList = SiteListbycompanyname;

    // get Transaction Type List Status 

    for (let i = 0; i < this.MasterList.length; i++) {
      debugger
      let obj = this.MasterList[i];
      let transactionJson = obj.p.TransactionJson;
      let transactionRef = obj.p.Ref;

      let groups: any[] = JSON.parse(transactionJson);
      // console.log(`Transaction #${obj.p.Ref} => Parsed Groups:`, groups);

      for (let group of groups) {
        let isGroupComplete = true;

        if (!group.SiteWorks || group.SiteWorks.length === 0) {
          isGroupComplete = false;
        } else {
          for (let siteWork of group.SiteWorks) {
            if (!siteWork.ApplicableTypes || siteWork.ApplicableTypes.length === 0) {
              // isGroupComplete = false;
              continue;
            }

            //  Check for 'Yes No' first
            const hasYesNo = siteWork.ApplicableTypes.some((app: any) =>
              app.SiteWorkApplicableTypeName?.toLowerCase() === 'yes no'
            );

            if (hasYesNo) {
              isGroupComplete = true;
              break; // Exit the siteWork loop early
            }

            // Check all values
            for (let applicable of siteWork.ApplicableTypes) {
              const val = applicable.Value;
              if (val === null || val === undefined || val === "" || val === false) {
                isGroupComplete = false;
                break;
              }
            }

            if (!isGroupComplete) break;
          }
        }

        if (!this.groupCompletionStatus[obj.p.Ref]) {
          this.groupCompletionStatus[obj.p.Ref] = {};
        }

        this.groupCompletionStatus[obj.p.Ref][group.SiteWorkGroupName] = isGroupComplete;
        console.log(this.groupCompletionStatus[obj.p.Ref][group.SiteWorkGroupName]);

        if (isGroupComplete) {
          this.getGroupStatus(transactionRef, group.SiteWorkGroupName);
        }

        console.log(`Transaction #${transactionRef} → ${group.SiteWorkGroupName}: ${isGroupComplete}`);
      }

    }
  }

  SiteManagementRef: number = 0;
  onsitechange = (siteref: number) => {
    if (siteref > 0 && this.MasterList.length > 0) {
      this.DisplayMasterList = this.MasterList.filter(e => (e.p.SiteRef == siteref));
    }
    else {
      this.DisplayMasterList = this.MasterList;
    }
  }

  getGroupStatus(ref: number, groupName: string): boolean {
    // console.log('Looking for status → Ref:', ref, 'Group:', groupName);
    // console.log('Data:', this.groupCompletionStatus[ref]);
    return this.groupCompletionStatus[ref]?.[groupName] === true;

    // switch (groupName) {
    //   case 'TP Office': return this.Entity.p.TpOfficeStatus = groupStatus;
    //   case 'परिशिष्ठ A(NA)': return this.Entity.p.NaLetterStatus = true;
    //   case 'मोजणी': return this.Entity.p.MojaniStatus = true;
    //   case 'ULC': return this.Entity.p.ULCStatus = true;
    //   case 'Final Layout': return this.Entity.p.FinalLayoutStatus = true;
    //   case 'क जा पा': return this.Entity.p.KaJaPaStatus = true;
    //   default:
    //     return false; // Default return value
    // }

  }

  onEditClicked = async (item: GovernmentTransaction) => {
    this.SelectedGovernmentTransaction = item.GetEditableVersion();

    GovernmentTransaction.SetCurrentInstance(this.SelectedGovernmentTransaction);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    await this.router.navigate(['/homepage/Website/Site_Progress_Report_Details']);
  };

  onDeleteClicked = async (GovernmentTransaction: GovernmentTransaction) => {
    await this.uiUtils.showConfirmationMessage(
      'Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
       Are you sure that you want to DELETE this GovernmentTransaction?`,
      async () => {
        await GovernmentTransaction.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(
            `GovernmentTransaction ${GovernmentTransaction.p.SiteName} has been deleted!`
          );
          await this.FormulateGovernmentTransactionList();
          this.SearchString = '';
          this.loadPaginationData();

        });
      }
    );
  };

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  };
  get paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  AddGovernmentTransaction = async () => {
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Site_Progress_Report_Details']);
  }


  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }

  GovermentList = [
    {
      "SiteWorkGroupName": "Mojani",
      "SiteWorks": [{
        "SiteWork": [{
          "SiteWorkName": "T.P पत्र",
          "ApplicableTypes": [{
            "SiteWorkApplicableTypeName": "Submit",
            "Value": "false"
          }, {
            "SiteWorkApplicableTypeName": "Inward No",
            "Value": ""
          }, {
            "SiteWorkApplicableTypeName": "Date",
            "Value": ""
          }
          ]
        }
        ]
      }, {
        "SiteWork": [{
          "SiteWorkName": "प्राधिकरण Office पत्र",
          "ApplicableTypes": [{
            "SiteWorkApplicableTypeName": "Submit",
            "Value": "false"
          }
          ]
        }
        ]
      }
      ]
    }, {
      "SiteWorkGroupName": "T.P Office",
      "SiteWorks": [{
        "SiteWork": [{
          "SiteWorkName": "Survey Remark",
          "ApplicableTypes": [{
            "SiteWorkApplicableTypeName": "Submit",
            "Value": "false"
          }
          ]
        }
        ]
      }, {
        "SiteWork": [{
          "SiteWorkName": "Tentative Layout",
          "ApplicableTypes": [{
            "SiteWorkApplicableTypeName": "Submit",
            "Value": "false"
          }, {
            "SiteWorkApplicableTypeName": "Inward No",
            "Value": ""
          }, {
            "SiteWorkApplicableTypeName": "Date",
            "Value": ""
          }, {
            "SiteWorkApplicableTypeName": "Scrutiny Fees",
            "Value": ""
          }
          ]
        }
        ]
      }
      ]
    }
  ];


  getTypeOnApplicableTypeName = (ApplicableTypesName: string): '' | 'checkbox' | 'number' | 'date' | 'radio' | 'text' => {
    switch (ApplicableTypesName) {
      case 'Submit': return 'checkbox';
      case 'Inward No': return 'number';
      case 'Date': return 'date';
      case 'Scrutiny Fees': return 'checkbox';
      default:
        return ''; // Default return value
    }
  }




}
