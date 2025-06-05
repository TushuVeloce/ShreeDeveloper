import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { UserLoginRequest } from 'src/app/classes/infrastructure/request_response/userloginrequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { SessionValues } from 'src/app/services/sessionvalues.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule]
  // standalone: true,
})
export class LoginPageComponent implements OnInit {
  isIosPlatform: boolean = false;
  isAndroidPlatform: boolean = false;
  showPassword: boolean = false;
  isForgetPasswordDisabled: boolean = false;
  isSpinning: boolean = false;


  isMobile: boolean = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  constructor(private router: Router, private platform: Platform, private servercommunicator: ServerCommunicatorService,
    private uiUtils: UIUtils, private activatedRoute: ActivatedRoute, private sessionValues: SessionValues,
    private appStateManage: AppStateManageService,private companystatemanagement: CompanyStateManagement,) {

    platform.ready().then(async () => {
      this.isIosPlatform = platform.is('ios');
      this.isAndroidPlatform = platform.is('android');
    });
  }

  // UserId: string = 'shweta@veloce.com';
  UserId: string = 'admin@gmail.com';
  Password: string = 'admin123';

  ngOnInit() { }
  Login = async () => {
    if (this.UserId === '') {
      this.uiUtils.showErrorMessage('Error', 'Please Enter Email ID');
      return
    } else if (this.Password === '') {
      this.uiUtils.showErrorMessage('Error', 'Please Enter Password');
      return
    }

    let req = new UserLoginRequest();
    req.UserId = this.UserId;
    req.Password = this.Password;
    req.LoginDeviceId = this.sessionValues.LoginDeviceId;
    // req.SenderURL;

    const response = await this.servercommunicator.LoginUser(req);
    this.appStateManage.setEmployeeRef(response.LoginEmployeeRef)
    this.appStateManage.setLoginToken(response.LoginToken)
    this.appStateManage.StorageKey.setItem("IsDefaultUser", response.IsDefault.toString())
    this.appStateManage.StorageKey.setItem("UserDisplayName", response.UserDisplayName)
    this.appStateManage.StorageKey.setItem('SelectedCompanyRef', response.LastSelectedCompanyRef.toString());
    this.appStateManage.StorageKey.setItem('companyName', response.CompanyName);
    this.appStateManage.StorageKey.setItem('LoginEmployeeRef', response.LoginEmployeeRef.toString());
    this.companystatemanagement.setCompanyRef(response.LastSelectedCompanyRef,response.CompanyName)

    if (!response.Successful) {
      await this.uiUtils.showErrorMessage('Error', response.Message);
      return
    } else {
      //   const user = { UserDisplayName: response.UserDisplayName, EMailId: response.EMailId, PhoneNos: response.PhoneNos }
      // this.appStateManage.setUserJSON(user);
      if (this.isMobile) {
        await this.router.navigate(['/app_homepage']);  // Navigate to mobile
      } else if (response.LoginForFirstTime == 0) {
        await this.router.navigate(['/create_password']);
      } else {
        await this.router.navigate(['/homepage']);  // Navigate to web
        this.appStateManage.triggerCompanyInit(); 
      }
    }
  }

    ForgetPassword = async () => {
    let body = {
      EMailId: this.UserId,
    };
    this.isForgetPasswordDisabled = true;
    this.isSpinning = true;
    this.appStateManage.StorageKey.setItem('userEmailId', this.UserId);
    const response = await this.servercommunicator.FetchRequestForMobileApp(
      'generateuserotp',
      body
    );
    if (!response.Successful) {
      alert("no")
      await this.uiUtils.showInformationalMessage('Error', response.Message);
      this.isForgetPasswordDisabled = false;
      this.isSpinning = false;
      return;
    } else {
      alert("yes")
      this.isForgetPasswordDisabled = false;
      this.isSpinning = false;
      await this.uiUtils.showInformationalMessage(
        'Successfull',
        'Please Check Your Mail, OTP Send On Your Email Id'
      );
      this.appStateManage.setIsForgetPasswordClickedValue(true);
       await this.router.navigate(['/forgot_password']);
    }
    
  };

  togglePasswordVisibility = () => {
    this.showPassword = !this.showPassword;
  };
}
