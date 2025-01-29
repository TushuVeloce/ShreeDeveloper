import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-landing',
  template: `<ion-router-outlet></ion-router-outlet>`,
  styleUrls: [],
  standalone:false
})
export class HomeLandingComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
