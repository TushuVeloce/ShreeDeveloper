import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-department-master',
  standalone: false,
  templateUrl: './department-master.component.html',
  styleUrls: ['./department-master.component.scss'],
})
export class DepartmentMasterComponent  implements OnInit {
  headers: string[] = ['Sr.No.','Name','Company Name','Action'];

  constructor( private router: Router) { }

  ngOnInit() {}

  AddDepartment(){
    this.router.navigate(['/homepage/Website/Department_Master_Details']);
   }

}
