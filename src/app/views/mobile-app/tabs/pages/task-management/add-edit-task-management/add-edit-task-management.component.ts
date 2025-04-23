import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';
import { SelectModalComponent } from 'src/app/views/mobile-app/shared/select-modal/select-modal.component';

@Component({
  selector: 'app-add-edit-task-management',
  templateUrl: './add-edit-task-management.component.html',
  styleUrls: ['./add-edit-task-management.component.scss'],
  standalone: false
})
export class AddEditTaskManagementComponent implements OnInit {
  taskName: string = '';  // ✅ Add missing property
  taskDetails: string = ''; // ✅ Add missing property
  isEditMode: boolean = false;
  taskId: string | null = null;
  name: string = '';
  email: string = '';
  message: string = '';
  selectedOptions: any[] = [];
  options: any[] = []
  modalInstance: any = null;
  bottomsheetTitle: string = 'Select Site';
  siteList: Site[] = [];
  selectedSite: Site[] = [];
  companyRef = this.companystatemanagement.SelectedCompanyRef;


  constructor(private route: ActivatedRoute, private router: Router, private companystatemanagement: CompanyStateManagement,
    private uiUtils: UIUtils, private bottomsheetMobileAppService: BottomsheetMobileAppService) { }

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;
    this.getSiteList()

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
  }

  save() {
    if (this.isEditMode) {
      console.log('Updating task:', this.taskId);
    } else {
      console.log('Creating new task');
    }
    this.router.navigate(['/app_homepage/tabs/task-management']); // ✅ Fix router access
  }
  goBack() {
    this.router.navigate(['/app_homepage/tabs/task-management']);
  }
  async openSelectModal() {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(this.options, this.selectedOptions, false, this.bottomsheetTitle);
    if (selected) {
      this.selectedOptions = selected;
    }
  }
}
