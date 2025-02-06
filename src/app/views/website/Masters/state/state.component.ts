import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-state',
  standalone:false,
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
})
export class StateComponent  implements OnInit {
  headers: string[] = ['Sr.No.','Country Name','Name','Action'];

  constructor( private router: Router) { }

  ngOnInit() {}

  CountryRef: number = 0;
  CountryList: string[] = ['Country 1', 'Country 2', 'Country 3'];
  getCountryRef(Ref:any) {

  }

}
