import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan-header',
  templateUrl: './plan-header.component.html',
  styleUrls: ['./plan-header.component.scss'],
  standalone:false,
})
export class PlanHeaderComponent  implements OnInit {
  @Input() title: string = 'Default Title';
  constructor(private router: Router) { }

  ngOnInit() {}
  showHeader(): boolean {
    const hiddenRoutes = [
      '/app_homepage/task/add',
      '/app_homepage/task/edit',
      '/app_homepage/home',
    ];
    return !hiddenRoutes.includes(this.router.url);
  }
}
