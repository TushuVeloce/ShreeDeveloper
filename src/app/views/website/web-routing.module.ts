import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebComponent } from './web.component';
import { DemoWebsiteComponent } from './demo-website/demo-website.component';

const routes: Routes = [
  {
    path: '', component: WebComponent,
    children: [{
      path: 'demowebsite', component: DemoWebsiteComponent,
    },
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebRoutingModule { }
