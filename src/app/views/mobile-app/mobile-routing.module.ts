import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MobileComponent } from './mobile.component';
import { DemoMobileComponent } from './demo-mobile/demo-mobile.component';

const routes: Routes = [
  {
    path: '', component: MobileComponent, 
    children: [{
        path: 'demomobile', component: DemoMobileComponent,
      },

      ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileRoutingModule { }
