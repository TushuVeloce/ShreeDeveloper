import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialRequisitionStatuses } from 'src/app/classes/domain/domainenums/domainenums';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { MaterialRequisition } from 'src/app/classes/domain/entities/website/stock_management/material_requisition/materialrequisition';
import { RequiredMaterialDetailProps } from 'src/app/classes/domain/entities/website/stock_management/material_requisition/requiredmaterial/requiredmaterial';
import { CurrentDateTimeRequest } from 'src/app/classes/infrastructure/request_response/currentdatetimerequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { BottomsheetMobileAppService } from 'src/app/services/bottomsheet-mobile-app.service';
import { DTU } from 'src/app/services/dtu.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-material-requisition-details-mobile-app',
  templateUrl: './material-requisition-details-mobile-app.component.html',
  styleUrls: ['./material-requisition-details-mobile-app.component.scss'],
  standalone: false
})
export class MaterialRequisitionDetailsMobileAppComponent implements OnInit {
  Entity: MaterialRequisition = MaterialRequisition.CreateNewInstance();
  IsNewEntity: boolean = true;
  isSaveDisabled: boolean = false;
  DetailsFormTitle: 'New Material Requisition' | 'Edit Material Requisition' = 'New Material Requisition';
  IsDropdownDisabled: boolean = false;
  InitialEntity: MaterialRequisition = null as any;
  SiteList: Site[] = [];
  AllMaterialList: Material[] = [];
  MaterialList: Material[] = [];
  localEstimatedStartingDate: string = '';
  localEstimatedEndDate: string = '';
  ismaterialModalOpen: boolean = false;
  newRequisition: RequiredMaterialDetailProps = RequiredMaterialDetailProps.Blank();
  editingIndex: null | undefined | number
  strCDT: string = ''
  ModalEditable: boolean = false;
  companyRef: number = 0;
  SiteName: string = '';
  selectedSite: any[] = [];
  MaterialName: string = '';
  selectedMaterial: any[] = [];
  tableHeaderData = ['Material', 'Unit', 'Required Qty'];
  MaterialRequisitionStatuses = MaterialRequisitionStatuses;
  Date : string | null = null;

  constructor(
    private router: Router,
    private appStateManage: AppStateManageService,
    private dtu: DTU,
    private bottomsheetMobileAppService: BottomsheetMobileAppService,
    private toastService: ToastService,
    private haptic: HapticService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private utils: Utils,
    private datePipe: DatePipe
  ) { }

  ngOnInit = async () => {
    // await this.loadMaterialRequisitionDetailsIfCompanyExists();

  }
  ionViewWillEnter = async () => {
    await this.loadMaterialRequisitionDetailsIfCompanyExists();
  }
  ngOnDestroy() {
    // Cleanup if needed
  }

