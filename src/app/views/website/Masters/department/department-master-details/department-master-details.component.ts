import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-department-master-details',
  standalone: false,
  templateUrl: './department-master-details.component.html',
  styleUrls: ['./department-master-details.component.scss'],
})
export class DepartmentMasterDetailsComponent  implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {}

  
  CompanyRef: number = 0;
  CompanyList: string[] = ['XYZ',];
  getCompanyRef(Ref:any) {
  }

  BackDepartment(){
    this.router.navigate(['/homepage/Website/Department_Master']);
   }

}
