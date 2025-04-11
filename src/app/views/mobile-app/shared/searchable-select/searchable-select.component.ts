import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { SelectModalComponent } from '../select-modal/select-modal.component';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.scss'],
  standalone: false
})
export class SearchableSelectComponent implements OnInit, OnDestroy {
  @Input() options: any[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() multiSelect: boolean = false;
  @Input() selectedOptions: any[] = [];

  @Output() selectionChange = new EventEmitter<any[]>();

  private backButtonSubscription: any;
  private routeSubscription: Subscription | null = null;
  private modalInstance: any = null;

  constructor(
    private modalCtrl: ModalController,
    private platform: Platform,
    private router: Router
  ) { }

  async openSelectModal() {
    this.modalInstance = await this.modalCtrl.create({
      component: SelectModalComponent,
      componentProps: {
        options: this.options,
        selectedOptions: this.selectedOptions,
        multiSelect: this.multiSelect,
      },
      breakpoints: [0, 0.3, 0.6, 1], // Define modal heights
      initialBreakpoint: 0.6, // Opens at 60% height
      handle: true, // Draggable handle
      backdropDismiss: true, // Click outside to close
    });

    await this.modalInstance.present();

    // Listen for back button
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Back button pressed - Closing modal');
      this.modalInstance.dismiss();
      this.backButtonSubscription.unsubscribe();
    });

    // Listen for route changes
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && this.modalInstance) {
        console.log('Route changed - Closing modal');
        this.modalInstance.dismiss();
      }
    });

    // Handle modal dismiss event
    const { data } = await this.modalInstance.onWillDismiss();
    this.cleanupSubscriptions();

    if (data) {
      console.log('Selected options:', data);
      this.selectedOptions = data;
      this.selectionChange.emit(this.selectedOptions);
    }
  }

  clearSelection() {
    this.selectedOptions = [];
    this.selectionChange.emit([]);
  }

  private cleanupSubscriptions() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.cleanupSubscriptions();
  }

  ngOnInit() { }
}
