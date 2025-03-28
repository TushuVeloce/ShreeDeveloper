import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-office-duty-time-details',
  templateUrl: './office-duty-time-details.component.html',
  styleUrls: ['./office-duty-time-details.component.scss'],
})
export class OfficeDutyTimeDetailsComponent  implements OnInit {

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService)
  { }

  ngOnInit() {}

  async BackOfficeTime() {
    this.router.navigate(['/homepage/Website/Office_Duty_Time']);
  }

}
