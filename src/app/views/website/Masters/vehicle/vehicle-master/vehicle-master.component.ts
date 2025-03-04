import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vehicle } from 'src/app/classes/domain/entities/website/masters/vehicle/vehicle';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { UIUtils } from 'src/app/services/uiutils.service';


@Component({
  selector: 'app-vehicle-master',
  standalone: false,
  templateUrl: './vehicle-master.component.html',
  styleUrls: ['./vehicle-master.component.scss'],
})
export class VehicleMasterComponent  implements OnInit {
 Entity: Vehicle = Vehicle.CreateNewInstance();
  MasterList: Vehicle[] = [];
  DisplayMasterList: Vehicle[] = [];
  SearchString: string = '';
  SelectedVehicle: Vehicle = Vehicle.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;

  headers: string[] = ['Sr.No.','Vehicle Name','Action'];

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService,private companystatemanagement: CompanyStateManagement) {
      effect(() => {
        this.getVehicleListByCompanyRef()
      });
     }

  async ngOnInit() {
    this.appStateManage.setDropdownDisabled(false);
 //   await this.FormulateMasterList();
    this.loadPaginationData();
  }

  //  private FormulateMasterList = async () => {
  //     let lst = await Vehicle.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
  //     this.MasterList = lst;
  //     console.log(this.MasterList);
  //     this.DisplayMasterList = this.MasterList
  //     this.loadPaginationData();
  //   }

    getVehicleListByCompanyRef = async () => {
        this.MasterList = [];
        this.DisplayMasterList = [];
        if (this.companyRef() <= 0) {
          await this.uiUtils.showErrorToster('Company not Selected');
          return;
        }
          let lst = await Vehicle.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
          this.MasterList = lst;
          this.DisplayMasterList = this.MasterList;
        this.loadPaginationData();
      }
  
    onEditClicked = async (item: Vehicle) => {
      this.SelectedVehicle = item.GetEditableVersion();
      Vehicle.SetCurrentInstance(this.SelectedVehicle);
      this.appStateManage.StorageKey.setItem('Editable', 'Edit');
      await this.router.navigate(['/homepage/Website/Vehicle_Master_Details']);
    }
  
    onDeleteClicked = async (Vehicle: Vehicle) => {
      await this.uiUtils.showConfirmationMessage('Delete',
        `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Vehicle?`,
        async () => {
          await Vehicle.DeleteInstance(async () => {
            await this.uiUtils.showSuccessToster(`Vehicle ${Vehicle.p.Name} has been deleted!`);
            this.SearchString = '';
            this.loadPaginationData();
            await this.getVehicleListByCompanyRef();
          });
        });
    }
  
    // For Pagination  start ----
    loadPaginationData = () => {
      this.total = this.DisplayMasterList.length; // Update total based on loaded data
    }
  
    get paginatedList () {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.DisplayMasterList.slice(start, start + this.pageSize);
    }
  
    onPageChange  = (pageIndex: number): void => {
      this.currentPage = pageIndex; // Update the current page
    }

 async AddVehicle(){
    if (this.companyRef() <= 0) {
      this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    this.router.navigate(['/homepage/Website/Vehicle_Master_Details']);
   }
   
   filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }
}
