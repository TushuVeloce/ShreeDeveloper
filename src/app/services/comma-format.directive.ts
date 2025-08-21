
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

  // @HostListener('input', ['$event.target.value'])
  // onInput(value: string) {
  //   // Keep minus sign only if it's the first character
  //   let raw = value.replace(/,/g, '').replace(/(?!^)-/g, '');
  //   raw = raw.replace(/[^\d.-]/g, '');

  //   if (raw.trim() === '') {
  //     this.el.nativeElement.value = '0';
  //     this.onChange(0);
  //     return;
  //   }

  //   const isNegative = raw.startsWith('-');
  //   raw = raw.replace(/-/g, ''); // remove all minus signs
  //   if (isNegative) raw = '-' + raw; // put back minus at start if needed

  //   const [whole, decimal] = raw.replace('-', '').split('.');
  //   const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //   const formatted = (isNegative ? '-' : '') + formattedWhole + (decimal ? '.' + decimal : '');

  //   this.el.nativeElement.value = formatted;
  //   this.onChange(raw); // send raw value (with minus) to model
  // }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    // Keep minus only if it’s at the start
    let raw = value.replace(/,/g, '').replace(/(?!^)-/g, '');
    raw = raw.replace(/[^\d.-]/g, '');

    const isNegative = raw.startsWith('-');
    raw = raw.replace(/-/g, '');
    if (isNegative) raw = '-' + raw;

    const [whole, decimal] = raw.replace('-', '').split('.');
    const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formatted = (isNegative ? '-' : '') + formattedWhole + (decimal ? '.' + decimal : '');

    this.el.nativeElement.value = formatted;

    // ✅ Send number instead of string
    const numValue = parseFloat(raw);
    this.onChange(isNaN(numValue) ? null : numValue);
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  // writeValue(value: any): void {
  //   if (value == null || value === '') {
  //     this.el.nativeElement.value = '';
  //   } else {
  //     let strValue = value.toString();
  //     const isNegative = strValue.startsWith('-');
  //     if (isNegative) {
  //       strValue = strValue.substring(1); // remove minus for formatting
  //     }

  //     const [whole, decimal] = strValue.split('.');
  //     const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //     const formatted =
  //       (isNegative ? '-' : '') +
  //       formattedWhole +
  //       (decimal ? '.' + decimal : '');

  //     this.el.nativeElement.value = formatted;
  //   }
  // }

  writeValue(value: any): void {
    if (value == null || value === '') {
      this.el.nativeElement.value = '';
    } else {
      const num = Number(value);
      if (isNaN(num)) {
        this.el.nativeElement.value = '';
        return;
      }

      const isNegative = num < 0;
      const strValue = Math.abs(num).toString();
      const [whole, decimal] = strValue.split('.');
      const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      const formatted =
        (isNegative ? '-' : '') +
        formattedWhole +
        (decimal ? '.' + decimal : '');

      this.el.nativeElement.value = formatted;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // ✅ Indian format function: 12345678 -> 1,23,45,678
  private formatIndianNumber(x: string): string {
    if (!x) return '';
    if (x.length <= 3) return x;
    let lastThree = x.slice(-3);
    let otherNumbers = x.slice(0, -3);
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
}

