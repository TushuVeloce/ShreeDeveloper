import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { HapticService } from '../../../core/haptic.service';
import { ToastService } from '../../../core/toast.service';

@Component({
  selector: 'app-forgot-password-mobile-app',
  templateUrl: './forgot-password-mobile-app.component.html',
  styleUrls: ['./forgot-password-mobile-app.component.scss'],
  standalone: false
})
export class ForgotPasswordMobileAppComponent  implements OnInit {

  forgotForm!: FormGroup;
  step: number = 1;

  otpDigits: string[] = ['', '', '', '', '', ''];
  otpArray: string[] = new Array(6).fill('');
  resendTimer: number = 30;
  canResend: boolean = false;
  resendInterval: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appStateManage: AppStateManageService,
    private servercommunicator: ServerCommunicatorService,
    private toastService: ToastService,
    private haptic: HapticService
  ) { }

  ngOnInit() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.step = 1;
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
      this.resendInterval = null;
    }
  }

  sendOtp = async () => {
    if (this.forgotForm.get('email')?.valid) {
      const { email } = this.forgotForm.value;
      let body = { EMailId: email };
      console.log('body : sendOtp', body);
      this.appStateManage.localStorage.setItem('userEMailId', email);

      const response = await this.servercommunicator.FetchRequestForMobileApp('generateuserotp', body);
      console.log('response :sendOtp', response);
      if (response.Successful) {
        this.toastService.present("OTP generation successfully", 1000, 'success');
        console.log('OTP generation successfully:', response.Message);
        await this.haptic.success();
        this.step = 2;
        this.otpDigits = ['', '', '', '', '', ''];
        this.startResendTimer();
        return;
      } else {
        this.toastService.present(response.Message, 1000, 'danger');
        await this.haptic.error();
        console.log('OTP generation failed:', response.Message);
      }
    }
  }

  startResendTimer(): void {
    this.resendTimer = 30;
    this.canResend = false;

    if (this.resendInterval) clearInterval(this.resendInterval);

    this.resendInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        this.canResend = true;
        clearInterval(this.resendInterval);
        this.resendInterval = null;
      }
    }, 1000);
  }

  resendOtp = async () => {
    if (this.canResend) {
      const { email } = this.forgotForm.value;
      this.otpDigits = ['', '', '', '', '', ''];
      let body = { EMailId: email };
      console.log('body :resendOtp', body);

      const response = await this.servercommunicator.FetchRequestForMobileApp(
        'sendpasswordchangeemailotp',
        body
      );
      console.log('response :resendOtp', response);

      if (!response.Successful) {
        console.log('Resend OTP Error:', response.Message);
        this.toastService.present('Resend OTP Failed!', 1000, 'danger');
        await this.haptic.error();
        return;
      } else {
        console.log('Resend OTP Successful', response.Message);
        this.toastService.present("Resend OTP Successfully", 1000, 'success');
        await this.haptic.success();
        this.startResendTimer();
      }
    }
  }

  onOtpInput(event: any, index: number): void {
    const input = event.target;
    const value = input.value;

    if (!/^\d$/.test(value)) {
      this.otpDigits[index] = '';
      return;
    }

    this.otpDigits[index] = value;

    const nextInput = input.nextElementSibling;
    if (nextInput) {
      nextInput.focus();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = input.previousElementSibling as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  verifyOtp = async () => {
    const otpValue = this.otpDigits.join('');
    console.log('OTP entered:', otpValue);

    if (otpValue.length === 6) {
      const { email } = this.forgotForm.value;
      let body = {
        EMailId: email,
        OTP: otpValue
      };

      console.log('body :verifyOtp', body);
      const response = await this.servercommunicator.VerifyOTP(
        'verifyuserotp',
        body
      );
      console.log('response :verifyOtp', response);

      if (!response.Successful) {
        this.toastService.present(response.Message, 1000, 'danger');
        await this.haptic.error();
        console.log('OTP verification failed:', response.Message);
        return;
      } else {
        this.toastService.present('OTP verified successfully', 1000, 'success');
        await this.haptic.success();
        console.log('OTP verified successfully', response.Message);
        this.step = 3;
      }
    } else {
      // alert('Please enter a 6-digit OTP');
      this.toastService.present('Please enter a 6-digit OTP!', 1000, 'warning');
      await this.haptic.warning();
    }
  }

  onSubmit = async () => {
    const { newPassword, confirmPassword, email } = this.forgotForm.value;
    const otpValue = this.otpDigits.join('');

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    let body = {
      EMailId: email,
      OTP: otpValue,
      Password: newPassword,
      ConfirmPassword: confirmPassword
    };

    console.log('body :onSubmit', body);
    const response = await this.servercommunicator.FetchRequestForMobileApp(
      'changepassword',
      body
    );
    console.log('response :onSubmit', response);

    if (!response.Successful) {
      console.log('Password change failed:', response.Message);
      this.toastService.present(response.Message, 1000, 'danger');
      await this.haptic.error();
      return;
    } else {
      console.log('Password changed successfully', response.Message);
      this.toastService.present("Password changed successfully", 1000, 'success');
      await this.haptic.success();
      await this.goToLogin();
    }
  }

  goToLogin(): void {
    this.router.navigate(['mobile-app/auth/login'], { replaceUrl: true });
  }

  goBack(): void {
    if (this.step > 1) {
      this.step--;
    }
  }
}
