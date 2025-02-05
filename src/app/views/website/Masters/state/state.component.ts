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

}
