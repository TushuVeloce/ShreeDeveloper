import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estimate-stages',
  standalone: false,
  templateUrl: './estimate-stages.component.html',
  styleUrls: ['./estimate-stages.component.scss'],
})
export class EstimateStagesComponent implements OnInit {
  headers: string[] = ['Sr.No.', 'Date', 'Site', 'Main Ledger', 'Sub Ledger', 'Description','Amount', 'Action'];

  constructor(private router: Router) { }

  ngOnInit() { }

  SiteRef: number = 0;
  SiteNameList: string[] = ['Site1', 'Site2', 'Site3'];
  SupervisorNameList: string[] = ['Supervisor1', 'Supervisor2', 'Supervisor3'];
  getOwnerRef(Ref:any) {
    // code here 
    console.log('OwnerRef');
  }

  AddStages = async () => {
    await this.router.navigate(['/homepage/Website/Estimate_Stages_details']);
  }

}
