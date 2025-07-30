// import {
//   Directive,
//   HostListener,
//   ElementRef,
//   forwardRef
// } from '@angular/core';
// import {
//   ControlValueAccessor,
//   NG_VALUE_ACCESSOR
// } from '@angular/forms';

// @Directive({
//   selector: '[appCommaFormat]',
//   standalone: false,
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => CommaFormatDirective),
//       multi: true
//     }
//   ]
// })
// export class CommaFormatDirective implements ControlValueAccessor {
//   private onChange = (_: any) => { };
//   private onTouched = () => { };

//   constructor(private el: ElementRef<HTMLInputElement>) { }

//   @HostListener('input', ['$event.target.value'])
//   onInput(value: string) {

//     const raw = value.replace(/,/g, '').replace(/[^\d.]/g, '');
//     const numericValue = parseFloat(raw);

//     const [whole, decimal] = raw.split('.');
//     const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//     const formatted = formattedWhole + (decimal ? '.' + decimal : '');

//     this.el.nativeElement.value = formatted;
//     this.onChange(isNaN(numericValue) ? null : numericValue); // ✅ return number
//   }

//   @HostListener('blur')
//   onBlur() {
//     this.onTouched();
//   }

//   writeValue(value: any): void {
//     if (value == null) {
//       this.el.nativeElement.value = '';
//     } else {
//       const [whole, decimal] = value.toString().split('.');
//       const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//       this.el.nativeElement.value = formattedWhole + (decimal ? '.' + decimal : '');
//     }
//   }

//   registerOnChange(fn: any): void {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn: any): void {
//     this.onTouched = fn;
//   }
// }


import {
  Directive,
  HostListener,
  ElementRef,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Directive({
  selector: '[appCommaFormat]',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommaFormatDirective),
      multi: true
    }
  ]
})
export class CommaFormatDirective implements ControlValueAccessor {
  private onChange = (_: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const raw = value.replace(/,/g, '').replace(/[^\d.]/g, '');
    const numericValue = parseFloat(raw);

    const [whole, decimal] = raw.split('.');
    const formattedWhole = this.formatIndianNumber(whole);
    const formatted = formattedWhole + (decimal ? '.' + decimal : '');

    this.el.nativeElement.value = formatted;
    this.onChange(isNaN(numericValue) ? null : numericValue); // Keep raw numeric model
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  writeValue(value: any): void {
    if (value == null || value === '') {
      this.el.nativeElement.value = '';
    } else {
      const [whole, decimal] = value.toString().split('.');
      const formattedWhole = this.formatIndianNumber(whole);
      this.el.nativeElement.value = formattedWhole + (decimal ? '.' + decimal : '');
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
    let lastThree = x.substring(x.length - 3);
    let otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  }
}
