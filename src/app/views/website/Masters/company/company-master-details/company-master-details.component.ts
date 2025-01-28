import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-company-master-details',
  standalone:false,
  templateUrl: './company-master-details.component.html',
  styleUrls: ['./company-master-details.component.scss'],
})
export class CompanyMasterDetailsComponent  implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {}

  BackCompany(){
    this.router.navigate(['/homepage/Website/Company_Master']);
   }

}
