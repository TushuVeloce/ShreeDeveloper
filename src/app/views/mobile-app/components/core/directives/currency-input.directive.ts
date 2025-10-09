import { CurrencyPipe } from '@angular/common';
import { Directive } from '@angular/core';

@Directive({
  selector: '[appCurrencyInput]',
  providers: [CurrencyPipe], 
  standalone:false,
})
export class CurrencyInputDirective {
  constructor() {}
}
