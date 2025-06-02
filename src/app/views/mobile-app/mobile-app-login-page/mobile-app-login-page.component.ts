import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Keyboard } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';
import { UserLoginRequest } from 'src/app/classes/infrastructure/request_response/userloginrequest';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { SessionValues } from 'src/app/services/sessionvalues.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-mobile-app-login-page',
  templateUrl: './mobile-app-login-page.component.html',
  styleUrls: ['./mobile-app-login-page.component.scss'],
  standalone: false
})
export class MobileAppLoginPageComponent implements OnInit {
  ngOnInit() {}
  showPassword: boolean = false;
  UserId: string = '';
  Password: string = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private router: Router, private servercommunicator: ServerCommunicatorService,
    private uiUtils: UIUtils, private sessionValues: SessionValues,
    private appStateManage: AppStateManageService,private companystatemanagement: CompanyStateManagement) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin = async () => {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      let req = new UserLoginRequest();
      this.UserId = email ?? '';
      this.Password = password ?? '';
      if (this.UserId === '') {
        this.uiUtils.showErrorMessage('Error', 'Please Enter Email ID');
        return
      } else if (this.Password === '') {
        this.uiUtils.showErrorMessage('Error', 'Please Enter Password');
        return
      }
      req.UserId = this.UserId;
      req.Password = this.Password;
      req.LoginDeviceId = this.sessionValues.LoginDeviceId;
      const response = await this.servercommunicator.LoginUser(req);
      console.log('response :', response);
      // this.appStateManage.setEmployeeRef(response.LoginEmployeeRef)
      // this.appStateManage.setLoginToken(response.LoginToken)
      // this.appStateManage.StorageKey.setItem("UserDisplayName", response.UserDisplayName)
      this.appStateManage.setEmployeeRef(response.LoginEmployeeRef)
      this.appStateManage.setLoginToken(response.LoginToken)
      this.appStateManage.StorageKey.setItem("IsDefaultUser", response.IsDefault.toString())
      this.appStateManage.StorageKey.setItem("UserDisplayName", response.UserDisplayName)
      this.appStateManage.StorageKey.setItem('SelectedCompanyRef', response.LastSelectedCompanyRef.toString());
      this.appStateManage.StorageKey.setItem('companyName', response.CompanyName);
      this.appStateManage.StorageKey.setItem('LoginEmployeeRef', response.LoginEmployeeRef.toString());
      this.companystatemanagement.setCompanyRef(response.LastSelectedCompanyRef, response.CompanyName)


      if (!response.Successful) {
        await this.uiUtils.showErrorMessage('Error', response.Message);
        return
      } else {
        if (response.LoginForFirstTime == 0) {
          await this.router.navigate(['/create_password_mobile']);
        } else {
          await this.router.navigate(['/app_homepage']);
        }
      }
    }
  }
}
