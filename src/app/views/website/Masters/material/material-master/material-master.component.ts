import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-material-master',
  standalone: false,
  templateUrl: './material-master.component.html',
  styleUrls: ['./material-master.component.scss'],
})
export class MaterialMasterComponent implements OnInit {

  Entity: Material = Material.CreateNewInstance();
  MasterList: Material[] = [];
  DisplayMasterList: Material[] = [];
  SearchString: string = '';
  SelectedMaterial: Material = Material.CreateNewInstance();

  CustomerRef: number = 0;
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;

  headers: string[] = ['Sr.No.', 'Material Name', 'Material Unit', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService) { }

  async ngOnInit() {
    await this.FormulateMaterialList();
    // this.DisplayMasterList = [];

  }
  private FormulateMaterialList = async () => {
    let lst = await Material.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList
    // console.log(this.DisplayMasterList);
  }

  onEditClicked = async (item: Material) => {
    // let props = Object.assign(MaterialProps.Blank(),item.p);
    // this.SelectedMaterial = Material.CreateInstance(props,true);

    this.SelectedMaterial = item.GetEditableVersion();
    console.log(this.SelectedMaterial);

    Material.SetCurrentInstance(this.SelectedMaterial);

    this.appStateManage.StorageKey.setItem('Editable', 'Edit');

    await this.router.navigate(['/homepage/Website/Material_Master_details']);
  }

  onDeleteClicked = async (material: Material) => {
    debugger
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
    Are you sure that you want to DELETE this Material?`,
      async () => {
        await material.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`Material ${material.p.Name} has been deleted!`);
          // await this.FormulateCustomerList();
          this.SearchString = '';
          // this.loadPaginationData();
        });
      });
  }
 
  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  }

  AddMaterial() {
    this.router.navigate(['/homepage/Website/Material_Master_details']);
  }

}
