import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  template: 'website-works',
  imports: [CommonModule, RouterOutlet],
  styleUrls: [],
})
export class WebComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
    let a = 0;
  }
  login = async () => {
    await this.router.navigate(['/website_homepage']);
  }

}
