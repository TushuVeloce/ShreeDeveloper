import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPhoneCommaFormat]',
  standalone:false
})
export class PhoneCommaFormatDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const rawValue = this.el.nativeElement.value;

    // Remove non-digit characters
    const digitsOnly = rawValue.replace(/[^0-9]/g, '');

    // Break into groups of max 10 digits
    const groups: string[] = [];
    for (let i = 0; i < digitsOnly.length; i += 10) {
      groups.push(digitsOnly.substring(i, i + 10));
    }

    // Format only fully completed 10-digit numbers with comma
    let formatted = '';
    groups.forEach((group, index) => {
      formatted += group;
      const isLastGroup = index === groups.length - 1;
      if (group.length === 10 && !isLastGroup) {
        formatted += ',';
      } else if (group.length === 10 && digitsOnly.length > (index + 1) * 10) {
        // More digits coming after this full group
        formatted += ',';
      }
    });

    // Remove trailing comma if it exists and no extra digit after full 10s
    if (formatted.endsWith(',') && digitsOnly.length % 10 === 0) {
      formatted = formatted.slice(0, -1);
    }

    // Update only if value actually changes
    if (formatted !== rawValue) {
      this.renderer.setProperty(this.el.nativeElement, 'value', formatted);
      const inputEvent = new Event('input', { bubbles: true });
      this.el.nativeElement.dispatchEvent(inputEvent);
    }
  }
}
