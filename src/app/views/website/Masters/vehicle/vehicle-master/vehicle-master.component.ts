import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-vehicle-master',
  standalone: false,
  templateUrl: './vehicle-master.component.html',
  styleUrls: ['./vehicle-master.component.scss'],
})
export class VehicleMasterComponent  implements OnInit {
  headers: string[] = ['Sr.No.','Vehicle Name','Action'];

  constructor( private router: Router) { }

  ngOnInit() {}

  AddVehicle(){
    this.router.navigate(['/homepage/Website/Vehicle_Master_details']);
   }

}
