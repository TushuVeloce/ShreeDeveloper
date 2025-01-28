import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-vehicle-master-details',
  standalone: false,
  templateUrl: './vehicle-master-details.component.html',
  styleUrls: ['./vehicle-master-details.component.scss'],
})
export class VehicleMasterDetailsComponent  implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {}
  
  BackVehicle(){
    this.router.navigate(['/homepage/Website/Vehicle_Master']);
   }

}
