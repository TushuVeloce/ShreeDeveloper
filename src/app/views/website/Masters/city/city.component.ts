import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-city',
  standalone:false,
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss'],
})
export class CityComponent  implements OnInit {
  headers: string[] = ['Sr.No.','State Name','City Name','Action'];

  constructor( private router: Router) { }

  ngOnInit() {}
  
  StateRef: number = 0;
  StateList: string[] = ['State 1', 'State 2', 'State 3'];
  getStateRef(Ref:any) {
  }

}
