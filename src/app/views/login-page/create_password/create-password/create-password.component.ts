import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CraetePasswordCustomRequest } from 'src/app/classes/domain/entities/website/create_password/createpasswordcustomrequest';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss'],
    imports: [CommonModule, NzLayoutModule,
      NzMenuModule, FormsModule] 
    })
export class CreatePasswordComponent  implements OnInit {
OldPassword: string = '';
NewPassword: string='';
ConfirmPassword:string='';
EmployeeRef:number=0;
CompanyRef:number=0;

constructor(private router: Router,private uiUtils: UIUtils,private payloadPacketFacade: PayloadPacketFacade,private serverCommunicator: ServerCommunicatorService,private appStateManage: AppStateManageService,) {}

  ngOnInit() {
    this.EmployeeRef=  Number(this.appStateManage.StorageKey.getItem('LoginEmployeeRef'))
    this.CompanyRef=  Number(this.appStateManage.StorageKey.getItem('SelectedCompanyRef'))
  }


  Save = async (oldpassword:string, newpassword: string, confirmpassword: string,) => {
    if (newpassword !== confirmpassword) {
      await this.uiUtils.showErrorMessage('Error', 'Password and Confirm Password are not the same');
      return;
    }else if(newpassword == ''){
      await this.uiUtils.showErrorMessage('Error', 'Password cannot be empty');
    }else if(confirmpassword == ''){
      await this.uiUtils.showErrorMessage('Error', 'Confirm Password cannot be empty');
    }else if(oldpassword == ''){
      await this.uiUtils.showErrorMessage('Error', 'Old Password cannot be empty');
    }
  
    let req = new CraetePasswordCustomRequest();  
    req.CompanyRef = this.CompanyRef
    req.EmployeeRef = this.EmployeeRef
    req.OldPassword = oldpassword;
    req.Password = newpassword;
    req.ConfirmPassword = confirmpassword;
    console.log('req :', req);
    let td = req.FormulateTransportData();
    let pkt = this.payloadPacketFacade.CreateNewPayloadPacket2(td);
    let tr = await this.serverCommunicator.sendHttpRequest(pkt);
  
    if (!tr.Successful) {
      await this.uiUtils.showErrorMessage('Error', tr.Message);
      return;
    }
  
    await this.uiUtils.showSuccessToster('Password Created Successfully');
    let tdResult = JSON.parse(tr.Tag) as TransportData;
    console.log('tdResult:', tdResult);
    await this.router.navigate(['/login']);
  };
  

}
