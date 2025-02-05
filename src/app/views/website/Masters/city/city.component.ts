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

}
