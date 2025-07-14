import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header-with-back-handler',
  templateUrl: './header-with-back-handler.component.html',
  styleUrls: ['./header-with-back-handler.component.scss'],
  standalone:false
})
export class HeaderWithBackHandlerComponent implements OnInit {
  @Input() title: string = 'Page Title';
  @Input() showBackButton: boolean = true;
  @Input() backRoute: string | null = null; //  input for back navigation

  private backButtonSubscription!: Subscription;
  private navigationStack: string[] = []; // Track navigation history

  constructor(
    private navCtrl: NavController,
    private location: Location,
    private platform: Platform,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    // Listen to router changes and update navigation stack
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.navigationStack.push(event.urlAfterRedirects);
      });
  }

  ngOnInit() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.showBackButton) {
        this.goBack();
      }
    });
  }

  goBack() {
    if (this.backRoute) {
      this.router.navigate([this.backRoute], { replaceUrl: true }); // Smart back
    } else {
      this.location.back(); // Fallback
    }
    // this.navCtrl.back(); 
    // console.log('this.navCtrl.back();  :');
  }


  goToNotificationPage() {
    this.router.navigate(['/app_homepage/notifications'], { replaceUrl: true });
  }
  
  ngOnDestroy() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }
}

// import { Location } from '@angular/common';
// import { Component, Input, OnInit, OnDestroy } from '@angular/core';
// import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// import { NavController, Platform } from '@ionic/angular';
// import { Subscription } from 'rxjs';
// import { filter } from 'rxjs/operators';

// @Component({
//   selector: 'app-header-with-back-handler',
//   templateUrl: './header-with-back-handler.component.html',
//   styleUrls: ['./header-with-back-handler.component.scss'],
//   standalone: false,
// })
// export class HeaderWithBackHandlerComponent implements OnInit, OnDestroy {
//   @Input() title: string = 'Page Title';
//   @Input() showBackButton: boolean = true;
//   @Input() backRoute: string | null = null;

//   private backButtonSubscription!: Subscription;
//   private navigationStack: string[] = [];

//   constructor(
//     private navCtrl: NavController,
//     private location: Location,
//     private platform: Platform,
//     private router: Router,
//     private route: ActivatedRoute
//   ) { }

//   ngOnInit() {
//     // Track visited URLs
//     this.router.events
//       .pipe(filter(event => event instanceof NavigationEnd))
//       .subscribe((event: NavigationEnd) => {
//         const currentUrl = event.urlAfterRedirects;
//         const lastUrl = this.navigationStack[this.navigationStack.length - 1];
//         if (currentUrl !== lastUrl) {
//           this.navigationStack.push(currentUrl);
//         }
//       });

//     // Handle Android hardware back
//     this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
//       if (this.showBackButton) {
//         this.goBack();
//       }
//     });
//   }

//   goBack() {
//     if (this.backRoute) {
//       // Navigates to a specific route
//       this.router.navigate([this.backRoute]);
//     } else if (this.navigationStack.length > 1) {
//       // Remove current page
//       this.navigationStack.pop();
//       const previousUrl = this.navigationStack.pop(); // Pop again to get real back
//       if (previousUrl) {
//         this.router.navigateByUrl(previousUrl);
//       } else {
//         this.location.back();
//       }
//     } else {
//       // If no history exists
//       this.location.back();
//     }
//   }

//   goToNotificationPage() {
//     this.router.navigate(['mobileapp/tabs/settings/notification']);
//   }

//   ngOnDestroy() {
//     if (this.backButtonSubscription) {
//       this.backButtonSubscription.unsubscribe();
//     }
//   }
// }
