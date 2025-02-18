import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { UserLoginRequest } from 'src/app/classes/infrastructure/request_response/userloginrequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { SessionValues } from 'src/app/services/sessionvalues.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  // standalone: true,
})
export class LoginPageComponent implements OnInit {
  isIosPlatform: boolean = false;
  isAndroidPlatform: boolean = false;


  UserId: string = '';
  Password: string = '';

  isMobile: boolean = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  constructor(private router: Router, private platform: Platform, private servercommunicator: ServerCommunicatorService,
    private uiUtils: UIUtils,
    private activatedRoute: ActivatedRoute,
    private sessionValues: SessionValues,
    private appStateManage: AppStateManageService,) {

    platform.ready().then(async () => {
      this.isIosPlatform = platform.is('ios');
      this.isAndroidPlatform = platform.is('android');
    });
  }

  ngOnInit() { }
  Login = async () => {

    if (this.isMobile) {
      await this.router.navigate(['/app_homepage']);  // Navigate to mobile
    } else {
      await this.router.navigate(['/homepage']);  // Navigate to web
    }
  }
}


// Start Code
// if (this.isIosPlatform || this.isAndroidPlatform) {
//   await this.router.navigate(['/app_homepage']);
// }
// else {
//   await this.router.navigate(['/website_homepage']);
// }

// After API
// Login = async () => {

//   // New Code
//   if (this.UserId === '') {
//     this.uiUtils.showErrorMessage('Error', 'Please Enter Email ID');
//     return
//   } else if (this.Password === '') {
//     this.uiUtils.showErrorMessage('Error', 'Please Enter Password');
//     return
//   }

//   let req = new UserLoginRequest();
//   req.UserId = this.UserId;
//   req.Password = this.Password;
//   // req.LoginDeviceId = this.sessionValues.LoginDeviceId;
//   // req.SenderURL;

//   const response = await this.servercommunicator.LoginUser(req);

//   if (!response.Successful) {
//     await this.uiUtils.showInformationalMessage('Error', response.Message);
//     return
//   } else {
//     const user = { UserDisplayName: response.UserDisplayName, EMailId: response.EMailId, Role: response.Role, PhoneNos: response.PhoneNos }
//     this.appStateManage.setUserJSON(user);
//     if (this.isMobile) {
//       await this.router.navigate(['/app_homepage']);  // Navigate to mobile
//     } else {
//       await this.router.navigate(['/homepage']);  // Navigate to web
//     }
//   }
// }