import { Injectable, signal } from '@angular/core';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

export interface MenuItem {
  FeatureRef: number;
  FeatureName: string;
  FeatureGroupRef: number;
  CanAdd: boolean;
  CanEdit: boolean;
  CanDelete: boolean;
  CanView: boolean;
  CanPrint: boolean;
  CanExport: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ValidMenuItemsStateManagementMobileApp {
  
  // Initialize the signal directly with data from local storage
  // This ensures the state is persistent across page reloads.
  public SelectedValidMenuItems = signal<MenuItem[]>(this.loadFromLocalStorage());

  constructor(private appStateManagement: AppStateManageService) { }

  /**
   * Initializes the signal with data from local storage.
   * Returns an empty array if no data is found or if parsing fails.
   */
  private loadFromLocalStorage(): MenuItem[] {
    const storedData = this.appStateManagement.localStorage.getItem('ValidMenu');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Ensure the parsed data is an array
        if (Array.isArray(parsedData)) {
          return parsedData;
        }
      } catch (e) {
        console.error('Failed to parse ValidMenu from localStorage', e);
      }
    }
    return []; // Return an empty array if data is missing or invalid
  }

  /**
   * Sets the valid menu items and stores them in local storage.
   * @param validMenuItems The array of MenuItem objects to set.
   */
  setValidMenuItems(validMenuItems: MenuItem[]) {
    // Store the data in localStorage for persistence
    this.appStateManagement.localStorage.setItem('ValidMenu', JSON.stringify(validMenuItems));
    // Update the signal
    this.SelectedValidMenuItems.set(validMenuItems);
  }

  /**
   * Retrieves a single MenuItem based on its FeatureRef.
   * @param featureRef The FeatureRef of the menu item to find.
   * @returns The MenuItem object, or undefined if not found.
   */
  getData(featureRef: number): MenuItem | undefined {
    return this.SelectedValidMenuItems().find(feature => feature.FeatureRef === featureRef);
  }

  /**
   * Retrieves the entire array of valid menu items.
   * The name `getCurrentCompanyRef` is misleading; renamed to reflect its purpose.
   */
  getValidMenuItems(): MenuItem[] {
    return this.SelectedValidMenuItems();
  }
}