import { NgModule } from '@angular/core';

import { MobileRoutingModule } from './mobile-routing.module';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCardModule } from 'ng-zorro-antd/card';


@NgModule({
  declarations: [],
  imports: [
    MobileRoutingModule,
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule, NzDropDownModule, NzTableModule,
    NzPaginationModule, NzUploadModule, NzModalModule, NzCheckboxModule, NzCardModule, NzEmptyModule,
    NzTableModule, NzIconModule, NzLayoutModule, NzMenuModule, NzButtonModule, NzSelectModule, NzStepsModule, NzButtonModule, NzToolTipModule
  ]
})
export class MobileModule { }
