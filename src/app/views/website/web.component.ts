import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NzI18nService, en_US, zh_CN } from 'ng-zorro-antd/i18n';


@Component({
  selector: 'app-home',
  template: `<router-outlet></router-outlet>`,
  styleUrls: [],
  imports: [RouterOutlet, CommonModule]
})
export class WebComponent implements OnInit {

  constructor(public router: Router, private i18n: NzI18nService) { }

  ngOnInit() {
    this.switchToEnglish();
  }

  switchToEnglish(): void {
    this.i18n.setLocale(en_US);
  }

  login = async () => {
    await this.router.navigate(['/website_homepage']);
  }

}
