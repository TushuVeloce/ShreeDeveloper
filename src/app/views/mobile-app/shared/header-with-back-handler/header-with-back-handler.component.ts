import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-with-back-handler',
  templateUrl: './header-with-back-handler.component.html',
  styleUrls: ['./header-with-back-handler.component.scss'],
  standalone:false
})
export class HeaderWithBackHandlerComponent  implements OnInit {
  @Input() title: string = 'Page Title';
  @Input() showBackButton: boolean = true;

  private backButtonSubscription!: Subscription;

  constructor(
    private navCtrl: NavController,
    private location: Location,
    private platform: Platform
  ) { }

  ngOnInit() {
    // Handle Android hardware back button dynamically
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.showBackButton) {
        this.goBack();
      }
    });
  }

  goBack() {
    if (window.history.length > 1) {
       this.location.back(); // Correct way to navigate back
    } else {
      this.navCtrl.navigateRoot('/home'); // Default fallback
    }
  }

  ngOnDestroy() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }
}
