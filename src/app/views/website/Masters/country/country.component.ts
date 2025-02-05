import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-country',
  standalone:false,
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent  implements OnInit {
  headers: string[] = ['Sr.No.','Country Name','Action'];

  constructor( private router: Router) { }

  ngOnInit() {}

}
