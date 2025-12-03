import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerFollowUp } from 'src/app/classes/domain/entities/website/customer_management/customerfollowup/customerfollowup';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';
import { ModalController, RefresherCustomEvent } from '@ionic/angular';
import { DTU } from 'src/app/services/dtu.service';
import { ApplicationFeatures } from 'src/app/classes/domain/domainenums/domainenums';
import { FeatureAccessMobileAppService } from 'src/app/services/feature-access-mobile-app.service';

@Component({
  selector: 'app-customer-followup-view-mobile-app',
  templateUrl: './customer-followup-view-mobile-app.component.html',
  styleUrls: ['./customer-followup-view-mobile-app.component.scss'],
  standalone: false,
})
export class CustomerFollowupViewMobileAppComponent
  implements OnInit, OnDestroy
{
  public FilterFollowupList: CustomerFollowUp[] = [];
  public selectedDate: string; // Use a single variable for the selected date
  private companyRef: number = 0;
  featureRef: ApplicationFeatures = ApplicationFeatures.CustomerFollowUp;
  showActionColumn: boolean = false;
  constructor(
    private router: Router,
    private appStateManagement: AppStateManageService,
    private dateconversionService: DateconversionService,
    private dtu: DTU,
    private toastService: ToastService,
    private haptic: HapticService,
    public loadingService: LoadingService,
    private modalCtrl: ModalController,
    public access: FeatureAccessMobileAppService
  ) {
    // Initialize selectedDate to today's date in ISO format
    this.selectedDate = new Date().toISOString();
  }

  async ngOnInit(): Promise<void> {
    await this.loadFollowUps();
  }

  ionViewWillEnter = async (): Promise<void> => {
    this.access.refresh();
    this.showActionColumn =
      this.access.canAdd(this.featureRef) ||
      this.access.canEdit(this.featureRef) ||
      this.access.canDelete(this.featureRef);

    // Re-fetch data on view enter to ensure it's up-to-date
    await this.loadFollowUps();
  };

  ngOnDestroy(): void {
    // Clean up if necessary
  }

  async handleRefresh(event: RefresherCustomEvent): Promise<void> {
    await this.loadFollowUps();
    (event.target as HTMLIonRefresherElement).complete();
  }

  /**
   * Main data loading function. Fetches follow-ups for the selected date.
   */
  public async loadFollowUps(): Promise<void> {
    await this.loadingService.show();
    try {
      this.companyRef = Number(
        this.appStateManagement.localStorage.getItem('SelectedCompanyRef') || 0
      );

      if (this.companyRef <= 0) {
        this.FilterFollowupList = [];
        await this.toastService.present(
          'Please select a company.',
          1000,
          'warning'
        );
        return;
      }

      // Convert selected date to the required API format
      const formattedDate = this.dtu.ConvertStringDateToFullFormat(
        this.selectedDate
      );

      const followUps =
        await CustomerFollowUp.FetchEntireListByDateComapanyAndContactModeRef(
          this.companyRef,
          formattedDate,
          0, // Assuming a default contact mode for initial load
          async (errMsg: string) => {
            await this.toastService.present(`Error: ${errMsg}`, 1000, 'danger');
            await this.haptic.error();
          }
        );
      this.FilterFollowupList = followUps;
    } catch (error) {
      await this.toastService.present(
        'Failed to load follow-up records. Please try again.',
        1000,
        'danger'
      );
    } finally {
      this.loadingService.hide();
    }
  }

  /**
   * Handles the date change event from the ion-datetime component.
   * @param event The ionChange event object.
   */
  public async onDateChange(event: any): Promise<void> {
    if (event.detail.value) {
      this.selectedDate = event.detail.value;
    } else {
      this.selectedDate = new Date().toISOString();
    }

    await this.loadFollowUps();
  }

  /**
   * Formats a date string for display.
   * @param date The date string to format.
   * @returns A formatted date string.
   */
  public formatDate(date: string | Date): string {
    return this.dateconversionService.formatDate(date);
  }

  /**
   * Handles the click on a follow-up card.
   * @param followup The CustomerFollowUp object.
   */
  public async onFollowUpClick(followup: CustomerFollowUp): Promise<void> {
    const selectedItem = followup.GetEditableVersion();
    CustomerFollowUp.SetCurrentInstance(selectedItem);
    this.appStateManagement.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate([
      '/mobile-app/tabs/dashboard/customer-relationship-management/customer-followup/edit',
    ]);
  }
}
