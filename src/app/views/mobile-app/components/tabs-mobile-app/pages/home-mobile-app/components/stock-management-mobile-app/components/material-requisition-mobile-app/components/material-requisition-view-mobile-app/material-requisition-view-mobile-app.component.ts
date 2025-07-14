import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomainEnums, MaterialRequisitionStatuses } from 'src/app/classes/domain/domainenums/domainenums';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { MaterialRequisition } from 'src/app/classes/domain/entities/website/stock_management/material_requisition/materialrequisition';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-material-requisition-view-mobile-app',
  templateUrl: './material-requisition-view-mobile-app.component.html',
  styleUrls: ['./material-requisition-view-mobile-app.component.scss'],
  standalone:false
})
export class MaterialRequisitionViewMobileAppComponent  implements OnInit {

  Entity: MaterialRequisition = MaterialRequisition.CreateNewInstance();
  MasterList: MaterialRequisition[] = [];
  DisplayMasterList: MaterialRequisition[] = [];
  list: any[] = []; // Define proper type if known
  SiteList: Site[] = [];
  SearchString = '';
  SelectedMaterialRequisition: MaterialRequisition = MaterialRequisition.CreateNewInstance();
  SelectedMaterialItem: any = null;
  StatusList = DomainEnums.MaterialRequisitionStatusesList();
  MaterialRequisitionStatuses = MaterialRequisitionStatuses
  CustomerRef = 0;
  companyRef = 0;
  modalOpen = false;
  tableHeaderData = ['Material', 'Unit', 'Required Qty', 'Status']



  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,
    private DateconversionService: DateconversionService,
    private dtu: DTU,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) { }

  ngOnInit = async () => {
    await this.loadMaterialRequisitionIfEmployeeExists();

  }
  ionViewWillEnter = async () => {
    await this.loadMaterialRequisitionIfEmployeeExists();
  }
  ngOnDestroy() {
    // Cleanup if needed
  }

  async handleRefresh(event: CustomEvent) {
    await this.loadMaterialRequisitionIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }
  getStatusClass(status: any): string {
    switch (status) {
      case this.MaterialRequisitionStatuses.Pending:
        return 'pending';
      case this.MaterialRequisitionStatuses.Rejected:
        return 'rejected';
      case this.MaterialRequisitionStatuses.Approved:
        return 'approved';
      case this.MaterialRequisitionStatuses.Ordered:
        return 'ordered';
      case this.MaterialRequisitionStatuses.Incomplete:
        return 'incomplete';
      case this.MaterialRequisitionStatuses.Completed:
        return 'completed';
      default:
        return 'default';
    }
  }

  getStatusText(status: any): string {
    switch (status) {
      case this.MaterialRequisitionStatuses.Pending:
        return 'Pending';
      case this.MaterialRequisitionStatuses.Rejected:
        return 'Rejected';
      case this.MaterialRequisitionStatuses.Approved:
        return 'Approved';
      case this.MaterialRequisitionStatuses.Ordered:
        return 'Ordered';
      case this.MaterialRequisitionStatuses.Incomplete:
        return 'Incomplete';
      case this.MaterialRequisitionStatuses.Completed:
        return 'Completed';
      default:
        return '-';
    }
  }

  expandedRequisitions: Set<number> = new Set();

  toggleItemDetails(requisitionId: number) {
    if (this.expandedRequisitions.has(requisitionId)) {
      this.expandedRequisitions.delete(requisitionId);
    } else {
      this.expandedRequisitions.add(requisitionId);
    }
  }

  private async loadMaterialRequisitionIfEmployeeExists() {
    try {
      await this.loadingService.show();
      this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));

      if (this.companyRef > 0) {
        await this.getSiteListByCompanyRef();
        await this.getMaterialRequisitionListByCompanyRef();
      } else {
        await this.toastService.present('company not selected', 1000, 'danger');
        await this.haptic.error();
      }
    } catch (error) {
      console.error('Error loading Material Requisition:', error);
      await this.toastService.present('Failed to load Material Requisition', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  getSiteListByCompanyRef = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    this.Entity.p.SiteRef = 0;
    let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
      await this.toastService.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    this.SiteList = lst;
    this.Entity.p.SiteRef = 0;
    this.Entity.p.Status = 0;
  }

  getMaterialRequisitionListByCompanyRef = async () => {
    try {
      this.MasterList = [];
      this.DisplayMasterList = [];
      if (this.companyRef <= 0) {
        await this.toastService.present('Company not Selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }
      let lst = await MaterialRequisition.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      });
      this.MasterList = lst;
      console.log('lst :', lst);
      this.DisplayMasterList = this.MasterList;
    } catch (error) {
      console.error('Error fetching material requisitions:', error);
    } finally {
      // await this.loadingService.hide();
    }
  }

  getRequisitionListByAllFilters = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await MaterialRequisition.FetchEntireListByAllFilters(
      this.companyRef,
      this.Entity.p.Status,
      this.Entity.p.SiteRef,
      async errMsg => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      }
    );
    console.log('Status & SiteRef:', this.Entity.p.Status, this.Entity.p.SiteRef);
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
  }

  formatDate = (date: string | Date): string => {
    return this.DateconversionService.formatDate(date);
  }

  AddMaterialRequisition = async () => {
    if (this.companyRef <= 0) {
      await this.toastService.present('Company not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    await this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/material-requisition/add']);
  }

  onEditClicked = async (item: MaterialRequisition) => {
    this.SelectedMaterialRequisition = item.GetEditableVersion();
    MaterialRequisition.SetCurrentInstance(this.SelectedMaterialRequisition);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/material-requisition/edit']);
  }

  async onDeleteClicked(item: MaterialRequisition) {
    try {
      this.alertService.presentDynamicAlert({
        header: 'Delete',
        subHeader: 'Confirmation needed',
        message: 'Are you sure you want to delete this Material Requisition?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {
              console.log('Deletion cancelled.');
            }
          },
          {
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                await item.DeleteInstance(async () => {
                  await this.toastService.present(
                    `MaterialRequisition on ${this.formatDate(item.p.Date)} has been deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
                await this.getRequisitionListByAllFilters();
              } catch (err) {
                console.error('Error deleting material requisition:', err);
                await this.toastService.present('Failed to delete material requisition', 1000, 'danger');
                await this.haptic.error();
              }
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error showing delete confirmation:', error);
      await this.toastService.present('Something went wrong', 1000, 'danger');
      await this.haptic.error();
    }
  }

  openModal(requisition: any, materialItem: any) {
    console.log('requisition: any, materialItem: any :', requisition, materialItem);
    this.SelectedMaterialRequisition = requisition;
    this.SelectedMaterialItem = materialItem;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedMaterialRequisition = MaterialRequisition.CreateNewInstance();
  }
}
