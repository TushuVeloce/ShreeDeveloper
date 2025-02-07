import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Material } from 'src/app/classes/domain/entities/website/masters/material/material';
import { UIUtils } from 'src/app/services/uiutils.service';

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

  headers: string[] = ['Sr.No.', 'Material Name', 'Material Unit', 'Action'];
  constructor(private uiUtils: UIUtils, private router: Router) { }

  async ngOnInit() {
    await this.FormulateMaterialList();
    this.DisplayMasterList = [];

  }
  private FormulateMaterialList = async () => {
    let lst = await Material.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
  }

    onEditClicked = async (item: Material) => {
      this.SelectedMaterial = item.GetEditableVersion();
      Material.SetCurrentInstance(this.SelectedMaterial);

      // this.appStateManage.StorageKey.setItem('Editable', 'Edit');

      await this.router.navigate(['/homepage/Website/Material_Master_details']);
    }

    onDeleteClicked = async (material: Material) => {
      await this.uiUtils.askForConfirmation('Delete',
        `This process is IRREVERSIBLE!
      <br/>
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

    AddMaterial(){
      this.router.navigate(['/homepage/Website/Material_Master_details']);
    }
  }
