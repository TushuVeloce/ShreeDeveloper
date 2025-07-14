// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class GestureService {

//   constructor() { }
// }

// src/app/services/gesture.service.ts
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Gesture, GestureController } from '@ionic/angular';
import { HapticService } from './haptic.service';

@Injectable({
  providedIn: 'root'
})
export class GestureService {
  private renderer: Renderer2;

  constructor(
    private gestureCtrl: GestureController,
    private haptic: HapticService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setupLongPress(element: HTMLElement, callback: () => void) {
    let timeout: any;

    const longPressGesture = this.gestureCtrl.create({
      el: element,
      gestureName: 'long-press',
      onStart: () => {
        timeout = setTimeout(() => {
          this.haptic.heavyImpact();
          callback();
        }, 600); // ~600ms long press
      },
      onEnd: () => {
        clearTimeout(timeout);
      }
    });

    longPressGesture.enable();
  }

  setupSwipe(element: HTMLElement, onSwipeLeft: () => void, onSwipeRight: () => void) {
    const swipeGesture = this.gestureCtrl.create({
      el: element,
      gestureName: 'swipe',
      onMove: ev => {
        if (ev.deltaX > 100) {
          this.haptic.mediumImpact();
          onSwipeRight();
        } else if (ev.deltaX < -100) {
          this.haptic.mediumImpact();
          onSwipeLeft();
        }
      }
    });

    swipeGesture.enable();
  }
}


// @ViewChild('swipeArea', { static: true }) swipeArea: ElementRef;

// constructor(private gesture: GestureService) { }

// ngAfterViewInit() {
//   this.gesture.setupLongPress(this.swipeArea.nativeElement, () => {
//     console.log('Long Press Triggered!');
//   });

//   this.gesture.setupSwipe(
//     this.swipeArea.nativeElement,
//     () => console.log('Swiped Left!'),
//     () => console.log('Swiped Right!')
//   );
// }

// <div #swipeArea style = "width: 100%; height: 200px; background: #f1f1f1;" >
//   Swipe or Long - Press me!
//     </div>