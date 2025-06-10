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
@NgModule({
  declarations: [HeaderComponent, HeaderWithBackHandlerComponent, SelectModalComponent, FilterSheetComponent, SkeletonLoaderComponent, InputFieldComponent, CustomButtonComponent, DateFieldComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] ,
  exports: [HeaderComponent, HeaderWithBackHandlerComponent, SelectModalComponent,FilterSheetComponent,SkeletonLoaderComponent,InputFieldComponent,CustomButtonComponent,DateFieldComponent]
})
export class SharedModule { }
