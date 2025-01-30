import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-master-details',
  standalone: false,
  templateUrl: './employee-master-details.component.html',
  styleUrls: ['./employee-master-details.component.scss'],
})
export class EmployeeMasterDetailsComponent  implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {}

  BackEmployee(){
    this.router.navigate(['/homepage/Website/Employee_Master']);
   }

}
