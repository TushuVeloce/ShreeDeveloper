import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebComponent } from './web.component';
import { MaterialMasterComponent } from './Master/material-master/material-master.component';

const routes: Routes = [
  {
    path: '', component: WebComponent,
    children: [{
      path: 'Material_Master', component: MaterialMasterComponent,
    },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebRoutingModule { }
