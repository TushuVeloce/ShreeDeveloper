import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebarlayout',
 standalone: true,
  templateUrl: './sidebarlayout.component.html',
  styleUrls: ['./sidebarlayout.component.scss'],
  imports: [RouterOutlet]
})
export class SidebarlayoutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  sidebarVisible: boolean = false;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  navigateToAbout() {
    this.router.navigate(['/website_homepage/Website/demowebsite']);
  }

}
