import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { FilterItem } from 'src/app/views/mobile-app/components/shared/chip-filter-mobile-app/chip-filter-mobile-app.component';

@Component({
  selector: 'app-material-requisition-view-mobile-app',
  templateUrl: './material-requisition-view-mobile-app.component.html',
  styleUrls: ['./material-requisition-view-mobile-app.component.scss'],
  standalone: false
})
export class MaterialRequisitionViewMobileAppComponent implements OnInit, OnDestroy {

  Entity = MaterialRequisition.CreateNewInstance();
  MasterList: MaterialRequisition[] = [];
  DisplayMasterList: MaterialRequisition[] = [];
  SiteList: Site[] = [];

  SelectedMaterialRequisition = MaterialRequisition.CreateNewInstance();
  SelectedMaterialItem: any = null;

  companyRef = 0;
  modalOpen = false;
  SearchString = '';
  tableHeaderData = ['Material', 'Unit', 'Required Qty', 'Status'];
  StatusList = DomainEnums.MaterialRequisitionStatusesList();

  filters: FilterItem[] = [];
  selectedFilterValues: Record<string, any> = {};
  MaterialRequisitionStatuses = MaterialRequisitionStatuses;

  expandedRequisitions = new Set<number>();

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private companyState: CompanyStateManagement,
    private dateService: DateconversionService,
    private dtu: DTU,
    private toast: ToastService,
    private haptic: HapticService,
    private alert: AlertService,
    public loadingService: LoadingService
  ) { }

  ngOnInit = async () => {
    // Optional initialization
  }

  ionViewWillEnter = async () => {
    await this.loadMaterialRequisitionIfEmployeeExists();
    this.loadFilters();
  }

  ngOnDestroy() {
    // Add cleanup if needed
  }

  async handleRefresh(event: CustomEvent) {
    await this.loadMaterialRequisitionIfEmployeeExists();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async loadMaterialRequisitionIfEmployeeExists() {
    try {
      await this.loadingService.show();
      this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));

      if (this.companyRef <= 0) {
        await this.toast.present('Company not selected', 1000, 'danger');
        await this.haptic.error();
        return;
      }

      await this.getSiteListByCompanyRef();
      await this.getMaterialRequisitionListByCompanyRef();
    } catch (error) {
      console.error('Error loading Material Requisition:', error);
      await this.toast.present('Failed to load Material Requisition', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide();
    }
  }

  private async getSiteListByCompanyRef() {
    if (this.companyRef <= 0) return;

    const siteList = await Site.FetchEntireListByCompanyRef(this.companyRef, async msg => {
      await this.toast.present(msg, 1000, 'danger');
      await this.haptic.error();
    });

    this.SiteList = siteList;
    this.Entity.p.SiteRef = 0;
    this.Entity.p.Status = 0;
  }

  private async getMaterialRequisitionListByCompanyRef() {
    const list = await MaterialRequisition.FetchEntireListByCompanyRef(this.companyRef, async msg => {
      await this.toast.present(msg, 1000, 'danger');
      await this.haptic.error();
    });

    this.MasterList = this.DisplayMasterList = list;
  }

  private loadFilters() {
    this.filters = [
      {
        key: 'site',
        label: 'Site',
        multi: false,
        options: this.SiteList.map(site => ({ Ref: site.p.Ref, Name: site.p.Name })),
        selected: this.selectedFilterValues['site'] || null
      },
      // {
      //   key: 'status',
      //   label: 'Status',
      //   multi: false,
      //   options: this.StatusList.map(status => ({
      //     Ref: status.Ref,
      //     Name: status.Name
      //   })),
      //   selected: this.selectedFilterValues['status'] || null
      // }
    ];
  }

  async onFiltersChanged(updatedFilters: any[]) {
    console.log('updatedFilters :', updatedFilters);
    for (const filter of updatedFilters) {
      const selectedValue = filter.selected ?? null;
      this.selectedFilterValues[filter.key] = selectedValue;

      if (filter.key === 'site') this.Entity.p.SiteRef = selectedValue || 0;
      if (filter.key === 'status') this.Entity.p.Status = selectedValue || 0;
    }

    await this.getRequisitionListByAllFilters();
    this.loadFilters(); // Reload to reflect updated selected values
  }

  getRequisitionListByAllFilters = async () => {
    this.MasterList = [];
    this.DisplayMasterList = [];
    if (this.companyRef <= 0) {
      await this.toast.present('Company not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }
    let lst = await MaterialRequisition.FetchEntireListByAllFilters(this.companyRef, this.Entity.p.Status, this.Entity.p.SiteRef, async errMsg => {
      await this.toast.present(errMsg, 1000, 'danger');
      await this.haptic.error();
    });
    console.log('this.companyRef, this.Entity.p.Status, this.Entity.p.SiteRef, :', this.companyRef, this.Entity.p.Status, this.Entity.p.SiteRef);
    this.MasterList = lst;
    console.log('lst :', lst);
    // this.DisplayMasterList = this.MasterList;
    this.DisplayMasterList = this.MasterList.filter(item =>
      item.p.MaterialRequisitionDetailsArray.length > 0
    );

  }
  getStatusClass(status: number): string {
    const statusMap: Record<number, string> = {
      [MaterialRequisitionStatuses.Pending]: 'pending',
      [MaterialRequisitionStatuses.Rejected]: 'rejected',
      [MaterialRequisitionStatuses.Approved]: 'approved',
      [MaterialRequisitionStatuses.Ordered]: 'ordered',
      [MaterialRequisitionStatuses.Incomplete]: 'incomplete',
      [MaterialRequisitionStatuses.Completed]: 'completed'
    };

    return statusMap[status] ?? 'default';
  }

  getStatusText(status: number): string {
    const statusMap: Record<number, string> = {
      [MaterialRequisitionStatuses.Pending]: 'Pending',
      [MaterialRequisitionStatuses.Rejected]: 'Rejected',
      [MaterialRequisitionStatuses.Approved]: 'Approved',
      [MaterialRequisitionStatuses.Ordered]: 'Ordered',
      [MaterialRequisitionStatuses.Incomplete]: 'Incomplete',
      [MaterialRequisitionStatuses.Completed]: 'Completed'
    };

    return statusMap[status] ?? '-';
  }

  toggleItemDetails(requisitionId: number) {
    this.expandedRequisitions.has(requisitionId)
      ? this.expandedRequisitions.delete(requisitionId)
      : this.expandedRequisitions.add(requisitionId);
  }

  formatDate(date: string | Date): string {
    return this.dateService.formatDate(date);
  }

  async AddMaterialRequisition() {
    if (this.companyRef <= 0) {
      await this.toast.present('Company not Selected', 1000, 'danger');
      await this.haptic.error();
      return;
    }

    await this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/material-requisition/add']);
  }

  async onEditClicked(item: MaterialRequisition) {
    this.SelectedMaterialRequisition = item.GetEditableVersion();
    MaterialRequisition.SetCurrentInstance(this.SelectedMaterialRequisition);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/material-requisition/edit']);
  }

  async onDeleteClicked(item: MaterialRequisition) {
    try {
      this.alert.presentDynamicAlert({
        header: 'Delete',
        subHeader: 'Confirmation needed',
        message: 'Are you sure you want to delete this Material Requisition?',
        buttons: [
          { text: 'Cancel', role: 'cancel', cssClass: 'custom-cancel' },
          {
            text: 'Yes, Delete',
            cssClass: 'custom-confirm',
            handler: async () => {
              try {
                await item.DeleteInstance(async () => {
                  await this.toast.present(
                    `Material Requisition on ${this.formatDate(item.p.Date)} deleted!`,
                    1000,
                    'success'
                  );
                  await this.haptic.success();
                });
                await this.getRequisitionListByAllFilters();
              } catch (err) {
                console.error('Delete Error:', err);
                await this.toast.present('Failed to delete', 1000, 'danger');
                await this.haptic.error();
              }
            }
          }
        ]
      });
    } catch (error) {
      console.error('Delete alert error:', error);
      await this.toast.present('Something went wrong', 1000, 'danger');
      await this.haptic.error();
    }
  }

  openModal(requisition: MaterialRequisition, materialItem: any) {
    this.SelectedMaterialRequisition = requisition;
    this.SelectedMaterialItem = materialItem;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.SelectedMaterialRequisition = MaterialRequisition.CreateNewInstance();
  }
}
