import { Injectable } from '@angular/core';
import {
  ApplicationFeatureGroups,
  ApplicationFeatures,
} from '../classes/domain/domainenums/domainenums';

@Injectable({
  providedIn: 'root',
})
export class FeatureAccessMobileAppService {
  private features: any[] = [];
  public readonly StorageKey = localStorage;

  constructor() {
    this.loadFeaturesFromLocal();
  }

  private loadFeaturesFromLocal() {
    const data = this.StorageKey.getItem('ValidMenu');
    this.features = data ? JSON.parse(data) : [];
  }

  refresh() {
    this.loadFeaturesFromLocal();
  }

  // ------------------------------------------------------------------
  // ✔ CHECK ENTIRE FEATURE GROUP
  // ------------------------------------------------------------------
  isFeatureGroupEnabled(groupRef: ApplicationFeatureGroups): boolean {
    return this.features.some((f) => f.FeatureGroupRef === groupRef);
  }

  // ------------------------------------------------------------------
  // ✔ CHECK SPECIFIC FEATURE (existence only)
  // ------------------------------------------------------------------
  hasFeature(featureRef: ApplicationFeatures): boolean {
    return this.features.some((f) => f.FeatureRef === featureRef);
  }

  // ------------------------------------------------------------------
  // ✔ GET FULL RIGHTS FOR A FEATURE
  // ------------------------------------------------------------------
  getFeatureRights(featureRef: ApplicationFeatures) {
    return this.features.find((f) => f.FeatureRef === featureRef) || null;
  }

  // ------------------------------------------------------------------
  // ✔ INDIVIDUAL RIGHTS CHECK
  // ------------------------------------------------------------------
  canAdd(featureRef: ApplicationFeatures): boolean {
    return (
      this.hasFeature(featureRef) &&
      this.getFeatureRights(featureRef).CanAdd === true
    );
  }

  canEdit(featureRef: ApplicationFeatures): boolean {
    return (
      this.hasFeature(featureRef) &&
      this.getFeatureRights(featureRef).CanEdit === true
    );
  }

  canDelete(featureRef: ApplicationFeatures): boolean {
    return (
      this.hasFeature(featureRef) &&
      this.getFeatureRights(featureRef).CanDelete === true
    );
  }

  canView(featureRef: ApplicationFeatures): boolean {
    return (
      this.hasFeature(featureRef) &&
      this.getFeatureRights(featureRef).CanView === true
    );
  }

  canPrint(featureRef: ApplicationFeatures): boolean {
    return (
      this.hasFeature(featureRef) &&
      this.getFeatureRights(featureRef).CanPrint === true
    );
  }

  canExport(featureRef: ApplicationFeatures): boolean {
    return (
      this.hasFeature(featureRef) &&
      this.getFeatureRights(featureRef).CanExport === true
    );
  }
  canApprove(featureRef: ApplicationFeatures): boolean {
    return (
      this.hasFeature(featureRef) &&
      this.getFeatureRights(featureRef).CanApprove === true
    );
  }

  // ------------------------------------------------------------------
  // ⭐ NEW: SHOULD THIS FEATURE APPEAR IN MENU?
  // ------------------------------------------------------------------
  hasAnyAccess(featureRef: ApplicationFeatures): boolean {
    const rights = this.getFeatureRights(featureRef);
    if (!rights) return false;

    return !!(
      rights.CanAdd ||
      rights.CanEdit ||
      rights.CanDelete ||
      rights.CanView ||
      rights.CanApprove ||
      rights.CanPrint ||
      rights.CanExport
    );
  }

  // If you want menu only when CanView is true, you can instead do:
  // hasAnyAccess(featureRef: ApplicationFeatures): boolean {
  //   return this.canView(featureRef);
  // }
}
