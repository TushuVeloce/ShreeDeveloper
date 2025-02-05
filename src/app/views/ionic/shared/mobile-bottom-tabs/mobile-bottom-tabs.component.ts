import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-bottom-tabs',
  templateUrl: './mobile-bottom-tabs.component.html',
  styleUrls: ['./mobile-bottom-tabs.component.scss'],
  standalone:false,
})
export class MobileBottomTabsComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}
  bottomNavigationTabs = async (path: string) => {
    await this.router.navigate([`/${path}`]);
  }
  showTabs(): boolean {
    const hiddenRoutes = [
      '/app_homepage/task/add',
      '/app_homepage/task/edit',
    ];
    return !hiddenRoutes.includes(this.router.url);
  }
}
