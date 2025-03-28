import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-office-duty-time',
  templateUrl: './office-duty-time.component.html',
  styleUrls: ['./office-duty-time.component.scss'],
  standalone: false,
})
export class OfficeDutyTimeComponent  implements OnInit {

  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  SearchString: string = '';

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService)
  { }

  ngOnInit() {}

  headers: string[] = ['Sr.No.', 'Code', 'Material Name', 'Material Unit', 'Action'];


  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  };

  async AddOfficeTime() {
    this.router.navigate(['/homepage/Website/Office_Duty_Time_Details']);
  }


  filterTable = () => {

  }

}
