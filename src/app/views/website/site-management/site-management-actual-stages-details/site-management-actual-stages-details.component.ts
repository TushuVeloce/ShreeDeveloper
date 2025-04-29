import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-management-actual-stages-details',
  templateUrl: './site-management-actual-stages-details.component.html',
  standalone: false,
  styleUrls: ['./site-management-actual-stages-details.component.scss'],
})
export class SiteManagementActualStagesDetailsComponent  implements OnInit {

  constructor(private router: Router) { }

  dieselLtr: number = 0;
  amountPerLtr: number = 0;
  totalAmount: number = 0;

  calculateTotal() {
    this.totalAmount = (this.dieselLtr * this.amountPerLtr);
  }

  ngOnInit() {}

  BackActualStages() {
    this.router.navigate(['/homepage/Website/Site_Management_Actual_Stage']);
  }

}
