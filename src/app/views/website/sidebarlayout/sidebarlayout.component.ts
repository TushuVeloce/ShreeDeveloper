import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebarlayout',
 standalone: true,
  templateUrl: './sidebarlayout.component.html',
  styleUrls: ['./sidebarlayout.component.scss'],
})
export class SidebarlayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  sidebarVisible: boolean = false;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

}
