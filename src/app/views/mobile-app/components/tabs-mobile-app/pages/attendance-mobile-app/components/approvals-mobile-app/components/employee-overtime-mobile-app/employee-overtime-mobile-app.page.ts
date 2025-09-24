import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { EmployeeOvertime } from 'src/app/classes/domain/entities/website/HR_and_Payroll/Employee_Overtime/employeeovertime';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { Utils } from 'src/app/services/utils.service';
import { AlertService } from 'src/app/views/mobile-app/components/core/alert.service';
import { HapticService } from 'src/app/views/mobile-app/components/core/haptic.service';
import { LoadingService } from 'src/app/views/mobile-app/components/core/loading.service';
import { ToastService } from 'src/app/views/mobile-app/components/core/toast.service';

@Component({
  selector: 'app-employee-overtime-mobile-app',
  templateUrl: './employee-overtime-mobile-app.page.html',
  styleUrls: ['./employee-overtime-mobile-app.page.scss'],
  standalone: false,
})
export class EmployeeOvertimeMobileAppPage implements OnInit, OnDestroy {

  ngOnInit(): void {
    
  }
  ngOnDestroy(): void {
    
  }
}
