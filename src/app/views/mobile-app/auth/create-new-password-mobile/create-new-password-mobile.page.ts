import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../core/toast.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { CraetePasswordCustomRequest } from 'src/app/classes/domain/entities/website/create_password/createpasswordcustomrequest';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';

@Component({
  selector: 'app-create-new-password-mobile',
  templateUrl: './create-new-password-mobile.page.html',
  styleUrls: ['./create-new-password-mobile.page.scss'],
  standalone:false
})
export class CreateNewPasswordMobilePage implements OnInit {
  passwordForm!: FormGroup;
  isUpdating = false;
  EmployeeRef: number = 0;
  CompanyRef: number = 0;

  constructor(private fb: FormBuilder, private router: Router, private payloadPacketFacade: PayloadPacketFacade, private serverCommunicator: ServerCommunicatorService, private appStateManage: AppStateManageService,private toastService: ToastService) {}

  ngOnInit() { 
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, { validators: this.matchPasswords });

    this.EmployeeRef = Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.CompanyRef = Number(this.appStateManage.StorageKey.getItem('SelectedCompanyRef'))

  }

  matchPasswords(group: FormGroup) {
    return group.get('newPassword')?.value === group.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onUpdatePassword= async() =>{
    if (this.passwordForm.valid) {
      this.isUpdating = true;
      const { oldPassword,newPassword, confirmPassword } = this.passwordForm.value;
       let req = new CraetePasswordCustomRequest();
      req.CompanyRef = this.CompanyRef
      req.EmployeeRef = this.EmployeeRef
      req.OldPassword = oldPassword;
      req.NewPassword = newPassword;
      req.ConfirmPassword = confirmPassword;
      let td = req.FormulateTransportData();
      let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
      let tr = await this.serverCommunicator.sendHttpRequest(pkt);
      if (!tr.Successful) {
        this.toastService.present(tr.Message, 2000, 'danger');
          return;
        }
  
      this.toastService.present("New Password Created Successfully", 2000, 'success');
      let tdResult = JSON.parse(tr.Tag) as TransportData;
      this.isUpdating = false;
      this.passwordForm.reset();
      this.router.navigate(['mobileapp/auth/login-mobile']);

      // setTimeout(() => {
      //   this.isUpdating = false;
      //   console.log('Password updated successfully');
      //   this.router.navigate(['mobileapp/tabs/dashboard']);
      //   this.toastService.present('Logged in successfully!', 2000, 'success');
      // }, 1500);
    }
  }
}
