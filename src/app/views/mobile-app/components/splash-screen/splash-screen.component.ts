import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  standalone:false
})
export class SplashScreenComponent  implements OnInit {

  constructor(private router: Router) { }

  async ngOnInit() {

    // Simulate loading / auth check delay
    setTimeout(() => {
      this.router.navigate(['/mobile-app/auth'], { replaceUrl: true });
    }, 2000);
  }
}
