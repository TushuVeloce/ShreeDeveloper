import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [HeaderComponent, HeaderWithBackHandlerComponent, SearchableSelectComponent, SelectModalComponent, FilterBottomsheetComponent, DynamicFilterBottomsheetComponent, CardListComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  exports: [HeaderComponent, HeaderWithBackHandlerComponent,SearchableSelectComponent,SelectModalComponent,FilterBottomsheetComponent,DynamicFilterBottomsheetComponent,CardListComponent]
})
export class SharedModule { }
