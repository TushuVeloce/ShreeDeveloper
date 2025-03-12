import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plot } from 'src/app/classes/domain/entities/website/masters/plot/plot';
import { Site } from 'src/app/classes/domain/entities/website/masters/site/site';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-plot-master',
  standalone:false,
  templateUrl: './plot-master.component.html',
  styleUrls: ['./plot-master.component.scss'],
})
export class PlotMasterComponent  implements OnInit {
   Entity: Plot = Plot.CreateNewInstance();
   SiteList: Site[] = [];
   MasterList: Plot[] = [];
   DisplayMasterList: Plot[] = [];
   SearchString: string = '';
   SelectedPlot: Plot = Plot.CreateNewInstance();
   pageSize = 8; // Items per page
   currentPage = 1; // Initialize current page
   total = 0;
   headers: string[] = ['Sr.No.', 'Plot Name'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService,private screenSizeService: ScreenSizeService) { }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    await this.FormulateSiteList();
    this.loadPaginationData();
    this.pageSize = this.screenSizeService.getPageSize('withDropdown');

  }

   private FormulateSiteList = async () => {
      let lst = await Site.FetchEntireList(async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg)
      );
      this.SiteList = lst;
      // Set "India" (Ref: 9162) as default if present; otherwise, pick the first country.
      const defaultCountry = this.SiteList.find((c) => c.p.Ref === 9163);
      this.Entity.p.SiteRef = defaultCountry ? defaultCountry.p.Ref : this.SiteList[0]?.p.Ref;
  
      // Fetch states based on the selected country
      // if (this.Entity.p.SiteRef) {
      //   await this.getStateListByCountryRef(this.Entity.p.SiteRef);
      // }
      this.loadPaginationData();
    };

    loadPaginationData = () => {
      this.total = this.DisplayMasterList.length; // Update total based on loaded data
    }
    get paginatedList() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.DisplayMasterList.slice(start, start + this.pageSize);
    }

    
  filterTable = () => {
    const searchTerm = this.SearchString?.trim().toLowerCase();

    if (searchTerm) {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        // Check if data.p and data.p.Name exist before accessing
        return data?.p?.Name?.toLowerCase().includes(searchTerm);
      });
    } else {
      // If no search string, reset to the full list
      this.DisplayMasterList = [...this.MasterList];
    }
  };

  setSiteRef(value:number){
  this.appStateManage.setSiteRef(value)
  }

  AddPlot = async () => {
    await this.router.navigate(['/homepage/Website/Plot_Master_Details']);
  }

}
