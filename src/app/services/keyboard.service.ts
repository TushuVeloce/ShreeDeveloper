import { Injectable } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  constructor() { }

  private subscriptions: Subscription[] = [];

  addShortcut(key: string, callback: () => void): void {
    const subscription = fromEvent<KeyboardEvent>(document, 'keydown').subscribe((event) => {
      if (event.key === key) {
        callback();
      }
    });
    this.subscriptions.push(subscription);
  }

  removeAllShortcuts(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }
}
