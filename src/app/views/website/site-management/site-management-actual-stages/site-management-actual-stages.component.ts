import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-management-actual-stages',
  templateUrl: './site-management-actual-stages.component.html',
  styleUrls: ['./site-management-actual-stages.component.scss'],
  standalone: false,
})
export class SiteManagementActualStagesComponent implements OnInit {
  headers: string[] = ['Sr.No.', 'Date', 'Chalan No.', 'Vehicle Type', 'Description', 'Owner Name', 'Rate', 'Unit', 'Quantity', 'Amount', 'Action'];
  Labour_Expense: string[] = ['Sr.No.', 'Date', 'Chalan No.', 'Description', 'Department', 'Owner Name', 'Quantity', 'Amount', 'Action'];
  Other_Expense: string[] = ['Sr.No.', 'Date', 'Chalan No.', 'Description', 'Department', 'Owner Name', 'Rate', 'Quantity', 'Amount', 'Action'];
  Office_Details: string[] = ['Sr.No.', 'Date', 'Chalan No.', 'Expense Type', 'Description', 'Receiver Name', 'Amount', 'Action'];
  Government_Details: string[] = ['Sr.No.', 'Date', 'Chalan No.', 'Expense Type', 'Description', 'Receiver Name', 'Amount', 'Action'];
  constructor(private router: Router) { }

  ngOnInit() { }
  Title: string = 'Site Management Actual Stages';

  AddStages = async () => {
    await this.router.navigate(['/homepage/Website/Site_Management_Actual_Stage_Details']);
  }

  OwnerRef: number = 0;
  StageRef: number = 0;
  OwnerList: string[] = ['Owner1', 'Owner2', 'Owner3'];
  StagesList: string[] = ['Stage1', 'Stage2', 'Stage3'];
  getOwnerRef(Ref:any) {
    // code here 
    console.log('OwnerRef');
  }

}
