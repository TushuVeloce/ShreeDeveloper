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
    private route: ActivatedRoute
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
