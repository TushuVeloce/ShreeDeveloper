import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-management-actual-stages',
  templateUrl: './site-management-actual-stages.component.html',
  styleUrls: ['./site-management-actual-stages.component.scss'],
  standalone: false,
})
export class SiteManagementActualStagesComponent  implements OnInit {
  headers: string[] = ['Sr.No.','Date','Chalan No.','Vehicle Type','Description','Owner Name','Rate','Unit','Quantity','Amount','Action'];
  constructor(private router: Router) { }

  ngOnInit() {}
  Title: string = 'Site Management Actual Stages';

  AddStages = async () => {
    await this.router.navigate(['/homepage/Website/Site_Management_Actual_Stage_Details']);
  }

}
