import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MobileBottomTabsComponent } from './mobile-bottom-tabs/mobile-bottom-tabs.component';
import { MobileBottomsheetDropdownComponent } from './mobile-bottomsheet-dropdown/mobile-bottomsheet-dropdown.component';
import { PlanHeaderComponent } from './plan-header/plan-header.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [MobileBottomTabsComponent,MobileBottomsheetDropdownComponent,PlanHeaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    MobileBottomTabsComponent, 
    MobileBottomsheetDropdownComponent,
    PlanHeaderComponent
  ]
})
export class SharedModule { }
