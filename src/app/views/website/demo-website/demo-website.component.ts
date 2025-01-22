import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demo-website',
  templateUrl: './demo-website.component.html',
  styleUrls: ['./demo-website.component.scss'],
})
export class DemoWebsiteComponent  implements OnInit {
  ngOnInit() {}

  constructor(private router: Router,) { }

  
  navigateToSidebarLayout() {
    this.router.navigate(['/website_homepage']);
  }
}