  private loadMaterialRequisitionDetailsIfCompanyExists = async () => {
    try {
      await this.loadingService.show(); // Awaiting this is critical
      this.companyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));
      this.Date = this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? '';
      if (this.companyRef > 0) {
        this.appStateManage.setDropdownDisabled(true);

        await this.getSiteListByCompanyRef();           // Await async methods
        await this.getMaterialListByCompanyRef();       // Await async methods

        if (this.appStateManage.StorageKey.getItem('Editable') == 'Edit') {
          this.IsNewEntity = false;
          this.DetailsFormTitle = 'Edit Material Requisition';
          this.Entity = MaterialRequisition.GetCurrentInstance();
          this.appStateManage.StorageKey.removeItem('Editable');

          if (this.Entity.p.Date != '') {
            this.Date = this.dtu.ConvertStringDateToShortFormat(this.Entity.p.Date);
          }
          this.selectedSite = [{
            p: {
              Ref: this.Entity.p.SiteRef,
              Name: this.Entity.p.SiteName
            }
          }];
          this.SiteName = this.selectedSite[0].p.Name;
        } else {
          this.Entity = MaterialRequisition.CreateNewInstance();
          MaterialRequisition.SetCurrentInstance(this.Entity);

          if (this.Entity.p.Date == '') {
            this.strCDT = await CurrentDateTimeRequest.GetCurrentDateTime();
            let parts = this.strCDT.substring(0, 16).split('-');
            this.Entity.p.Date = `${parts[0]}-${parts[1]}-${parts[2]}`;
            this.strCDT = `${parts[0]}-${parts[1]}-${parts[2]}-00-00-00-000`;
          }
        }

        this.InitialEntity = Object.assign(
          MaterialRequisition.CreateNewInstance(),
          this.utils.DeepCopy(this.Entity)
        ) as MaterialRequisition;
      } else {
        await this.toastService.present('company not selected', 1000, 'warning');
        await this.haptic.warning();
      }
    } catch (error) {
      await this.toastService.present('Failed to load Material Requisition details', 1000, 'danger');
      await this.haptic.error();
    } finally {
      await this.loadingService.hide(); // Also ensure this is awaited
    }
  }

  public onDateChange = async (date: any): Promise<void> => {
    this.Date = this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    this.Entity.p.Date = this.Date ?? '';
  }

  getSiteListByCompanyRef = async () => {
    try {
      if (this.companyRef <= 0) {
        await this.toastService.present('Company not Selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }
      let lst = await Site.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
        await this.toastService.present(errMsg, 1000, 'danger')
        await this.haptic.error();
      });
      this.SiteList = lst;
    } catch (error) {
      await this.toastService.present('Failed to load Site list', 1000, 'danger');
      await this.haptic.error();
    }
  }

  getMaterialListByCompanyRef = async () => {
    try {
      if (this.companyRef <= 0) {
        await this.toastService.present('Company not Selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }
      let lst = await Material.FetchEntireListByCompanyRef(this.companyRef, async errMsg => {
        await this.toastService.present(errMsg, 1000, 'danger')
        await this.haptic.error();
      });
      this.AllMaterialList = lst;
      this.filterMaterialList();
    } catch (error) {
      await this.toastService.present('Failed to load Material list', 1000, 'danger');
      await this.haptic.error();
    }
  }

  getUnitByMaterialRef = async (materialref: number) => {
    try {
      this.newRequisition.UnitRef = 0;
      this.newRequisition.UnitName = '';
      this.newRequisition.MaterialName = ''
      if (materialref <= 0 || materialref <= 0) {
        await this.toastService.present('Material not Selected', 1000, 'warning');
        await this.haptic.warning();
        return;
      }
      let lst = await Material.FetchInstance(materialref, this.companyRef, async errMsg => {
        await this.toastService.present(errMsg, 1000, 'danger');
        await this.haptic.error();
      });
      this.newRequisition.UnitRef = lst.p.UnitRef;
      this.newRequisition.UnitName = lst.p.UnitName;
      this.newRequisition.MaterialName = lst.p.Name
    } catch (error) {
      await this.toastService.present('Failed to load Unit list', 1000, 'danger');
      await this.haptic.error();
    }
  }


  openModal = async (type: number) => {
    if (this.Entity.p.SiteRef == 0){
      await this.toastService.present('Site not Selected', 1000, 'warning');
      await this.haptic.warning();
      return;
    }
    if (type === 100) this.ismaterialModalOpen = true;
    this.ModalEditable = false;
  }

  closeModal = async (type: number) => {
    if (type === 100) {
      const keysToCheck = ['MaterialRef', 'UnitRef', 'EstimatedQty'] as const;

      const hasData = keysToCheck.some(key => {
        const value = (this.newRequisition as any)[key];

        // Check for non-null, non-undefined, non-empty string or non-zero number
        if (typeof value === 'string') {
          return value.trim() !== '';
        } else if (typeof value === 'number') {
          return !isNaN(value) && value !== 0;
        } else {
          return value != null; // for cases like object refs or non-primitive types
        }
      });

      if (hasData) {
        this.alertService.presentDynamicAlert({
          header: 'Close',
          subHeader: 'Confirmation needed',
          message: 'Are you sure you want to close this form?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'custom-cancel',
              handler: () => {
              }
            },
            {
              text: 'Yes, Close',
              cssClass: 'custom-confirm',
              handler: () => {
                this.ismaterialModalOpen = false;
                this.ModalEditable = false;
                this.newRequisition = RequiredMaterialDetailProps.Blank();
                this.MaterialName = '';
                this.selectedMaterial = [];
                this.haptic.success();
              }
            }
          ]
        });
      } else {
        this.ismaterialModalOpen = false;
        this.newRequisition = RequiredMaterialDetailProps.Blank();
        this.MaterialName = '';
        this.selectedMaterial = [];
      }
    }
  };

  filterMaterialList = () => {
    const usedRefs = this.Entity.p.MaterialRequisitionDetailsArray.map(item => item.MaterialRef);
    this.MaterialList = this.AllMaterialList.filter(
      material => !usedRefs.includes(material.p.Ref)
    );
  }


  addMaterial = async () => {
    try {
      if (this.newRequisition.MaterialRef == 0) {
        await this.toastService.present('Material cannot be blank.', 1000, 'warning');
        await this.haptic.warning();
        return;
      }
      if (this.newRequisition.RequisitionQty == 0) {
        await this.toastService.present('Required Quantity cannot be blank.', 1000, 'warning');
        await this.haptic.warning();
        return;
      }
      this.loadingService.show();
        if (this.editingIndex !== null && this.editingIndex !== undefined && this.editingIndex >= 0) {
        this.Entity.p.MaterialRequisitionDetailsArray[this.editingIndex] = { ...this.newRequisition };
        this.ismaterialModalOpen = false;
        await this.toastService.present('material details updated successfully.', 1000, 'success');
        await this.haptic.success();
      } else {
        this.newRequisition.MaterialRequisitionRef = this.Entity.p.Ref;
        this.Entity.p.MaterialRequisitionDetailsArray.push({ ...this.newRequisition });
        await this.toastService.present('material added successfully.', 1000, 'success')
        await this.haptic.success();
      }
      this.newRequisition = RequiredMaterialDetailProps.Blank();
      this.editingIndex = null;
      this.filterMaterialList();
      this.ismaterialModalOpen = false;
      this.ModalEditable = false;
      this.MaterialName = '';
      this.selectedMaterial = [];
    } catch (error) {
      await this.toastService.present('Failed to add material', 1000, 'danger');
      await this.haptic.error();
    }
    finally {
      this.loadingService.hide();
    }
  }

  editMaterial = async (index: number) => {
    try {
      this.ismaterialModalOpen = true
      this.newRequisition = { ...this.Entity.p.MaterialRequisitionDetailsArray[index] }
      this.ModalEditable = true;
      this.editingIndex = index;
      this.getUnitByMaterialRef(this.newRequisition.MaterialRef);
      this.selectedMaterial = [{ p: { Ref: this.newRequisition.MaterialRef, Name: this.newRequisition.MaterialName } }];
      this.MaterialName = this.selectedMaterial[0].p.Name;
    } catch (error) {
      await this.toastService.present('Failed to edit material', 1000, 'danger');
      await this.haptic.error();
    }
  }

  removeMaterial = async (index: number) => {
    this.alertService.presentDynamicAlert({
      header: 'Delete',
      subHeader: 'Confirmation needed',
      message: 'Are you sure you want to Delete this material?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'custom-cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes, Delete',
          cssClass: 'custom-confirm',
          handler: () => {
            this.Entity.p.MaterialRequisitionDetailsArray.splice(index, 1);
            this.filterMaterialList();
            this.haptic.success();
          }
        }
      ]
    });
  }

  SaveMaterialRequisition = async () => {
    try {
      this.Entity.p.CompanyRef = Number(this.appStateManage.localStorage.getItem('SelectedCompanyRef'));
      this.Entity.p.UpdatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));
      this.Entity.p.CreatedBy = Number(this.appStateManage.localStorage.getItem('LoginEmployeeRef'));
      this.newRequisition.MaterialRequisitionRef = this.Entity.p.Ref
      this.Entity.p.Date = this.dtu.ConvertStringDateToFullFormat(this.Entity.p.Date)
      let entityToSave = this.Entity.GetEditableVersion();
      let entitiesToSave = [entityToSave];
      let tr = await this.utils.SavePersistableEntities(entitiesToSave);
      if (!tr.Successful) {
        this.isSaveDisabled = false;
        await this.toastService.present(tr.Message, 1000, 'danger')
        await this.haptic.error();
        return;
      } else {
        this.isSaveDisabled = false;
        if (this.IsNewEntity) {
          await this.toastService.present('MaterialRequisition saved successfully', 1000, 'success')
          this.Entity = MaterialRequisition.CreateNewInstance();
          await this.haptic.success();
        } else {
          await this.toastService.present('Material Requisition Updated successfully', 1000, 'success')
          await this.haptic.success();

        }
        await this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/material-requisition'], { replaceUrl: true });
      }
    } catch (error) {
      await this.toastService.present('Failed to save Material Requisition', 1000, 'danger')
      await this.haptic.error();
    }
  };


  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }
  public selectMaterialBottomsheet = async (): Promise<void> => {
    try {
      const options = this.MaterialList;
      this.openSelectModal(options, this.selectedMaterial, false, 'Select Material', 1, (selected) => {
        this.selectedMaterial = selected;
        this.newRequisition.MaterialRef = selected[0].p.Ref;
        this.MaterialName = selected[0].p.Name;
        this.getUnitByMaterialRef(this.newRequisition.MaterialRef)
      });
    } catch (error) {
      await this.toastService.present('Failed to load Material list', 1000, 'danger');
      await this.haptic.error();
    }
  }
  public selectSiteBottomsheet = async (): Promise<void> => {
    try {
      const options = this.SiteList;
      this.openSelectModal(options, this.selectedSite, false, 'Select Site', 1, (selected) => {
        this.selectedSite = selected;
        this.Entity.p.SiteRef = selected[0].p.Ref;
        this.SiteName = selected[0].p.Name;
      });
    } catch (error) {
      await this.toastService.present('Failed to load Site list', 1000, 'danger');
      await this.haptic.error();
    }
  }
  private async openSelectModal(
    dataList: any[],
    selectedItems: any[],
    multiSelect: boolean,
    title: string,
    MaxSelection: number,
    updateCallback: (selected: any[]) => void
  ): Promise<void> {
    const selected = await this.bottomsheetMobileAppService.openSelectModal(dataList, selectedItems, multiSelect, title, MaxSelection);
    if (selected) updateCallback(selected);
  }
  isDataFilled(): boolean {
    const emptyEntity = MaterialRequisition.CreateNewInstance();
    return !this.deepEqualIgnoringKeys(this.Entity, emptyEntity, ['p.Date']);
  }

  deepEqualIgnoringKeys(obj1: any, obj2: any, ignorePaths: string[]): boolean {
    const clean = (obj: any, path = ''): any => {
      if (obj === null || typeof obj !== 'object') return obj;

      const result: any = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        const fullPath = path ? `${path}.${key}` : key;
        if (ignorePaths.includes(fullPath)) continue;
        result[key] = clean(obj[key], fullPath);
      }
      return result;
    };

    const cleanedObj1 = clean(obj1);
    const cleanedObj2 = clean(obj2);

    return JSON.stringify(cleanedObj1) === JSON.stringify(cleanedObj2);
  }

  goBack = async () => {
    // Replace this with your actual condition to check if data is filled
    const isDataFilled = this.isDataFilled(); // Implement this function based on your form

    if (isDataFilled) {
      this.alertService.presentDynamicAlert({
        header: 'Warning',
        subHeader: 'Confirmation needed',
        message: 'You have unsaved data. Are you sure you want to go back? All data will be lost.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'custom-cancel',
            handler: () => {

            }
          },
          {
            text: 'Yes, Close',
            cssClass: 'custom-confirm',
            handler: () => {
              this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/material-requisition'], { replaceUrl: true });
              this.haptic.success();
            }
          }
        ]
      });
    } else {
      this.router.navigate(['/mobile-app/tabs/dashboard/stock-management/material-requisition'], { replaceUrl: true });
      this.haptic.success();
    }
  }
}
