
import { Directive, ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appCommaFormat]',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CommaFormatDirective,
      multi: true
    }
  ]
})

export class CommaFormatDirective implements ControlValueAccessor {
  private onChange = (_: any) => { };
  private onTouched = () => { };

  constructor(private el: ElementRef<HTMLInputElement>) { }

  // 🔹 Indian number formatter
  private formatINR(value: string): string {
    if (!value) return '0';

    const [whole, decimal] = value.split('.');

    // First 3 digits, then groups of 2
    let lastThree = whole.substring(whole.length - 3);
    let other = whole.substring(0, whole.length - 3);
    if (other !== '') {
      lastThree = ',' + lastThree;
      other = other.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    }
    const formattedWhole = other + lastThree;

    return decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    if (value == null) return;

    // Keep only digits and one dot
    let raw = value.replace(/,/g, '').replace(/[^\d.]/g, '');

    // ✅ allow only first dot
    const parts = raw.split('.');
    if (parts.length > 2) {
      raw = parts[0] + '.' + parts.slice(1).join('');
    }

    // ✅ allow max 2 decimals
    if (parts.length === 2) {
      parts[1] = parts[1].slice(0, 2); // keep only first 2 digits after dot
      raw = parts[0] + '.' + parts[1];
    }

    // Format with Indian commas
    const formatted = this.formatINR(raw);

    this.el.nativeElement.value = formatted;

    // send number value
    const numValue = parseFloat(raw);
    this.onChange(isNaN(numValue) ? 0 : numValue);
  }

  writeValue(value: any): void {
    if (value == null || value === '') {
      this.el.nativeElement.value = '0.00';   // ✅ default 0.00
    } else {
      const num = Number(value);
      if (isNaN(num)) {
        this.el.nativeElement.value = '0.00';
        return;
      }
      // ✅ always 2 decimals
      const fixedValue = num.toFixed(2);

      this.el.nativeElement.value = this.formatINR(fixedValue);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}

