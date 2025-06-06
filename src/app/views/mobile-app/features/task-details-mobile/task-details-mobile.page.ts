import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-task-details-mobile',
  templateUrl: './task-details-mobile.page.html',
  styleUrls: ['./task-details-mobile.page.scss'],
  standalone: false
})
export class TaskDetailsMobilePage implements OnInit {

  taskName: string = ''; // ✅ Add missing property
  taskDetails: string = ''; // ✅ Add missing property
  isEditMode: boolean = false;
  taskId: string | null = null;
  siteName: string = '';
  startDate: string | null = '';
  endDate: string | null = '';
  priority: string = '';
  status: string = '';
  message: string = '';
  selectedOptions: any[] = [];
  options: any[] = [];
  modalInstance: any = null;
  bottomsheetTitle: string = 'Select Site';
  siteList: Site[] = [];
  selectedSite: Site[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companystatemanagement: CompanyStateManagement,
    private uiUtils: UIUtils,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    // private dateTimePickerService: DateTimePickerService,
    private datePipe: DatePipe,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;
    this.getSiteList();

    if (this.isEditMode) {
      // Fetch existing data based on `taskId` if needed
      this.taskName = 'Sample Task'; // Replace with actual data
      this.taskDetails = 'Task description'; // Replace with actual data
    }
  }
  getSiteList = async () => {
    this.siteList = await Site.FetchEntireListByCompanyRef(
      this.companyRef(),
      async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
    );
  };

  save() {
    if (this.isEditMode) {
    } else {
    }
    // this.router.navigate(['/app_homepage/tabs/task-management']); // ✅ Fix router access
    this.navCtrl.back();

  }
  goBack() {
    // this.router.navigate(['/app_homepage/tabs/task-management']);
    this.navCtrl.back();
  }
  // async openSelectModal() {
  //   const selected = await this.bottomsheetMobileAppService.openSelectModal(
  //     this.siteList,
  //     this.selectedOptions,
  //     false,
  //     this.bottomsheetTitle
  //   );
  //   if (selected) {
  //     this.selectedOptions = selected;
  //     this.siteName=selected[0].p.Name;
  //   }
  // }
  // async selectStartDate() {
  //   const pickedDate = await this.dateTimePickerService.open({
  //     mode: 'date',
  //     label: 'Select Start Date',
  //     value: this.startDate,
  //   });

  //   if (pickedDate) {
  //     this.startDate = this.datePipe.transform(pickedDate, 'yyyy-MM-dd');
  //   }
  // }
  // async selectEndDate() {
  //   const pickedDate = await this.dateTimePickerService.open({
  //     mode: 'date',
  //     label: 'Select End Date',
  //     value: this.endDate,
  //   });

  //   if (pickedDate) {
  //     this.endDate = this.datePipe.transform(pickedDate, 'yyyy-MM-dd');
  //     // this.endDate = pickedDate;
  //   }
  // }

  selectSite() {
    this.openSelectModal(
      this.siteList,
      this.selectedOptions,
      this.bottomsheetTitle,
      (selected) => {
        this.selectedOptions = selected;
        this.siteName = selected[0]?.p?.Name || '';
      }
    );
  }

  async openSelectModal(
    dataList: any[],
    selectedItems: any[],
    title: string,
    updateCallback: (selected: any[]) => void
  ) {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(
      dataList,
      selectedItems,
      false,
      title
    );

    if (selected) {
      updateCallback(selected);
    }
  }

}
