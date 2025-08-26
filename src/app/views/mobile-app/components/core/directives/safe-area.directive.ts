import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Directive({
  selector: '[appSafeArea]',
  standalone: false,
})
export class SafeAreaDirective implements OnInit {
  /**
    * Usage:
    *   <ion-toolbar appSafeArea="top">   → safe area top only
    *   <ion-footer appSafeArea="bottom"> → safe area bottom only
    *   <div appSafeArea="all">           → safe area on all sides
    *   <div appSafeArea="top:2rem">      → safe area + 2rem extra
    */
  @Input('appSafeArea') option: string = 'all';

  constructor(private el: ElementRef, private renderer: Renderer2, private platform:Platform) { }

  ngOnInit() {
    const [side, extra] = this.option.split(':');
    const spacing = extra || '0px'; // default extra padding
    // ❌ Skip if running on web (desktop, browser, etc.)
    if (this.platform.is('desktop') || this.platform.is('mobileweb') || this.platform.is('pwa')) {
      return;
    }
    const safeAreas: Record<string, string> = {
      top: `padding-top: calc(env(safe-area-inset-top) + ${spacing}); padding-top: calc(var(--ion-safe-area-top, 0px) + ${spacing});`,
      bottom: `padding-bottom: calc(env(safe-area-inset-bottom) + ${spacing}); padding-bottom: calc(var(--ion-safe-area-bottom, 0px) + ${spacing});`,
      left: `padding-left: calc(env(safe-area-inset-left) + ${spacing}); padding-left: calc(var(--ion-safe-area-left, 0px) + ${spacing});`,
      right: `padding-right: calc(env(safe-area-inset-right) + ${spacing}); padding-right: calc(var(--ion-safe-area-right, 0px) + ${spacing});`
    };

    let style = '';
    if (side === 'all' || !side) {
      style = Object.values(safeAreas).join(' ');
    } else if (safeAreas[side]) {
      style = safeAreas[side];
    }

    const existingStyle = this.el.nativeElement.getAttribute('style') || '';
    this.renderer.setAttribute(this.el.nativeElement, 'style', `${existingStyle} ${style}`);
  }
}
