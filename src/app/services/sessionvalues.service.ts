import { Injectable, isDevMode } from "@angular/core";
import { Platform } from "@ionic/angular";
import { ServiceInjector } from "../classes/infrastructure/injector";
import { DeviceOrientations, PlatformTypes } from "../classes/infrastructure/enums";
import { BaseUrlService } from './baseurl.service';
import { isNullOrUndefined } from 'src/tools';
import * as uuid from 'uuid';
import { AppStateManageService } from "./app-state-manage.service";

@Injectable({
  providedIn: "root",
})
export class SessionValues {
  public static GetInstance(): SessionValues {
    return ServiceInjector.AppInjector.get(SessionValues)
  }

  public PlatformType: PlatformTypes = PlatformTypes.Mobile;
  public DeviceOrientation: DeviceOrientations = DeviceOrientations.Portrait;

  public IsFullScreenRequested: boolean = false;

  public VJLicenseKey: string = '';
  public ProjectName: string = 'Velojewel'

  private m_isLoggedIn: boolean = false;

  public set IsLoggedIn(value: boolean) {
    if (isDevMode()) {
      this.appStateManage.StorageKey.setItem('IsLoggedIn', String(value));
    }
    else {
      this.m_isLoggedIn = value;
    }
  }

  public get IsLoggedIn() {
    if (isDevMode()) {
      return !!this.appStateManage.StorageKey.getItem('IsLoggedIn');
    }
    else {
      return this.m_isLoggedIn;
    }
  }

  public static getCustomerIdentifier() {
    let urlString = location.origin;

    if (urlString.includes('localhost')) {
      return '';
    }

    urlString = urlString.substring(8);

    let urlParts = urlString.split('.');

    if (urlParts.length > 0) {
      return urlParts[0];
    }
    else {
      return '';
    }
  }

  public static getCustomerCodeForTopic() {
    let cCode = SessionValues.getCustomerIdentifier();
    if (cCode.trim().length == 0) cCode = "VJTEST";
    return cCode.toUpperCase();
  }

  private formulateControllerUrlString(controllerName: string) {
    let controllerURLstring = this.baseUrlService.GenerateBaseUrl();
    controllerURLstring += `/${controllerName}`

    return controllerURLstring;
  }

  public get flashFilesAPIRoot(): string {
    return this.formulateControllerUrlString('flashfiles');
  }

  public get requestController(): string {
    return this.formulateControllerUrlString('request');
  }

  public get cloudUIController(): string {
    return this.formulateControllerUrlString('cloudui');
  }
  
  public get mobileApp(): string {
    return this.formulateControllerUrlString('mobileapp');
  }

  public get guestOperations(): string {
    return this.formulateControllerUrlString('guestoperations');
  }

  public get userManagement(): string {
    return this.formulateControllerUrlString('usermanagement');
  }

  public get mqttController(): string {
    return this.formulateControllerUrlString('mqtt');
  }


  public get UserDisplayName()
  {
    let result = this.appStateManage.StorageKey.getItem('UserDisplayName');
    return isNullOrUndefined(result) ? '' : result!;
  }

  public set UserDisplayName(value: string)
  {
    this.appStateManage.StorageKey.setItem('UserDisplayName', value);
  }

  public get CurrentLoginToken()
  {
    let result = this.appStateManage.StorageKey.getItem('CurrentLoginToken');
    return isNullOrUndefined(result) ? '' : result!;
  }

  public set CurrentLoginToken(value: string)
  {
    this.appStateManage.StorageKey.setItem('CurrentLoginToken', value);
  }

  public ClearAllStateValues = () => {
    this.UserDisplayName = '';
    this.CurrentLoginToken = '';
  }

  constructor(private platform: Platform,
    private baseUrlService: BaseUrlService,
    private appStateManage:AppStateManageService) {
  }

  isAuthenticated() {
    return this.CurrentLoginToken.trim().length !== 0;
  }

  private m_loginDeviceId: string = '';

  public get LoginDeviceId(): string
  {
    if (this.m_loginDeviceId.length == 0)
    {
      let ldid = this.appStateManage.StorageKey.getItem('LoginDeviceId');

      if (isNullOrUndefined(ldid))
      {
        ldid = uuid.v7();
        this.appStateManage.StorageKey.setItem('LoginDeviceId', JSON.stringify(ldid));
      }

      this.m_loginDeviceId = ldid!;
    }

    return this.m_loginDeviceId;
  }
}
