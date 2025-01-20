// import { Injectable, isDevMode } from '@angular/core';
// import { Router, Event, NavigationEnd } from '@angular/router';
// import { ServerCommunicatorService } from './server-communicator.service';
// import { SessionValues } from './sessionvalues.service';
// import { UIUtils } from './uiutils.service';
// import { TransactionResult } from '../classes/infrastructure/transactionresult';
// import { LoadingController } from '@ionic/angular';
// import { isNullOrUndefined } from 'src/tools';
// import { MessageHubService } from './messagehub.service';
// import { TimeService } from './time.service';
// import { CacheDataChangeLevelManager } from '../classes/infrastructure/cachedatamanagement/cachedatachangelevelfetchrequestresponse';
// import { SubscriptionCleanupManager } from '../classes/infrastructure/subscriptioncleanupmanager';
// import { CacheDataSubscriptionStatusManager } from '../classes/infrastructure/cachedatamanagement/cachedatasubscriptionstatusmanager';
// import { PayloadPacket } from '../classes/infrastructure/payloadpacket/payloadpacket';
// import { PayloadPacketFacade } from '../classes/infrastructure/payloadpacket/payloadpacketfacade';
// import { SystemUserLoginResponse } from '../classes/infrastructure/request_response/systemuserloginresponse';
// import { SystemUserLogoutRequest } from '../classes/infrastructure/request_response/systemuserlogoutrequest';
// import { SystemUserLoginRequest } from '../classes/infrastructure/request_response/systemuserloginrequest';

// const TOKEN_KEY = 'auth-token';

// @Injectable({
//   providedIn: 'root'
// })
// export class SessionControllerService {
//   constructor(private router: Router,
//     private serverCommunicator: ServerCommunicatorService,
//     private uiUtils: UIUtils,
//     private payloadPacketFacade: PayloadPacketFacade,
//     private sessionValues: SessionValues,
//     private loadingController: LoadingController,
//     private timeService: TimeService,
//     private messageHub: MessageHubService) { }

//   get IsDevMode() {
//     return isDevMode();
//   }

//   IsDevPageOpen = false;

//   public async Login(vjLicenseKey: string, userName: string, password: string) {
//     let req: SystemUserLoginRequest = {
//       Ref: 0,
//       UserName: userName,
//       Password: password,
//       RequestingIPAddress: ''
//     }
//     let pkt: PayloadPacket = this.payloadPacketFacade.CreateNewPayloadPacket2(req, "SystemUserLoginRequest");

//     const loading = await this.loadingController.create({
//       message: 'Authenticating ...'
//     });
//     await loading.present();

//     let result: TransactionResult = await this.serverCommunicator.LoginUser(this.sessionValues.requestController, pkt);

//     await loading.dismiss();

//     if (!result.Successful) {
//       this.sessionValues.ClearAllStateValues();

//       await this.timeService.DisconnectFromTimeServerHub();
//       await this.messageHub.DisconnectFromMessageHub();

//       await this.uiUtils.showErrorMessage("Login", result.Message);

//       return false;
//     }
//     else {
//       if (result.TagType === "SystemUserLoginResponse") {
//         let resp2 = JSON.parse(result.Tag) as SystemUserLoginResponse;
//         if (resp2.SystemUserLoginRequestRef !== req.Ref) {
//           this.sessionValues.ClearAllStateValues();

//           await this.timeService.DisconnectFromTimeServerHub();
//           await this.messageHub.DisconnectFromMessageHub();

//           await this.uiUtils.showErrorMessage("Login", "Login failed. Request context has been changed.");

//           return false;
//         }
//         else {
//           this.sessionValues.UserName = resp2.UserName;
//           this.sessionValues.FullName = resp2.FullName;
//           this.sessionValues.CustomerName = resp2.CustomerName;
//           this.sessionValues.CustomerLicenseNo = resp2.CustomerLicenseNo;
//           this.sessionValues.VJLicenseKey = resp2.VJLicenseKey;
//           this.sessionValues.CurrentLoginToken = resp2.Token;

//           await this.timeService.ConnectToTimeServerHub();
//           await this.messageHub.ConnectToMessageHub();

//           await CacheDataChangeLevelManager.RefreshCacheDataChangeLevels();

//           await this.router.navigateByUrl('/landing');

//           return true;
//         }
//       }
//     }

//     return false;
//   }

//   public async logout(askForConfirmation: boolean = true,
//     postLogoutCallback: () => void = null as any) {
//     let yesHandler = async () => {
//       let req: SystemUserLogoutRequest = {
//         IPAddress: '',
//         Token: this.sessionValues.CurrentLoginToken
//       };

//       let pkt: PayloadPacket = this.payloadPacketFacade.CreateNewPayloadPacket2(req, "SystemUserLogoutRequest");
//       let result: TransactionResult = await this.serverCommunicator.LogoutUser(this.sessionValues.requestController, pkt);

//       this.sessionValues.ClearAllStateValues();

//       await this.timeService.DisconnectFromTimeServerHub();
//       await this.messageHub.DisconnectFromMessageHub();

//       SubscriptionCleanupManager.UnsubscribeAllMessageHubHandlers();
//       CacheDataSubscriptionStatusManager.ClearAllCacheDataTopicSubscriptionStatuses();

//       if (!result.Successful) {
//         await this.uiUtils.showErrorMessage("Log out", `You have been logged out.<br><br>However, the following error has occured:\n\n${result.Message}`);
//       }

//       await this.router.navigateByUrl('/login');
//       if (!isNullOrUndefined(postLogoutCallback)) postLogoutCallback();
//     }

//     if (askForConfirmation) {
//       await this.uiUtils.askForConfirmation("Log out",
//         "Are you sure you want to log out?",
//         yesHandler);
//     }
//     else {
//       await yesHandler();
//     }
//   }
// }
