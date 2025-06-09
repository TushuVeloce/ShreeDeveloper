import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'], 
 imports: [CommonModule, NzLayoutModule,
      NzMenuModule, FormsModule]
    })
export class ForgotPasswordComponent  implements OnInit {
 PasswordVisibility: boolean = false;
  ConfirmPasswordVisibility: boolean = false;
  isOTPVerified: boolean = false;
  isVerifyPassword: boolean = false;
  isResendOtpDisabled: boolean = false;
  isVerifyOtpDisabled: boolean = false;
  ResendOtpTimer: number = 30; // Initial timer value
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  Password: string = '';
  ConfirmPassword: string = '';
  OTP: string = '';

  constructor( private router: Router,
    private appStateManage: AppStateManageService, private uiUtils: UIUtils, private servercommunicator: ServerCommunicatorService,) {
  }
  UserEmailId: string | null = '';
  ngOnInit() {
    this.UserEmailId = this.appStateManage.StorageKey.getItem('userEmailId');
    this.OTP = '';
    this.Password = "";
    this.ConfirmPassword = "";
    this.startResendOtpTimer();
  }

  ngOnDestroy() {

  }

  handlePasswordVisibility = () => {
    this.PasswordVisibility = !this.PasswordVisibility;
  }
  handleConfirmPasswordVisibility = () => {
    this.ConfirmPasswordVisibility = !this.ConfirmPasswordVisibility;
  }
  selectAllValue = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input) {
      input.select();
    }
  }
  checkMaxLength = (event: any) => {
    const maxLength = 6;
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength); // Trim input to max length
    }
  }
 
  ResendOtp = async () => {
    if (this.isResendOtpDisabled) return
    this.OTP = '';
    let body = {
      EMailId: this.UserEmailId,
    }
    this.isResendOtpDisabled = true;
    this.isVerifyOtpDisabled = false;
    // ---------------------using new mqtt service --------------------
    const response = await this.servercommunicator.FetchRequestForMobileApp(
      'sendpasswordchangeemailotp',
      body
    );
    if (!response.Successful) {
      this.isResendOtpDisabled = false;
      await this.uiUtils.showInformationalMessage('Error', response.Message);
      return
    }
    else {
      this.isResendOtpDisabled = false;
      await this.uiUtils.showInformationalMessage('Successfull', 'Please Check Your Mail, Resend OTP Send on Your Email Id');
      this.startResendOtpTimer();
    }
  }
  isDisableInput: boolean = false;
  verifyotp = async () => {
    let body = {
      EMailId: this.UserEmailId,
      OTP: this.OTP
    }
    if (this.OTP == '') {
      await this.uiUtils.showErrorMessage('', 'Enter OTP');
      return
    }
    this.isVerifyOtpDisabled = true;
    // ---------------------using new mqtt service --------------------
    const response = await this.servercommunicator.VerifyOTP(
      'verifyuserotp',
      body
    );
    if (!response.Successful) {
      await this.uiUtils.showErrorMessage('Error', response.Message);
      this.isVerifyOtpDisabled = false;
      this.isOTPVerified = false;
      return
    }
    else {
      this.isVerifyOtpDisabled = true;
      this.isOTPVerified = true;
      this.isDisableInput = false;
      await this.uiUtils.showSuccessToster('OTP Verified Successfuly');
    }
  }

  verifyPassword = async () => {
    if (this.UserEmailId == '') {
      await this.uiUtils.showErrorMessage('Information', 'E-mail Id not Specified');
      return
    }
    else if (this.OTP == '') {
      await this.uiUtils.showErrorMessage('Information', 'OTP not Specified');
      return
    }
    else if (this.Password == '') {
      await this.uiUtils.showErrorMessage('Information', 'Password not Specified');
      return
    }
    else if (this.ConfirmPassword == '') {
      await this.uiUtils.showErrorMessage('Information', 'Confirm Password not Specified');
      return
    }
    else if (this.Password != this.ConfirmPassword) {
      await this.uiUtils.showErrorMessage('Information', 'Password & Confirm Password is not Same');
      return
    }
    let body = {
      EmailId: this.UserEmailId,
      OTP: this.OTP,
      Password: this.Password,
      ConfirmPassword: this.ConfirmPassword
    }
    this.isVerifyPassword = true;
    // ---------------------using new mqtt service --------------------
    const response = await this.servercommunicator.UpdatePassword(
      'updatepassword',
      body
    );
    
    console.log('response :', response);
    if (!response.Successful) {
      await this.uiUtils.showErrorMessage('Error', response.Message);
      this.isVerifyPassword = false;

      return
    }
    else {
      this.isVerifyPassword = false;
      await this.uiUtils.showSuccessToster('Password Change Successfuly');
      await this.router.navigate(['login']);
    }
  }

  BackToLogin = async () => {
    await this.router.navigate(['login']);
  }

  startResendOtpTimer = async () => {
    this.isResendOtpDisabled = true;
    this.ResendOtpTimer = 30; // Reset the timer

    const interval = setInterval(() => {
      this.ResendOtpTimer--;

      if (this.ResendOtpTimer <= 0) {
        clearInterval(interval); // Clear the interval when the timer ends
        this.isResendOtpDisabled = false; // Re-enable the link
      }
    }, 1000); // Decrement every second
  }


  toggleNewPasswordVisibility = () => {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility = () => {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
