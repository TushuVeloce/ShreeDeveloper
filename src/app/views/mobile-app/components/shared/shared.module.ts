import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { HeaderWithBackHandlerComponent } from './header-with-back-handler/header-with-back-handler.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModalComponent } from './select-modal/select-modal.component';
import { FilterSheetComponent } from './filter-sheet/filter-sheet.component';
import { SkeletonLoaderComponent } from './skeleton-loader/skeleton-loader.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { CustomButtonComponent } from './custom-button/custom-button.component';
import { DateFieldComponent } from './date-field/date-field.component';
import { TransactionFilterComponent } from './transaction-filter/transaction-filter.component';
import { ChipSelectorComponent } from './chip-selector/chip-selector.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { ChipFilterMobileAppComponent } from './chip-filter-mobile-app/chip-filter-mobile-app.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { PhoneCommaFormatDirective } from '../core/directives/phone-comma-format.directive';
import { AmountCommaFormatDirective } from '../core/directives/amount-comma-format.directive';
@NgModule({
  declarations: [HeaderComponent, 
    HeaderWithBackHandlerComponent, 
    SelectModalComponent, 
    FilterSheetComponent, 
    SkeletonLoaderComponent, 
    InputFieldComponent, 
    CustomButtonComponent, 
    DateFieldComponent, 
    TransactionFilterComponent, 
    ChipSelectorComponent, 
    DatePickerComponent, 
    ChipFilterMobileAppComponent, 
    PhoneCommaFormatDirective,
    AmountCommaFormatDirective
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzModalModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] ,
  exports: [HeaderComponent, 
    HeaderWithBackHandlerComponent, 
    SelectModalComponent, 
    FilterSheetComponent, 
    SkeletonLoaderComponent, 
    InputFieldComponent, 
    CustomButtonComponent, 
    DateFieldComponent, 
    TransactionFilterComponent, 
    ChipSelectorComponent, 
    DatePickerComponent, 
    ChipFilterMobileAppComponent, 
    PhoneCommaFormatDirective,
    AmountCommaFormatDirective
  ]
})
export class SharedModule { }
