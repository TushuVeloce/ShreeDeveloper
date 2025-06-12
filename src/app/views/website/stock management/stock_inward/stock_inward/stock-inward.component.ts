import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { DTU } from 'src/app/services/dtu.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-stock-inward',
  standalone: false,
  templateUrl: './stock-inward.component.html',
  styleUrls: ['./stock-inward.component.scss'],
})
export class StockInwardComponent  implements OnInit {

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService,
     private companystatemanagement: CompanyStateManagement, private DateconversionService: DateconversionService, private dtu: DTU,
   ) {
     effect(async () => {
      //  this.getSiteListByCompanyRef()
      //  await this.getMaterialRequisitionListByCompanyRef();
     });
   }

  ngOnInit() {}

   AddInward = async () => {
    // if (this.companyRef() <= 0) {
    //   this.uiUtils.showWarningToster('Please select company');
    //   return;
    // }
    await this.router.navigate(['/homepage/Website/Stock_Inward_Details']);
  }

}
