import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { HeaderWithBackHandlerComponent } from './header-with-back-handler/header-with-back-handler.component';
import { FormsModule } from '@angular/forms';
import { SearchableSelectComponent } from './searchable-select/searchable-select.component';
import { SelectModalComponent } from './select-modal/select-modal.component';
import { FilterBottomsheetComponent } from './filter-bottomsheet/filter-bottomsheet.component';
import { DynamicFilterBottomsheetComponent } from './dynamic-filter-bottomsheet/dynamic-filter-bottomsheet.component';
import { CardListComponent } from './card-list/card-list.component';
import { DateTimeModelComponent } from './date-time-model/date-time-model.component';
import { FilterSheetComponent } from './filter-sheet/filter-sheet.component';

@NgModule({
  declarations: [HeaderComponent, HeaderWithBackHandlerComponent, SearchableSelectComponent, SelectModalComponent, FilterBottomsheetComponent, DynamicFilterBottomsheetComponent, CardListComponent, DateTimeModelComponent, FilterSheetComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] ,
  exports: [HeaderComponent, HeaderWithBackHandlerComponent, SearchableSelectComponent, SelectModalComponent, FilterBottomsheetComponent, DynamicFilterBottomsheetComponent, CardListComponent, DateTimeModelComponent, FilterSheetComponent]
})
export class SharedModule { }
