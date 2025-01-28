import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-master',
  standalone: false,
  templateUrl: './vehicle-master.component.html',
  styleUrls: ['./vehicle-master.component.scss'],
})
export class VehicleMasterComponent  implements OnInit {
  headers: string[] = ['Sr.No.','Vehicle Name','Action'];

  constructor() { }

  ngOnInit() {}

}
