import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RefresherCustomEvent, AlertController } from '@ionic/angular';
import { ApplicationFeatures } from 'src/app/classes/domain/domainenums/domainenums';
import { CompanyHolidays } from 'src/app/classes/domain/entities/website/HR_and_Payroll/company_holidays/companyholidays';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { FeatureAccessMobileAppService } from 'src/app/services/feature-access-mobile-app.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-holidays-view-mobile-app',
  templateUrl: './holidays-view-mobile-app.component.html',
  styleUrls: ['./holidays-view-mobile-app.component.scss'],
  standalone: false,
})
export class HolidaysViewMobileAppComponent implements OnInit {
  private companyRef: number = 0;
  public holidaysList: CompanyHolidays[] = [];
  featureRef: ApplicationFeatures = ApplicationFeatures.CompanyHolidays;
  showActionColumn = false;

  constructor(
    private appStateManagement: AppStateManageService,
    private toastService: ToastService,
    private haptic: HapticService,
    public loadingService: LoadingService, // Keep public for template usage
    private router: Router,
    private datePipe: DatePipe,
    private alertController: AlertController,
    private dateConversionService: DateconversionService,
    public access: FeatureAccessMobileAppService
  ) {}

  async ngOnInit(): Promise<void> {
    this.access.refresh();
    this.showActionColumn =
      this.access.canEdit(this.featureRef) ||
      this.access.canDelete(this.featureRef);
    await this.loadHolidays();
  }

  ionViewWillEnter = async (): Promise<void> => {
    this.access.refresh();
    this.showActionColumn =
      this.access.canEdit(this.featureRef) ||
      this.access.canDelete(this.featureRef);
    await this.loadHolidays();
  };

  async handleRefresh(event: RefresherCustomEvent): Promise<void> {
    await this.loadHolidays();
    event.target.complete();
  }

  private async loadHolidays(): Promise<void> {
    this.loadingService.show();
    try {
      this.companyRef = Number(
        this.appStateManagement.localStorage.getItem('SelectedCompanyRef')
      );

      if (this.companyRef <= 0) {
        this.holidaysList = [];
        await this.toastService.present(
          'Please select a company.',
          1000,
          'warning'
        );
        return;
      }

      const list = await CompanyHolidays.FetchEntireListByCompanyRef(
        this.companyRef,
        async (errMsg) => {
          await this.toastService.present(`Error: ${errMsg}`, 1000, 'danger');
        }
      );
      this.holidaysList = list;
    } catch (error) {
      await this.toastService.present(
        'Failed to load company holidays. Please try again.',
        1000,
        'danger'
      );
      this.holidaysList = []; // Clear the list on fetch failure
    } finally {
      this.loadingService.hide();
    }
  }

  private convertToDate(dateString: string): Date {
    const parts = dateString.split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }

  public formatDate(dateString: string): string | null {
    if (!dateString) return null;
    const dateObject = this.dateConversionService.formatDate(dateString);
    return dateObject;
  }

  public formatDateToDay(dateString: string): string | null {
    if (!dateString) return null;
    const dateObject = this.convertToDate(dateString);
    return this.datePipe.transform(dateObject, 'E');
  }

  public async onEditClicked(holiday: CompanyHolidays): Promise<void> {
    this.appStateManagement.StorageKey.setItem('Editable', 'Edit');
    CompanyHolidays.SetCurrentInstance(holiday.GetEditableVersion());
    await this.router.navigate([
      'mobile-app/tabs/attendance/company-holidays/edit',
    ]);
  }

  public async onDeleteClicked(holiday: CompanyHolidays): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete the holiday for "${holiday.p.Reason}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.deleteHoliday(holiday);
          },
        },
      ],
    });
    await alert.present();
  }

  private async deleteHoliday(holiday: CompanyHolidays): Promise<void> {
    this.loadingService.show();
    try {
      await holiday.DeleteInstance(
        async () => {
          await this.toastService.present(
            'Holiday deleted successfully!',
            1000,
            'success'
          );
          await this.loadHolidays();
        },
        async (errMsg) => {
          await this.toastService.present(
            `Failed to delete holiday: ${errMsg}`,
            1000,
            'danger'
          );
        }
      );
    } catch (error) {
      await this.toastService.present(
        'An unexpected error occurred during deletion.',
        1000,
        'danger'
      );
    } finally {
      this.loadingService.hide();
    }
  }

  public async AddCompanyHolidays(): Promise<void> {
    this.haptic.success();
    if (this.companyRef <= 0) {
      await this.toastService.present(
        'Please select a company.',
        1000,
        'warning'
      );
      return;
    }
    this.appStateManagement.StorageKey.setItem('Editable', 'Add');
    await this.router.navigate([
      'mobile-app/tabs/attendance/company-holidays/add',
    ]);
  }
}
