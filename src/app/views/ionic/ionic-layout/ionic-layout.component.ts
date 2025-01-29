import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-ionic-layout',
  templateUrl: './ionic-layout.component.html',
  styleUrls: ['./ionic-layout.component.scss'],
  standalone:false
})
export class IonicLayoutComponent  implements OnInit {

  constructor(private router: Router, private themeService: ThemeService) {
   }
  ngOnInit() {
    console.log(this.themeService.IsDarkModeSignal());
  }
  bottomNavigationTabs = async (path : string) => {
    await this.router.navigate([`/${path}`]);
  }

}
